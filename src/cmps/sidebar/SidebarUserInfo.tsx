import React, { useEffect, useState } from "react";
import { UserData } from "../../models/UserData.model";
import { useNavigate } from "react-router-dom";
import defaultProfilePictureUrl from "/imgs/profile/blank-profile-picture.jpg";
import ProfilePicture from "../global/ProfilePicture";
import { useAuth } from "../../context/AuthProvider";
import { fetchPicture } from "../../services/media.service";

interface SidebarUserInfoProps {
  userData: UserData;
}

export default function SidebarUserInfo({ userData }: SidebarUserInfoProps) {
  const navigate = useNavigate();
  const [isUserInfoMenuVisible, setIsUserInfoMenuVisible] = useState(false);
  const [profileImageSrc, setProfileImageSrc] = useState<string>(defaultProfilePictureUrl);
  const { onLogout } = useAuth();


  const navigateToUserProfile = () => {
    navigate(`/${userData.userId}`);
    setIsUserInfoMenuVisible(false);
  };

  const onUsernameClick = () => {
    setIsUserInfoMenuVisible((prev) => !prev);
  }

  useEffect(() => {
    fetchPicture(userData?.profilePictureUrl)
    .then((data) => {
      console.log("Fetched user's profile picture");
      setProfileImageSrc(data ?? defaultProfilePictureUrl);
    })
    .catch((error) => {
      console.log("Unable to fetch user's profile picture");
    });
  }, [userData.profileBannerUrl]);

  return (
    <div className="sidebar-user-info-container">
      <ProfilePicture
        imageUrl={profileImageSrc}
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
