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

  return (
    <div className="sidebar-user-info-container">
      <ProfilePicture
        imageUrl={
          userData.profilePictureUrl ? userData.profilePictureUrl : defaultProfilePictureUrl
        }
        onClick={() => navigate(`/${userData.userId}`)}
      />
      <div className="sidebar-user-info-data">
        <p>{userData.username}</p>
        <p>{userData.email}</p>
      </div>
    </div>
  );
}
