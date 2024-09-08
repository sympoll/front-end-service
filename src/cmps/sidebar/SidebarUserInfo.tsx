import React, { useEffect, useRef, useState } from "react";
import { UserData } from "../../models/UserData.model";
import { useNavigate } from "react-router-dom";
import defaultProfilePictureUrl from "/imgs/profile/blank-profile-picture.jpg";
import ProfilePicture from "../global/ProfilePicture";
import { useAuth } from "../../context/AuthProvider";

interface SidebarUserInfoProps {
  userData: UserData;
}

export default function SidebarUserInfo({ userData }: SidebarUserInfoProps) {
  const navigate = useNavigate();
  const [isUserInfoMenuVisible, setIsUserInfoMenuVisible] = useState(false);
  const { onLogout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  const navigateToUserProfile = () => {
    navigate(`/${userData.userId}`);
    setIsUserInfoMenuVisible(false);
  };

  const onUsernameClick = () => {
    setIsUserInfoMenuVisible((prev) => !prev);
  };

  // Close the menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserInfoMenuVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div className="sidebar-user-info-container">
      <ProfilePicture
        imageUrl={
          userData.profilePictureUrl ? userData.profilePictureUrl : defaultProfilePictureUrl
        }
        onClick={onUsernameClick}
      />
      <div className="sidebar-user-info-data">
        <p className="sidebar-user-info-data__username" onClick={onUsernameClick}>
          {userData.username}
        </p>
        <p>{userData.email}</p>
      </div>
      {isUserInfoMenuVisible && (
        <div className="sidebar-user-info-menu" ref={menuRef}>
          <button onClick={navigateToUserProfile}>Profile</button>
          <button onClick={onLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}
