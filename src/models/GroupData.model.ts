import { GroupMember } from "./GroupMember.model";

export interface GroupData {
    groupId: string,
    groupName: string,
    description: string,
    profilePictureUrl: string,
    profileBannerUrl: string,
    userId: string,
    timeCreated: string;
    membersList: GroupMember[];
}