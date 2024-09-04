import React, { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserData } from "../../models/UserData.model";
import { fetchUserData } from "../../services/user.profile.service";
import LoadingAnimation from "../global/LoadingAnimation";
import { getTimePassed } from "../../services/poll.service";
import ContentPageMessage from "../content-page/messege/ContentPageMessage";
import { uploadProfileImage } from "../../services/media.service";
import defaultProfilePictureUrl from "/imgs/profile/blank-profile-picture.jpg";
import defaultProfileBannerUrl from "/imgs/profile/blank-profile-banner.jpg";

export default function UserProfile() {
  const { userId } = useParams();
  const [userData, setUserData] = useState<UserData>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isProfilePictureMenuVisible, setIsProfilePictureMenuVisible] = useState<boolean>(false);
  const [isProfileBannerMenuVisible, setIsProfileBannerMenuVisible] = useState<boolean>(false);

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

  const handleProfileImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    console.log("Profile picture was added, uploading...");
    const file = event.target.files?.[0];

    if (file && userId) {
      const targetId = event.target.id;

      if (targetId === "profile-picture-upload-input") {
        console.log("Profile picture input was clicked");

        try {
          console.log("uploading file: " + file?.name);
          const response = await uploadProfileImage(userId, file, "profile picture");

          // Update the local user data to include the newly uploaded profile picture
          setUserData(
            (prevUserData) =>
              prevUserData && { ...prevUserData, profilePictureUrl: response.imageUrl }
          );
        } catch (error) {
          console.error("Failed to upload profile picture: ", error);
        }
      } else if (targetId === "profile-banner-upload-input") {
        console.log("Profile banner input was clicked");

        try {
          console.log("uploading file: " + file?.name);
          const response = await uploadProfileImage(userId, file, "profile banner");

          // Update the local user data to include the newly uploaded profile banner
          setUserData(
            (prevUserData) =>
              prevUserData && { ...prevUserData, profileBannerUrl: response.imageUrl }
          );
        } catch (error) {
          console.error("Failed to upload profile banner: ", error);
        }
      } else {
        console.error("Unknown input");
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

  const toggleProfileBannerMenu = () => {
    setIsProfileBannerMenuVisible(!isProfileBannerMenuVisible);
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
        <div className="user-profile__profile-banner-container" onClick={toggleProfileBannerMenu}>
          <div>
            <img
              src={userData.profileBannerUrl ? userData.profileBannerUrl : defaultProfileBannerUrl}
              alt="Banner"
              className="user-profile__banner-img"
            />
          </div>
          {isProfileBannerMenuVisible && (
            <div className="user-profile__profile-banner-menu">
              <button
                onClick={() => document.getElementById("profile-banner-upload-input")?.click()}
              >
                Upload Profile Banner
              </button>
            </div>
          )}
          <input
            id="profile-banner-upload-input"
            type="file"
            accept="image/*"
            title=""
            className="user-profile__upload-profile-banner-input"
            onChange={handleProfileImageUpload}
          />
        </div>
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
                className="user-profile__profile-img"
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
              onChange={handleProfileImageUpload}
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
