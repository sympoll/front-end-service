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
        groupId: groupName,
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