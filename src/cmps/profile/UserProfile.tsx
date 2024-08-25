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
  return (
    <div className="user-profile">
      <div className="user-profile__header">
        <img src={bannerUrl} alt="Banner" className="user-profile__banner-img" />
        <div className="user-profile__details">
          <img src={profilePictureUrl} alt="Profile" className="user-profile__profile-picture" />
          <div className="user-profile__title">
            <h1 className="user-profile__username">{username}</h1>
            <h2 className="user-profile__email">{email}</h2>
          </div>
        </div>
        <hr className="user-profile__divider" />
      </div>
      <div className="user-profile__user-info">
        <p className="user-profile__description">{description}</p>
      </div>
    </div>
  );
}
