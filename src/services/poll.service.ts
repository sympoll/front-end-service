import axios from "axios";
import { PollData } from "../models/PollData.model";

const pollServiceUrl =
  import.meta.env.VITE_BASE_URL +
  import.meta.env.VITE_API_GATEWAY_URL +
  import.meta.env.VITE_POLL_SERVICE_URL;

// Returns the logged in user's polls from all his groups.
export async function fetchAllUserGroupsPolls(userId : number) : Promise<PollData[]>{
  // Send a request to the User Management Service for the user's join groups list.
  // !!! TODO !!!
  const groupIds = ['group1', 'group2'] // Temporary
  console.log("Trying to fetch polls by group IDs: " + groupIds);

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
      .post(import.meta.env.VITE_POLL_SERVICE_GET_POLLS_BY_MULTIPLE_GROUP_IDS, groupIds);

    return response.data;
  } catch(err) {
    console.error("Error fetching all joined groups' polls of user ID " + userId + ". Error info: " + err);
    throw err;
  }
}

// Returns all polls of a specified group
export async function fetchPollsByGroupId(groupId : string){
  console.log("Trying to fetch polls by group ID: " + groupId);
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
      .get(import.meta.env.VITE_POLL_SERVICE_GET_POLLS_BY_GROUP_ID, { params: { groupId } } );
      
    return response.data;
  } catch(err) {
    console.error("Error fetching all polls of group with ID " + groupId + ".");
    throw err;
  }
}