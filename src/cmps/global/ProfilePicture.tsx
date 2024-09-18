import { useState } from "react";

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
  const [isHovered, setIsHovered] = useState(false);

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
        style={{
          width: size,
          height: size,
          opacity: onClick ? (isHovered ? 0.9 : 1) : 1
        }}
        src={imageUrl}
        alt={altText}
        onMouseEnter={() => setIsHovered(true)} // Set hover state to true on mouse enter
        onMouseLeave={() => setIsHovered(false)} // Reset hover state on mouse leave
      ></img>
    </div>
  );
}
