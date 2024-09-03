import React from "react";
import ProfilePicture from "../global/ProfilePicture";
import { UserData } from "../../models/UserData.model";
import { useNavigate } from "react-router-dom";

interface SidebarUserInfoProps {
  userData: UserData;
}

export default function SidebarUserInfo({ userData }: SidebarUserInfoProps) {
  const navigate = useNavigate();

  return (
    <div className="sidebar-user-info-container">
      <ProfilePicture
        imageUrl={userData.profilePictureUrl}
        onClick={() => navigate(`/${userData.userId}`)}
      />
      <div className="sidebar-user-info-data">
        <p>{userData.username}</p>
        <p>{userData.email}</p>
      </div>
    </div>
  );
}
