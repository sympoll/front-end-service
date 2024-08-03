import axios from "axios";
import { CheckboxChoiceType } from "../cmps/feed/poll/CheckboxChoiceType"
import { PollData } from "../models/PollData.model";

const pollServiceUrl =
  import.meta.env.VITE_BASE_URL +
  import.meta.env.VITE_API_GATEWAY_URL +
  import.meta.env.VITE_POLL_SERVICE_URL;

// Returns the logged in user's polls from all his groups.
export async function fetchAllUserGroupsPolls(userId : number) : Promise<PollData[]>{
  // Send a request to the User Management Service for the user's join groups list.
  // !!! TODO !!!
  const groupIds = ["13f7c5f4-6291-4b54-bf8c-12969e1b8d36', '7417e489-212b-48d3-bd10-904b91b3d63f"] // Temporary

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
      .post(import.meta.env.VITE_POLL_SERVICE_GET_POLLS_BY_MULTIPLE_GROUP_IDS, { groupIds });

    return response.data;
  } catch(err) {
    console.error("Error fetching all joined groups' polls of user ID " + userId + ". Error info: " + err);
    throw err;
  }
}

// Returns all polls of a specified group
export async function fetchPollsByGroupId(groupId : number){
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
      .get(import.meta.env.VITE_POLL_SERVICE_GET_POLLS_BY_GROUP_ID, { params: groupId } );
      
    return response.data;
  } catch(err) {
    console.error("Error fetching all polls of group with ID " + groupId + ".");
    throw err;
  }
}