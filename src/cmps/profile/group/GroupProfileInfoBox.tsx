import React, { useState } from "react";
import { GroupMember } from "../../../models/GroupMember.model";
import CustomButton from "../../global/CustomButton";
import ShowGroupMembersPopup from "../../popup/show-group-members-popup/ShowGroupMembersPopup";

interface GroupProfileInfoBoxProps {
  groupId: string;
  groupName: string;
  timePassed?: string;
  members?: GroupMember[];
}

export default function GroupProfileInfoBox({
  groupId,
  groupName,
  timePassed,
  members
}: GroupProfileInfoBoxProps) {
  const [isMembersPopupVisible, setIsMembersPopupVisible] = useState(false);

  const handleShowMembersClick = () => {
    setIsMembersPopupVisible(true);
  };
  const handleCloseMembersPopupClick = () => {
    setIsMembersPopupVisible(false);
  };

  return (
    <div>
      <h3>Info:</h3>
      <div className="group-profile__group-info__items">
        {timePassed && (
          <div>
            <h4 className="group-profile__group-info__label">Created:</h4>
            <p className="group-profile__group-info__time-passed">{timePassed}</p>
          </div>
        )}
        {groupId && (
          <div>
            <h4 className="group-profile__group-info__label">Group ID:</h4>
            <p className="group-profile__group-info__group-id">{groupId}</p>
          </div>
        )}
        {members && (
          <div>
            <h4 className="group-profile__group-info__label">Group Members:</h4>
            <p className="group-profile__group-info__members">
              {"There are " + members.length + " group members in the group."}
            </p>
            <CustomButton
              onClick={handleShowMembersClick}
              width="100%"
              height="min-content"
              fontSize="14px"
            >
              Show Group Members
            </CustomButton>
            {isMembersPopupVisible && (
              <ShowGroupMembersPopup
                groupName={groupName}
                members={members}
                onClose={handleCloseMembersPopupClick}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
