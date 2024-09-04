import axios from "axios";
import { GroupData } from "../models/GroupData.model";
import { GroupMember } from "../models/GroupMember.model";
import { UserData } from "../models/UserData.model";
import { throwAxiosErr } from "./error.service";
import { UserRole } from "../models/UserRole.model";


const groupServiceUrl = 
    import.meta.env.VITE_BASE_URL +
    import.meta.env.VITE_API_GATEWAY_URL +
    import.meta.env.VITE_GROUP_SERVICE_URL;

const svcName = "GROUP.SVC "


export async function createNewGroup(
    groupName: string, 
    description: string, 
    userId: string,
    setIsCreating: (data: boolean) => void,
    setSubmitButtonText: (data: string) => void) : Promise<GroupData> {
    const groupCreateRequestPayload ={
        groupName: groupName,
        description: description,
        creatorId: userId,
    };

    console.log(svcName, "Sending request to create a new group: '" + groupName + "'.");
    setIsCreating(true);
    try {
        const response = await axios.post(groupServiceUrl, groupCreateRequestPayload, {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          });
    
        console.log(svcName, "Group: '" + groupName + "' created successfully.");
        return response.data;

      } catch(err) {
        console.error(svcName, "Error creating group: '" + groupName + "' error info: " + err);
        throw throwAxiosErr(err);;
      } finally {
        setIsCreating(false);
        setSubmitButtonText('Create Group');
      }
}

export async function fetchUserGroups(memberId:string) : Promise<GroupData[]> {
  console.log(svcName, "Sending request to get groups of member: '" + memberId + "'");

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
    throw throwAxiosErr(err);;
  }
}

export async function fetchGroupMembers(groupId: string) : Promise<GroupMember[]> {
  console.log(svcName,"Sending request to get members of group: '" + groupId + "'");

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
    console.error(svcName, "Error fetching members of group: '" + groupId + "'");
    throw throwAxiosErr(err);;
  }
}

export async function fetchGroupData(groupId:string) : Promise<GroupData> {
  console.log(svcName, "Sending request to get data of group: '" + groupId + "'");

  try{
    const response = await axios
      .create({
        baseURL: groupServiceUrl,
        headers: {
                    "Content-Type": "application/json",
                  },
                  withCredentials: true,
                })
      .get(import.meta.env.VITE_GROUP_SERVICE_GET_GROUP_DATA, {params: {groupId}});
    
    return response.data;
  } catch (err) {
    console.error(svcName, "Error fetching '" + groupId + "' data");
    throw throwAxiosErr(err);;
  }
}

export async function removeMemberFromGroup(groupId:string, userId:string) : Promise<GroupMember>{
  console.log(svcName, "Sending request to delete user: '" + userId + "' from the group: '" + groupId +"'.");

  try{
    const response = await axios
      .create({
        baseURL: groupServiceUrl,
        headers: {
                    "Content-Type": "application/json",
                  },
                  withCredentials: true,
                })
      .delete(import.meta.env.VITE_GROUP_SERVICE_REMOVE_MEMBER, {params: {groupId, userId}});
    
    return response.data;
  } catch (err) {
    console.error(svcName, "Error deleting user: '" + userId + "' from the group: '" + groupId +"'.");
    throw throwAxiosErr(err);;
  }
}

export async function addMemberToGroup(groupId:string, username:string) : Promise<GroupMember> {
  console.log(svcName, "Sending request to add user: '" + username + "' to the group: '" + groupId +"'.");

  try{
    const response = await axios
    .create({
      baseURL: groupServiceUrl,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    .post(
      import.meta.env.VITE_GROUP_SERVICE_ADD_MEMBER,
      null, 
      { 
        params: {
          groupId: groupId,
          username: username,
        },
      });
    
    return response.data;
  } catch (err) {
    console.error(svcName, "Error adding user: '" + username + "' to the group: '" + groupId +"'.");
    throw throwAxiosErr(err);;
  }
}

export async function deleteGroupById(groupId:string) {
  console.log(svcName, "Sending request to delete the group: '" + groupId +"'.");
 
    try {
      const response = await axios.delete(groupServiceUrl, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
          params: {
            groupId: groupId,
          },
        });
    
    return response.data;
  } catch (err) {
    console.error(svcName, "Error deleting the group: '" + groupId +"'.");
    throw throwAxiosErr(err);;
  }
}

export async function createUserRole(userId:string, groupId:string, roleName:string) : Promise<UserRole> {
  console.log(svcName, "Sending request to create user role for '" + userId +"' in group '" + groupId +"'.");

  const createUserRoleRequestPayload ={
    userId: userId,
    groupId: groupId,
    roleName: roleName,
  };

  try {
    const response = await axios
    .create({
      baseURL: groupServiceUrl,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    .post(
      import.meta.env.VITE_GROUP_SERVICE_USER_ROLE,
      createUserRoleRequestPayload, 
      );
    
    return response.data;
  } catch(err) {
    console.error(svcName, "Error creating user role for '" + userId + "' error info: " + err);
    throw throwAxiosErr(err);;
  }
}

export async function updateUserRole(userId:string, groupId:string, roleName:string) : Promise<string> {
  console.log(svcName, "Sending request to update user role for '" + userId +"' in group '" + groupId +"'.");

  const updateUserRoleRequestPayload ={
    userId: userId,
    groupId: groupId,
    newRoleName: roleName,
  };

  try {
    const response = await axios
    .create({
      baseURL: groupServiceUrl,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    .put(
      import.meta.env.VITE_GROUP_SERVICE_USER_ROLE,
      updateUserRoleRequestPayload, 
      );
    
    return response.data;
  } catch(err) {
    console.error(svcName, "Error updating user role for '" + userId + "' error info: " + err);
    throw throwAxiosErr(err);;
  }
}

export async function deleteUserRole(userId:string, groupId:string, roleName:string) : Promise<UserRole> {
  console.log(svcName, "Sending request to delete user role for '" + userId +"' in group '" + groupId +"'.");

  const deleteUserRoleRequestPayload ={
    userId: userId,
    groupId: groupId,
    roleName: roleName,
  };

  try {
    const response = await axios
    .create({
      baseURL: groupServiceUrl,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }).delete(
      import.meta.env.VITE_GROUP_SERVICE_USER_ROLE, {
      data: deleteUserRoleRequestPayload,
    });
    
    return response.data;
  } catch(err) {
    console.error(svcName, "Error deleting user role for '" + userId + "' error info: " + err);
    throw throwAxiosErr(err);;
  }
}
