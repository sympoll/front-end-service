import axios from "axios";
import { GroupData } from "../models/GroupData.model";
import { GroupMember } from "../models/GroupMember.model";

const groupServiceUrl = 
    import.meta.env.VITE_BASE_URL +
    import.meta.env.VITE_API_GATEWAY_URL +
    import.meta.env.VITE_GROUP_SERVICE_URL;

const svcName = "GROUP.SVC"


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

    console.log(svcName, "Send request to create new group");
    setIsCreating(true);
    try {
        const response = await axios.post(groupServiceUrl, groupCreateRequestPayload, {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          });
    
        console.log(svcName, "Group:" + groupName + "created successfully.");
        return response.data;

      } catch(err) {
        console.error(svcName, "Error creating group:" + groupName + "error info:" + err);
        throw err;
      } finally {
        setIsCreating(false);
        setSubmitButtonText('Create Group');
      }
}

export async function fetchUserGroups(memberId:string) : Promise<GroupData[]> {
  console.log(svcName, "Send request to get '" + memberId + "' groups");

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
    console.error(svcName,"Error fetching '" + memberId + "' groups");
    throw err;
  }
}

export async function fetchGroupMembers(groupId:string) : Promise<GroupMember[]> {
  console.log(svcName,"Send request to get '" + groupId + "' members");

  try{
    const response = await axios
      .create({
        baseURL: groupServiceUrl,
        headers: {
                    "Content-Type": "application/json",
                  },
                  withCredentials: true,
                })
      .get(import.meta.env.VITE_GROUP_SERVICE_GET_ALL_MEMBERS, {params: {groupId}});
    
    return response.data;
  } catch (err) {
    console.error(svcName,"Error fetching '" + groupId + "' members");
    throw err;
  }
}