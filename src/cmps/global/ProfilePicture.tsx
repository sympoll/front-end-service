import React from "react";

interface ProfilePictureProps {
  imageUrl: string;
  onClick?: () => void;
  size?: string;
  altText?: string;
}

export default function ProfilePicture({
  imageUrl,
  onClick,
  size = "40px",
  altText = "Profile Picture"
}: ProfilePictureProps) {
  return (
    <div
      className="profile-picture-container"
      onClick={onClick}
      style={{
        width: size,
        height: size,
        cursor: onClick ? "pointer" : ""
      }}
    >
      <img
        className="profile-picture-image"
        style={{ width: size, height: size }}
        src={imageUrl}
        alt={altText}
      ></img>
    </div>
  );
}
