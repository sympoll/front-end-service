import React from "react";
import ProfilePicture from "../global/ProfilePicture";

interface SidebarUserInfoProps {
  username: string;
  email: string;
}

export default function SidebarUserInfo({ username, email }: SidebarUserInfoProps) {
  // TODO: pull image url from server
  const imageUrl =
    "https://as1.ftcdn.net/v2/jpg/03/39/45/96/1000_F_339459697_XAFacNQmwnvJRqe1Fe9VOptPWMUxlZP8.jpg";

  return (
    <div className="sidebar-user-info-container">
      <ProfilePicture imageUrl={imageUrl} />
      <div className="sidebar-user-info-data">
        <p>{username}</p>
        <p>{email}</p>
      </div>
    </div>
  );
}
