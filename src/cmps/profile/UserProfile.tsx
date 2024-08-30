import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserData } from "../../models/UserData.model";
import { fetchUserData } from "../../services/user.profile.service";
import LoadingAnimation from "../global/LoadingAnimation";
import { getTimePassed } from "../../services/poll.service";
import ContentPageMessage from "../content-page/messege/ContentPageMessage";

export default function UserProfile() {
  const { userId } = useParams();
  const [userData, setUserData] = useState<UserData>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>();

  // TODO: pull image urls from server
  const profilePictureUrl =
    "https://as1.ftcdn.net/v2/jpg/03/39/45/96/1000_F_339459697_XAFacNQmwnvJRqe1Fe9VOptPWMUxlZP8.jpg";
  const bannerPictureUrl =
    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e1fc0f08-7c3c-4224-b34b-1fe510feb6fd/d51vvz0-03d69283-b7d4-495e-82f8-5103f09d2b9a.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2UxZmMwZjA4LTdjM2MtNDIyNC1iMzRiLTFmZTUxMGZlYjZmZFwvZDUxdnZ6MC0wM2Q2OTI4My1iN2Q0LTQ5NWUtODJmOC01MTAzZjA5ZDJiOWEucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.G5uPqH18xVbG7tywZNXVjRmX0W1_bfNbi1cvdR6XZXw";

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
  }, []);

  function capitalizeWords(input: string): string {
    return input
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

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
        <img src={bannerPictureUrl} alt="Banner" className="user-profile__banner-img" />
        <div className="user-profile__details">
          <img src={profilePictureUrl} alt="Profile" className="user-profile__profile-picture" />
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
