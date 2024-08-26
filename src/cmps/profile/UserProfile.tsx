import React from "react";
import { useParams } from "react-router-dom";

export default function UserProfile() {
  const { username } = useParams();
  // TODO: Request from the user-service info of the user received in the params.

  // TODO: pull image urls from server
  const profilePictureUrl =
    "https://as1.ftcdn.net/v2/jpg/03/39/45/96/1000_F_339459697_XAFacNQmwnvJRqe1Fe9VOptPWMUxlZP8.jpg";
  const bannerPictureUrl =
    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e1fc0f08-7c3c-4224-b34b-1fe510feb6fd/d51vvz0-03d69283-b7d4-495e-82f8-5103f09d2b9a.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2UxZmMwZjA4LTdjM2MtNDIyNC1iMzRiLTFmZTUxMGZlYjZmZFwvZDUxdnZ6MC0wM2Q2OTI4My1iN2Q0LTQ5NWUtODJmOC01MTAzZjA5ZDJiOWEucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.G5uPqH18xVbG7tywZNXVjRmX0W1_bfNbi1cvdR6XZXw";

  const desc =
    "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.";

  const email = username + "@gmail.com";

  function capitalizeWords(input: string): string {
    return input
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return (
    <div className="user-profile">
      <div className="user-profile__header">
        <img src={bannerPictureUrl} alt="Banner" className="user-profile__banner-img" />
        <div className="user-profile__details">
          <img src={profilePictureUrl} alt="Profile" className="user-profile__profile-picture" />
          <div className="user-profile__title">
            <h1 className="user-profile__username">
              {capitalizeWords(username ? username : "Error getting username param")}
            </h1>
            <h2 className="user-profile__email">{email}</h2>
          </div>
        </div>
        <hr className="user-profile__divider" />
      </div>
      <div className="user-profile__info-container">
        <div className="user-profile__description">
          <h3>Description:</h3>
          <br />
          {desc}
        </div>
        <div className="user-profile__user-info">
          <h3>Info:</h3>
          <br />
          Some info about the user... <br />
          Time created.... <br />
          How many groups the user is in... <br />
          etc...
        </div>
      </div>
    </div>
  );
}
