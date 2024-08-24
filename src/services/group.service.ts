import axios from "axios";
import { GroupData } from "../models/GroupData.model";

const groupServiceUrl = 
    import.meta.env.VITE_BASE_URL +
    import.meta.env.VITE_API_GATEWAY_URL +
    import.meta.env.VITE_GROUP_SERVICE_URL;


export async function createNewGroup(
    groupName:string, 
    description:string, 
    userId:string,
    setIsCreating: (data: boolean) => void,
    setSubmitButtonText: (data: string) => void) : Promise<GroupData> {
    const groupCreateRequestPayload ={
        groupName: groupName,
        description: description,
        creatorId: userId,
    };

    console.log("Send request to create new group");
    setIsCreating(true);
    try {
        const response = await axios.post(groupServiceUrl, groupCreateRequestPayload, {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          });
    
        console.log("Group:" + groupName + "created successfully.");
        return response.data;

      } catch(err) {
        console.error("Error creating group:" + groupName + "error info:" + err);
        throw err;
      } finally {
        setIsCreating(false);
        setSubmitButtonText('Create Group');
      }
}

export async function fetchUserGroups(memberId:string) : Promise<GroupData[]> {
  console.log("Send request to get '" + memberId + "' groups");

  try{
    const response = await axios
      .create({
        baseURL: groupServiceUrl,
        headers: {
                    "Content-Type": "application/json",
                  },
                  withCredentials: true,
                })
      .get(import.meta.env.VITE_GROUP_SERVICE_GET_GROUPS_BY_MEMBER_ID, { params: { memberId } } );
      
    return response.data;
  } catch (err){
    console.error("Error fetching '" + memberId + "' groups");
    throw err;
  }
}