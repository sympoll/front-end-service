import React, { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserData } from "../../models/UserData.model";
import { fetchUserData } from "../../services/user.profile.service";
import LoadingAnimation from "../global/LoadingAnimation";
import { getTimePassed } from "../../services/poll.service";
import ContentPageMessage from "../content-page/messege/ContentPageMessage";
import { uploadProfilePicture } from "../../services/media.service";

export default function UserProfile() {
  const { userId } = useParams();
  const [userData, setUserData] = useState<UserData>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isProfilePictureMenuVisible, setIsProfilePictureMenuVisible] = useState<boolean>(false);

  const defaultProfilePictureUrl = import.meta.env.VITE_DEFAULT_USER_PROFILE_PICTURE;
  const defaultBannerPictureUrl = import.meta.env.VITE_DEFAULT_USER_PROFILE_BANNER;

  const defaultDescription = "It looks like this user hasn’t shared a profile description yet.";

  useEffect(() => {
    setIsLoading(true);

    if (!userId) {
      throw new Error("Error fetching user ID param");
    }

    fetchUserData(userId)
      .then((data) => {
        console.log("Fetched user data for user with ID: ", userId, data);
        setUserData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Unable to fetch user with ID " + userId);
        setErrorMessage("User with ID '" + userId + "' does not exist...");
        setIsLoading(false);
      });
  }, [userId]);

  const handleProfilePictureUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    console.log("Profile picture was added, uploading...");
    const file = event.target.files?.[0];

    if (file && userId) {
      try {
        const response = await uploadProfilePicture(parseInt(userId), file);
        setUserData(
          (prevUserData) =>
            prevUserData && { ...prevUserData, profilePictureUrl: response.imageUrl }
        );
      } catch (error) {
        console.error("Failed to upload profile picture: ", error);
      }
    }
  };

  function capitalizeWords(input: string): string {
    return input
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const toggleProfilePictureMenu = () => {
    setIsProfilePictureMenuVisible(!isProfilePictureMenuVisible);
  };

  if (errorMessage) {
    return <ContentPageMessage msgText={errorMessage} />;
  }

  if (isLoading) {
    return <LoadingAnimation message="Loading user profile" dots="off" />;
  }

  if (!userData) {
    return <ContentPageMessage msgText="Could not fetch user data" />;
  }

  return (
    <div className="user-profile">
      <div className="user-profile__header">
        <img
          src={userData.profileBannerUrl ? userData.profileBannerUrl : defaultBannerPictureUrl}
          alt="Banner"
          className="user-profile__banner-img"
        />
        <div className="user-profile__details">
          <div
            className="user-profile__profile-picture-container"
            onClick={toggleProfilePictureMenu}
          >
            <div>
              <img
                src={
                  userData.profilePictureUrl ? userData.profilePictureUrl : defaultProfilePictureUrl
                }
                alt="Profile"
                className="user-profile__profile-picture"
              />
            </div>
            {isProfilePictureMenuVisible && (
              <div className="user-profile__profile-picture-menu">
                <button
                  onClick={() => document.getElementById("profile-picture-upload-input")?.click()}
                >
                  Upload Profile Picture
                </button>
              </div>
            )}
            <input
              id="profile-picture-upload-input"
              type="file"
              accept="image/*"
              title=""
              className="user-profile__upload-profile-picture-input"
              onChange={handleProfilePictureUpload}
            />
          </div>
          <div className="user-profile__title">
            <h1 className="user-profile__username">{capitalizeWords(userData.username)}</h1>
            <h2 className="user-profile__email">{userData.email}</h2>
          </div>
        </div>
        <hr className="user-profile__divider" />
      </div>
      <div className="user-profile__info-container">
        <div className="user-profile__description">
          <h3>Description:</h3>
          <br />
          {defaultDescription}
        </div>
        <div className="user-profile__user-info">
          <h3>Info:</h3>
          <br />
          <h4 className="user-profile__user-info__label">Created:</h4>
          {getTimePassed(userData.timeCreated)} <br /> <br />
          <h4 className="user-profile__user-info__label">User ID:</h4> {userData.userId}
        </div>
      </div>
    </div>
  );
}
