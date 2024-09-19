import React from "react";
import ProfilePicture from "../../global/ProfilePicture";
import { useNavigate } from "react-router-dom";
import defaultProfilePicture from "/imgs/profile/blank-profile-picture.jpg";

interface ShowGroupMembersPopupItemProps {
  profilePictureUrl: string;
  userId: string;
  username: string;
  roleName: string;
}

export default function ShowGroupMembersPopupItem({
  profilePictureUrl,
  userId,
  username,
  roleName
}: ShowGroupMembersPopupItemProps) {
  const navigate = useNavigate();

  const navigateToUserProfile = () => {
    navigate(`/${userId}`);
  };

  return (
    <li className="show-group-members-popup-item" onClick={navigateToUserProfile}>
      <ProfilePicture
        imageUrl={profilePictureUrl ?? defaultProfilePicture}
        onClick={navigateToUserProfile}
        size="50px"
      />
      <div className="show-group-members-popup-item__username">{username}</div>
      {roleName != "Member" && (
        <div className="show-group-members-popup-item__role">{roleName}</div>
      )}
    </li>
  );
}
