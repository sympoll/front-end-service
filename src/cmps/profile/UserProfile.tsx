import React from "react";

interface UserProfileParams {
  bannerUrl: string;
  profilePictureUrl: string;
  username: string;
  email: string;
  description: string;
}

export default function UserProfile({
  bannerUrl,
  profilePictureUrl,
  username,
  email,
  description
}: UserProfileParams) {
  function capitalizeWords(input: string): string {
    return input
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return (
    <div className="user-profile">
      <div className="user-profile__header">
        <img src={bannerUrl} alt="Banner" className="user-profile__banner-img" />
        <div className="user-profile__details">
          <img src={profilePictureUrl} alt="Profile" className="user-profile__profile-picture" />
          <div className="user-profile__title">
            <h1 className="user-profile__username">{capitalizeWords(username)}</h1>
            <h2 className="user-profile__email">{email}</h2>
          </div>
        </div>
        <hr className="user-profile__divider" />
      </div>
      <div className="user-profile__info-container">
        <p className="user-profile__description">
          <h3>Description:</h3>
          <br />
          {description}
        </p>
        <p className="user-profile__user-info">SHIT</p>
      </div>
    </div>
  );
}
