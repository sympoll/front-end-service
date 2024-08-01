import axios from "axios";
import { CheckboxChoiceType } from "../cmps/feed/poll/CheckboxChoiceType"

const pollServiceUrl =
  import.meta.env.VITE_BASE_URL +
  import.meta.env.VITE_API_GATEWAY_URL +
  import.meta.env.VITE_POLL_SERVICE_URL;

// Returns the logged in user's polls from all his groups.
export async function fetchAllUserGroupsPolls(userId : number){
  // Send a request to the User Management Service for the user's join groups list.
  // !!! TODO !!!

  // Send a request to the Poll Managemenet Service to get all polls of the specified groups.
  try {
    const response = await axios
      .create({
        baseURL: pollServiceUrl,
        headers: {
                    "Content-Type": "application/json",
                  },
                  withCredentials: true,
                })
      .get("/fetch-all");
    return response.data;
  } catch(err) {
    console.error("Error fetching all joined groups' polls of user ID {}. Error info: {}", userId, err);
    throw err;
  }
}

// Returns all polls of a specified group
export function fetchPollsByGroupId(groupId : number){
  // Send a request to the Poll Managemenet Service
}

export function getDemoPollsData(){
    return [
        {
          pollID: "1",
          title: "Poll Title 1",
          content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam convallis vehicula placerat.",
          mode: CheckboxChoiceType.Single,
          votingItems: [
            {
              votingItemID: "1",
              desc: "Voting option 1",
              voteCount: 0
            },
            {
              votingItemID: "2",
              desc: "Voting option 2",
              voteCount: 0
            },
            {
              votingItemID: "3",
              desc: "Voting option 3",
              voteCount: 0
            },
            {
              votingItemID: "4",
              desc: "Voting option 4",
              voteCount: 0
            },
          ]
        },
        {
          pollID: "2",
          title: "Poll Title 2",
          content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam convallis vehicula placerat. Nunc bibendum mauris ac sollicitudin commodo. Maecenas ullamcorper.",
          mode: CheckboxChoiceType.Multiple,
          votingItems: [
            {
              votingItemID: "1",
              desc: "Voting option 1",
              voteCount: 1
            },
            {
              votingItemID: "2",
              desc: "Voting option 2",
              voteCount: 2
            },
            {
              votingItemID: "3",
              desc: "Voting option 3",
              voteCount: 3
            },
            {
              votingItemID: "4",
              desc: "Voting option 4",
              voteCount: 4
            },
          ]
        },
        {
          pollID: "3",
          title: "Poll Title 3",
          content: "Nam convallis vehicula placerat. Nunc bibendum mauris ac sollicitudin commodo. Maecenas ullamcorper.",
          mode: CheckboxChoiceType.Single,
          votingItems: [
            {
              votingItemID: "1",
              desc: "Voting option 1",
              voteCount: 2
            },
            {
              votingItemID: "2",
              desc: "Voting option 2",
              voteCount: 1
            },
            {
              votingItemID: "3",
              desc: "Voting option 3",
              voteCount: 0
            },
            {
              votingItemID: "4",
              desc: "Voting option 4",
              voteCount: 5
            },
          ]
        },
      ]
    }