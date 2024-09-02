import axios, { AxiosError } from "axios";
import { PollData } from "../models/PollData.model";
import { throwAxiosErr } from "./error.service";
import { VotingItemData, VotingItemIsChecked } from "../models/VotingitemData.model";
import { removeVoteFromItem, voteOnItem } from "./vote.service";

const pollServiceUrl =
  import.meta.env.VITE_BASE_URL +
  import.meta.env.VITE_API_GATEWAY_URL +
  import.meta.env.VITE_POLL_SERVICE_URL;

// TODO: userId should be accessed from session.
const cmpName = "POLL.SVC";
const userId = import.meta.env.VITE_DEBUG_USER_ID;

/**
 * Fetch all polls of a user, most recent polls first.
 * @param userId ID of the user to fetch his polls.
 * @returns Logged in user's polls from all his groups.
 */
export async function fetchAllUserGroupsPolls(): Promise<PollData[]> {
  console.log(cmpName, "Trying to fetch polls by all user's polls");

  // Send a request to the Poll Service to get all polls of the user.
  try {
    const response = await axios
      .create({
        baseURL: pollServiceUrl,
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })
      .get(import.meta.env.VITE_POLL_SERVICE_GET_ALL_USER_POLLS, {
        params: { userId }
      });

    console.log(cmpName, "get polls successful");

    return response.data;
  } catch (err) {
    console.error(
      cmpName,
      "Error fetching all joined groups' polls of user ID " + userId + ". Error info: " + err
    );
    throw throwAxiosErr(err);
  }
}

/**
 * Returns all polls of a specified group.
 * @param groupId ID string of the group to fetch its polls.
 * @returns A raw list of polls returned from poll-service microservice.
 */
export async function fetchPollsByGroupId(groupId: string) {
  console.log(cmpName, "Trying to fetch polls by group ID: " + groupId);
  // Send a request to the Poll Service to get all polls of the specified groups.
  try {
    const response = await axios
      .create({
        baseURL: pollServiceUrl,
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })
      .get(import.meta.env.VITE_POLL_SERVICE_GET_POLLS_BY_GROUP_ID, {
        params: { groupId }
      });

    console.log(cmpName, "get polls successful");

    return response.data;
  } catch (err) {
    console.error(cmpName, "Error fetching all polls of group with ID " + groupId + ".");
    throw throwAxiosErr(err);
  }
}

/**
 * Convert timestamp to how many hours/days passed since the time a poll was posted.
 * @param postTimestamp Timestamp of the time a poll was posted.
 */
export function getTimePassed(postTimestamp: string): string {
  const now = new Date();
  const postedDate = new Date(postTimestamp);
  const diffInSeconds = Math.floor((now.getTime() - postedDate.getTime()) / 1000);

  const timePassedStr = convertSecondsPassedToString(diffInSeconds);
  return timePassedStr === "now" ? "now" : timePassedStr + " ago";
}

/**
 * Convert timestamp to how many hours/days to a deadline of a poll.
 * @param deadlineTimestamp Timestamp of the deadline time of a poll.
 */
export function getTimeToDeadline(deadlineTimestamp: string): string {
  const now = new Date();
  const deadlineDate = new Date(deadlineTimestamp);
  const diffInSeconds = Math.floor((deadlineDate.getTime() - now.getTime()) / 1000);

  return convertSecondsPassedToString(diffInSeconds);
}

/**
 * Convert number of seconds that passed between two timestamps to a string.
 * @param diffInSeconds Number of seconds passed from the time a poll was posted to now.
 */
function convertSecondsPassedToString(diffInSeconds: number): string {
  const secondsInMinute = 60;
  const secondsInHour = 60 * secondsInMinute;
  const secondsInDay = 24 * secondsInHour;

  const days = Math.floor(diffInSeconds / secondsInDay);
  const hours = Math.floor((diffInSeconds % secondsInDay) / secondsInHour);
  const minutes = Math.floor((diffInSeconds % secondsInHour) / secondsInMinute);
  const seconds = diffInSeconds % secondsInMinute;

  const daysStr = days > 0 ? (days === 1 ? `${days} day` : `${days} days`) : undefined;
  const hoursStr = hours > 0 ? (hours === 1 ? `${hours} hour` : `${hours} hours`) : undefined;
  const minutesStr =
    minutes > 0 ? (minutes === 1 ? `${minutes} minute` : `${minutes} minutes`) : undefined;
  const secondsStr = seconds === 1 ? `${seconds} second` : `${seconds} seconds`;

  const delimiter = ", ";

  if (daysStr) {
    return hoursStr ? daysStr + delimiter + hoursStr : daysStr;
  } else if (hoursStr) {
    return minutesStr ? hoursStr + delimiter + minutesStr : hoursStr;
  } else if (minutesStr) {
    return minutesStr;
  } else {
    return secondsStr;
  }
}

