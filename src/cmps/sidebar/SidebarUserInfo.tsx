import React from "react";
import { UserData } from "../../models/UserData.model";
import { useNavigate } from "react-router-dom";
import defaultProfilePictureUrl from "/imgs/profile/blank-profile-picture.jpg";
import ProfilePicture from "../global/ProfilePicture";

interface SidebarUserInfoProps {
  userData: UserData;
}

export default function SidebarUserInfo({ userData }: SidebarUserInfoProps) {
  const navigate = useNavigate();
  const navigateToUserProfile = () => navigate(`/${userData.userId}`);

  return (
    <div className="sidebar-user-info-container">
      <ProfilePicture
        imageUrl={
          userData.profilePictureUrl ? userData.profilePictureUrl : defaultProfilePictureUrl
        }
        onClick={navigateToUserProfile}
      />
      <div className="sidebar-user-info-data">
        <p className="sidebar-user-info-data__username" onClick={navigateToUserProfile}>{userData.username}</p>
        <p>{userData.email}</p>
      </div>
    </div>
  );
}
