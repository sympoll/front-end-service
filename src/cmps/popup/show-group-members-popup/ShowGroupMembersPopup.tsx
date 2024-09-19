import React from "react";
import CloseButton from "../../global/CloseButton";
import { GroupMember } from "../../../models/GroupMember.model";
import ShowGroupMembersPopupItem from "./ShowGroupMembersPopupItem";

interface ShowGroupMembersPopupProps {
  groupName: string;
  members: GroupMember[];
  onClose: () => void;
}

export default function ShowGroupMembersPopup({
  groupName,
  members,
  onClose
}: ShowGroupMembersPopupProps) {
  return (
    <div className="show-group-members-overlay" onClick={onClose}>
      <div className="show-group-members-overlay-container" onClick={(e) => e.stopPropagation()}>
        <CloseButton size="14px" onClose={onClose} />
        <h1 className="show-group-members-overlay__title">{"Members of " + groupName}</h1>
        <ul className="show-group-members-overlay__members-list">
          {members.map((member) => (
            <ShowGroupMembersPopupItem
              key={member.userData.userId}
              profilePictureUrl={member.userData.profilePictureUrl}
              userId={member.userData.userId}
              username={member.userData.username}
              roleName={member.roleName}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