// Calculates the progress percentage for a given voting item based on the total votes
export const getProgress = (votingItemId: string, votingItemsData: VotingItemData[]): number => {
  let totalCount = 0;
  let changedItem: VotingItemData | undefined;

  // Sum up total votes and find the specific voting item
  votingItemsData.forEach((vItemData) => {
    if (vItemData.votingItemId === votingItemId) changedItem = vItemData;
    totalCount += vItemData.voteCount;
  });

  // Calculate and return progress percentage
  if (changedItem) return (changedItem.voteCount / (totalCount ? totalCount : 1)) * 100;
  return 0;
};

// Checks if a specific voting item is currently checked
export const getIsChecked = (
  votingItemId: string,
  isCheckedStates: VotingItemIsChecked[]
): boolean => {
  // Returns true if the item is checked, otherwise false
  return (
    isCheckedStates.find((isCheckedState) => isCheckedState.votingItemId === votingItemId)
      ?.isChecked || false
  );
};

// Updates vote counts of voting items based on user interaction
export const getUpdatedVoteCounts = (
  inputId: string,
  inputIsInc: boolean,
  votingItemsData: VotingItemData[],
  isCheckedStates: VotingItemIsChecked[],
  isSingleChoice: boolean
): VotingItemData[] => {
  return votingItemsData.map((item) => {
    // Adjust vote count for the clicked item
    if (item.votingItemId === inputId)
      return { ...item, voteCount: inputIsInc ? item.voteCount + 1 : item.voteCount - 1 };

    // Decrease vote count of the previously selected item if single choice
    if (isSingleChoice && inputIsInc) {
      const checkedState = isCheckedStates.find(
        (checkedState) => checkedState.votingItemId === item.votingItemId
      );
      if (checkedState && checkedState.isChecked) {
        return { ...item, voteCount: item.voteCount - 1 };
      }
    }

    // No change for non-clicked items in multiple choice polls
    return item;
  });
};

// Updates the checked states of voting items based on user interaction
export const getUpdatedCheckedStates = (
  inputId: string,
  inputIsInc: boolean,
  votingItemsData: VotingItemData[],
  isCheckedStates: VotingItemIsChecked[],
  isSingleChoice: boolean
): VotingItemIsChecked[] => {
  return votingItemsData.map((item) => {
    // Toggle checked state for the clicked item
    if (item.votingItemId === inputId)
      return { votingItemId: item.votingItemId, isChecked: inputIsInc };

    // Uncheck previously selected items in single choice polls
    if (isSingleChoice && inputIsInc) {
      return { votingItemId: item.votingItemId, isChecked: false };
    }

    // Return existing checked state for non-clicked items
    return {
      votingItemId: item.votingItemId,
      isChecked: getIsChecked(item.votingItemId, isCheckedStates)
    };
  });
};

// Checks whether the progress update should be prevented based on the poll type and selections
export const shouldPreventProgressUpdate = (
  inputIsInc: boolean,
  isSingleChoice: boolean,
  nofAnswersAllowed: number,
  countCheckedItems: number
): boolean => {
  // Prevent update if trying to exceed the allowed number of selections in multiple choice polls
  return !isSingleChoice && inputIsInc && nofAnswersAllowed === countCheckedItems;
};

// Determines if the poll is single choice based on the number of allowed answers
export const isSingleChoice = (nofAnswersAllowed: number): boolean => {
  return nofAnswersAllowed === 1;
};

// Counts the number of items that are checked
export const countCheckedItems = (isCheckedStates: VotingItemIsChecked[]): number => {
  return isCheckedStates.filter((item) => item.isChecked).length;
};

// Sends a request to vote or remove a vote for a specific voting item
export async function sendRequestToVoteService(isChecked: boolean, votingItemId: string) {
  try {
    // Vote on the item if checked, remove the vote if unchecked
    if (isChecked) {
      await voteOnItem(Number(votingItemId));
    } else {
      await removeVoteFromItem(Number(votingItemId));
    }
  } catch (error) {
    console.error("Error sending request:", error);
    throw error;
  }
}
