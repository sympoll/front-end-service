import React, { useEffect, useState } from "react";
import VotingItem from "./VotingItem";
import {
  VotingItemData,
  VotingItemIsChecked,
  VotingItemProgress,
} from "../../../models/VotingitemData.model";
import ErrorPopup from "../../popup/ErrorPopup";
import {
  getTimePassed,
  getTimeToDeadline,
} from "../../../services/poll.service";
import { voteOnItem, removeVoteFromItem } from "../../../services/vote.service"; // Import your service functions

interface PollProps {
  pollId: string;
  title: string;
  description: string;
  nofAnswersAllowed: number;
  creatorId: string;
  groupId: string;
  timeCreated: string;
  timeUpdated: string;
  deadline: string;
  votingItems: VotingItemData[];
  isSpecificGroup: boolean;
}

export default function Poll({
  pollId,
  title,
  description,
  nofAnswersAllowed,
  creatorId,
  groupId,
  timeCreated,
  timeUpdated,
  deadline,
  votingItems,
  isSpecificGroup,
}: PollProps) {
  const [votingItemsData, setVotingItemsData] =
    useState<VotingItemData[]>(votingItems);
  const [isCheckedStates, setIsCheckedStates] = useState<VotingItemIsChecked[]>(
    []
  ); // States array of the checked state of each voting item (checked/unchecked)
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [timePassed, setTimePassed] = useState(getTimePassed(timeCreated));

  const closeErrorPopup = () => {
    setIsErrorPopupVisible(false);
  };
  const showErrorPopup = () => {
    setIsErrorPopupVisible(true);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimePassed(getTimePassed(timeCreated));
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [timeCreated]);

  const [progresses, setProgresses] = useState<VotingItemProgress[]>(
    votingItemsData.map((vItemData) => ({
      votingItemId: vItemData.votingItemId,
      progress: getProgress(vItemData.votingItemId),
    }))
  ); // initialized using votingItemsData states array

  const countCheckedItems = () => {
    return isCheckedStates.filter((item) => item.isChecked).length;
  }; // Function to count the number of items with isChecked === true

  const isSingleChoice = () => {
    return nofAnswersAllowed === 1;
  }; // true if the poll is single choice, false otherwise.

  // Update progresses whenever votingItemsData changes
  useEffect(() => {
    setProgresses(
      votingItemsData.map((item) => ({
        votingItemId: item.votingItemId,
        progress: getProgress(item.votingItemId),
      }))
    );
  }, [votingItemsData]);

  // Don't change the states if the user has already chosen the maximum amount of voting choices,
  // and is trying to choose another (only on a multiple choices poll)
  const shouldPreventProgressUpdate = (inputIsInc: boolean) => {
    return (
      !isSingleChoice() &&
      inputIsInc &&
      nofAnswersAllowed === countCheckedItems()
    );
  };

  // On checkbox click, progress and voting count is updated
  // Returns true if changed progress, false otherwise
  function handleNewProgress(inputId: string, inputIsInc: boolean) {
    if (shouldPreventProgressUpdate(inputIsInc)) return false;

    if (isSingleChoice() && inputIsInc) {
      const previouslySelectedItem = isCheckedStates.find(
        (item) => item.isChecked
      );
      if (previouslySelectedItem) {
        sendRequestToVoteService(false, previouslySelectedItem.votingItemId);
      }
    }

    // Set new states:
    setIsCheckedStates(getUpdatedCheckedStates(inputId, inputIsInc));
    setVotingItemsData(getUpdatedVoteCounts(inputId, inputIsInc));

    // Trigger vote service call for the new selection
    sendRequestToVoteService(inputIsInc, inputId);

    return true;
  }

  async function sendRequestToVoteService(
    isChecked: boolean,
    votingItemId: string
  ) {
    try {
      if (isChecked) {
        // If the checkbox is checked, cast a vote
        await voteOnItem(Number(votingItemId)); // Convert votingItemId to number if necessary
      } else {
        // If the checkbox is unchecked, remove the vote
        await removeVoteFromItem(Number(votingItemId)); // Convert votingItemId to number if necessary
      }
    } catch (error) {
      console.error("Error sending request:", error);
      throw error; // Re-throw error to be caught in the caller function
    }
  }

  // Update vote counts of the voting items
  const getUpdatedVoteCounts = (inputId: string, inputIsInc: boolean) => {
    return votingItemsData.map((item) => {
      // This item is was clicked
      if (item.votingItemId === inputId)
        return {
          ...item,
          voteCount: inputIsInc ? item.voteCount + 1 : item.voteCount - 1,
        };

      // This item was not clicked
      if (isSingleChoice() && inputIsInc) {
        const checkedState = isCheckedStates.find(
          (checkedState) => checkedState.votingItemId === item.votingItemId
        );

        if (checkedState && checkedState.isChecked) {
          return { ...item, voteCount: item.voteCount - 1 };
        }
      }

      return item; // On multiple choice, there is no need to change the vote count of non-clicked items
    });
  };

  // Update the checked states of the voting items
  const getUpdatedCheckedStates = (inputId: string, inputIsInc: boolean) => {
    return votingItemsData.map((item) => {
      // This item is was clicked
      if (item.votingItemId === inputId)
        return {
          votingItemId: item.votingItemId,
          isChecked: inputIsInc,
        };

      // This item was not clicked
      if (isSingleChoice() && inputIsInc) {
        // Uncheck all previously checked checkboxes
        return {
          votingItemId: item.votingItemId,
          isChecked: false,
        };
      }

      // Don't change the item
      const checkedState = isCheckedStates.find(
        (checkedState) => checkedState.votingItemId === item.votingItemId
      );
      return {
        votingItemId: item.votingItemId,
        isChecked: getIsChecked(item.votingItemId),
      };
    });
  };

  //Finds the voting item state, calculates and returns the progress from its vote count
  function getProgress(votingItemId: string) {
    let totalCount = 0;
    let changedItem: VotingItemData | undefined;

    votingItemsData.forEach((vItemData) => {
      if (vItemData.votingItemId === votingItemId) changedItem = vItemData; // Find newly changed voting item
      totalCount += vItemData.voteCount;
    });

    if (changedItem)
      return (changedItem.voteCount / (totalCount ? totalCount : 1)) * 100;
    return 0;
  }

  // true if the voting item is checked, false if not
  function getIsChecked(votingItemId: string) {
    return (
      isCheckedStates.find(
        (isCheckedState) => isCheckedState.votingItemId === votingItemId
      )?.isChecked || false
    );
  }

  return (
    <section className="poll-container">
      {
        // Display Group info only on all groups tab
        isSpecificGroup ? (
          <div className="poll-info-title-container">
            <div className="poll-info-title-row1">
              {
                //TODO: change to creator name
                creatorId
              }
            </div>
            <div className="poll-info-title-row2">{timePassed}</div>
            <div className="poll-info-title-row3">
              <div className="poll-deadline">
                {"Deadline is in " + getTimeToDeadline(deadline)}
              </div>
            </div>
          </div>
        ) : (
          <div className="poll-info-title-container">
            <div className="poll-info-title-row1">{groupId}</div>
            <div className="poll-info-title-row2">
              <div className="poll-info-title-creator-name">
                {
                  //TODO: change to creator name
                  creatorId
                }
              </div>
              <div className="poll-info-title-separator">•</div>
              <div className="poll-info-title-time-posted">{timePassed}</div>
            </div>
            <div className="poll-info-title-row3">
              <div className="poll-deadline">
                {"Deadline is in " + getTimeToDeadline(deadline)}
              </div>
            </div>
          </div>
        )
      }
      <div className="poll-title">{title}</div>
      <div className="poll-description">{description}</div>
      <div className="poll-voting-container">
        <div className="poll-voting-choice-messege">
          {isSingleChoice()
            ? "Select one"
            : "Select up to " + nofAnswersAllowed + " voting options"}
        </div>
        {
          // Add voting items to the poll
          votingItems.map((vItem) => (
            <VotingItem
              key={vItem.votingItemId}
              votingItemID={vItem.votingItemId}
              description={vItem.description}
              voteCount={
                votingItemsData.find(
                  (vItemData) => vItemData.votingItemId === vItem.votingItemId
                )?.voteCount || 0
              }
              progress={
                progresses.find(
                  (pItem) => pItem.votingItemId === vItem.votingItemId
                )?.progress || 0
              }
              isChecked={
                isCheckedStates.find(
                  (cItem) => cItem.votingItemId === vItem.votingItemId
                )?.isChecked || false
              }
              handleNewProgress={handleNewProgress}
              showErrorPopup={showErrorPopup}
            />
          ))
        }
      </div>
      <p className="poll-error-message">
        {isErrorPopupVisible && (
          <ErrorPopup
            message="Already reached the limit of votes!"
            closeErrorPopup={closeErrorPopup}
          />
        )}
      </p>
    </section>
  );
}
