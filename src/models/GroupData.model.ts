import { GroupMember } from "./GroupMember.model";

export interface GroupData{
    groupId: string,
    groupName: string,
    description: string,
    userId: string,
    timeCreated: string;
    membersList: GroupMember[];
}