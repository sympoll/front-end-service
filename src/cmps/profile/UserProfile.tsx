import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserData } from "../../models/UserData.model";
import { fetchUserData } from "../../services/user.profile.service";
import LoadingAnimation from "../global/LoadingAnimation";
import { getTimePassed } from "../../services/poll.service";
import ContentPageMessage from "../content-page/messege/ContentPageMessage";
import { fetchPicture, uploadUserProfileImage } from "../../services/media.service";
import defaultProfilePictureUrl from "/imgs/profile/blank-profile-picture.jpg";
import defaultProfileBannerUrl from "/imgs/profile/blank-profile-banner.jpg";
import ProfilePicture from "../global/ProfilePicture";
import { fetchUserGroups } from "../../services/group.service";
import { useGroups } from "../../context/GroupsContext";
import { GroupData } from "../../models/GroupData.model";
import { useUser } from "../../context/UserContext";

export default function UserProfile() {
  const { userId } = useParams();
  const [userData, setUserData] = useState<UserData>();
  const [groups, setGroups] = useState<GroupData[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isProfilePictureMenuVisible, setIsProfilePictureMenuVisible] = useState<boolean>(false);
  const [isProfileBannerMenuVisible, setIsProfileBannerMenuVisible] = useState<boolean>(false);
  const [canSetPictures, setCanSetPictures] = useState(false);
  const [profileImageSrc, setProfileImageSrc] = useState<string>(defaultProfilePictureUrl);
  const [bannerImageSrc, setBannerImageSrc] = useState<string>(defaultProfileBannerUrl);
  const { user } = useUser();

  const navigate = useNavigate();
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
        setCanSetPictures(true);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Unable to fetch user with ID " + userId);
        setErrorMessage("User with ID '" + userId + "' does not exist...");
        setIsLoading(false);
      });

    fetchUserGroups(userId)
      .then((data) => {
        console.log("Fetched user's groups: ", data);
        setGroups(data);
      })
      .catch((error) => {
        console.log("Unable to fetch groups of user with ID " + userId);
        setErrorMessage("Unable to fetch groups of user with ID " + userId);
      });
      
  }, [userId]);

  useEffect(() => {
    if(canSetPictures){
      fetchPicture(userData?.profilePictureUrl)
      .then((data) => {
        console.log("Fetched user's profile picture");
        setProfileImageSrc(data ?? defaultProfilePictureUrl);
      })
      .catch((error) => {
        console.log("Unable to fetch user's profile picture");
        setErrorMessage("Unable to fetch user's profile picture" + userId);
      });

      fetchPicture(userData?.bannerPictureUrl)
      .then((data) => {
        console.log("Fetched user's bannner picture");
        setBannerImageSrc(data ?? defaultProfileBannerUrl);
      })
      .catch((error) => {
        console.log("Unable to fetch user's banner picture");
        setErrorMessage("Unable to fetch user's banner picture" + userId);
      });

      setCanSetPictures(false);
    }
  }, [canSetPictures])

  const handleProfileImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    console.log("User profile picture was added, uploading...");
    const file = event.target.files?.[0];

    if (file && userId) {
      const targetId = event.target.id;

      if (targetId === "profile-picture-upload-input") {
        console.log("User profile picture input was clicked");

        try {
          console.log("uploading file: " + file?.name);
          const response = await uploadUserProfileImage(userId, file, "profile picture");

          // Update the local user data to include the newly uploaded profile picture
          setUserData(
            (prevUserData) =>
              prevUserData && { ...prevUserData, profilePictureUrl: response.imageUrl }
          );
          setCanSetPictures(true);
        } catch (error) {
          console.error("Failed to upload user profile picture: ", error);
        }
      } else if (targetId === "profile-banner-upload-input") {
        console.log("User profile banner input was clicked");

        try {
          console.log("uploading file: " + file?.name);
          const response = await uploadUserProfileImage(userId, file, "profile banner");

          // Update the local user data to include the newly uploaded profile banner
          setUserData(
            (prevUserData) =>
              prevUserData && { ...prevUserData, bannerPictureUrl: response.imageUrl }
          );
          setCanSetPictures(true);
        } catch (error) {
          console.error("Failed to upload user profile banner: ", error);
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
    if(userId === user?.userId){
      setIsProfilePictureMenuVisible(!isProfilePictureMenuVisible);  
    }
  };

  const toggleProfileBannerMenu = () => {
    if(userId === user?.userId){
      setIsProfileBannerMenuVisible(!isProfileBannerMenuVisible);  
    }
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
              src={bannerImageSrc}
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
                src={profileImageSrc}
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
        <div className="user-profile__content-container">
          <div className="user-profile__content-container__row1">
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
          <div className="user-profile__content-container__row2">
            <div className="user-profile__groups-joined-container">
              <h3>Joined Groups:</h3>
              <br />
              <div className="user-profile__groups-joined-list">
                {groups ? (
                  groups.map((group) => (
                    <div className="user-profile__group-joined-item">
                      <ProfilePicture
                        imageUrl={
                          group.profilePictureUrl
                            ? group.profilePictureUrl
                            : defaultProfilePictureUrl
                        }
                        onClick={() => navigate(`/group/${group.groupId}`)}
                      />
                      <p className="user-profile__group-joined-item__group-name">
                        {group.groupName}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>Could not load user's joined groups...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
