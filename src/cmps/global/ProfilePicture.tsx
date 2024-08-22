import React from "react";

interface ProfilePictureProps {
  imageUrl: string;
  size?: string;
  altText?: string;
}

export default function ProfilePicture({
  imageUrl,
  size = "40px",
  altText = "Profile Picture"
}: ProfilePictureProps) {
  return (
    <div className="profile-picture-container" style={{ width: size, height: size }}>
      <img className="profile-picture-image" src={imageUrl} alt={altText}></img>
    </div>
  );
}
