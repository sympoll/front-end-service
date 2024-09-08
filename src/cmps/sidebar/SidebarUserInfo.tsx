import React, { useState } from "react";
import { UserData } from "../../models/UserData.model";
import { useNavigate } from "react-router-dom";
import ProfilePicture from "../global/ProfilePicture";
import { useAuth } from "../../context/AuthProvider";

interface SidebarUserInfoProps {
  userData: UserData;
}

export default function SidebarUserInfo({ userData }: SidebarUserInfoProps) {
  const navigate = useNavigate();
  const [isUserInfoMenuVisible, setIsUserInfoMenuVisible] = useState(false);
  const { onLogout } = useAuth();


  const navigateToUserProfile = () => {
    navigate(`/${userData.userId}`);
    setIsUserInfoMenuVisible(false);
  };

  const onUsernameClick = () => {
    setIsUserInfoMenuVisible((prev) => !prev);
  }

  return (
    <div className="sidebar-user-info-container">
      <ProfilePicture
        imageUrl={userData.profilePictureUrl}
        onClick={onUsernameClick}
      />
      <div className="sidebar-user-info-data">
        <p className="sidebar-user-info-data__username" onClick={onUsernameClick}>{userData.username}</p>
        <p>{userData.email}</p>
      </div>
      {isUserInfoMenuVisible && (
          <div className="sidebar-user-info-menu">
          <button
            onClick={navigateToUserProfile}
          >
            Profile
          </button>
          <button
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
