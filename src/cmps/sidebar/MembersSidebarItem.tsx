import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePicture from "../global/ProfilePicture";
import defaultProfilePictureUrl from "/imgs/profile/blank-profile-picture.jpg";
import { fetchPicture } from "../../services/media.service";

interface MembersSidebarItemProps {
  name: string;
  profilePictureUrl: string;
  path: string;
  role: string;
}

export default function MembersSidebarItem({
  name,
  profilePictureUrl,
  path,
  role
}: MembersSidebarItemProps) {
  // Find the current path, compare it to the given path.
  // If currently in the given path, set the sidebar item's ID as active.
  const navigate = useNavigate();
  const [isRegularMember, setIsRegularMember] = useState(true);
  const [profileImageSrc, setProfileImageSrc] = useState<string>(defaultProfilePictureUrl);

  useEffect(() => {
    if (role !== "Member") {
      setIsRegularMember(false);
    } else {
      setIsRegularMember(true);
    }
  }, [role]);

  useEffect(() => {
    fetchPicture(profilePictureUrl)
    .then((data) => {
      console.log("Fetched user's profile picture");
      setProfileImageSrc(data ?? defaultProfilePictureUrl);
    })
    .catch((error) => {
      console.log("Unable to fetch user's profile picture");
    });
  }, []);

  return (
    <li className="members-sidebar-item-container" onClick={() => navigate(path)}>
      <div id="members-sidebar-item-icon">
        <ProfilePicture
          size="20px"
          imageUrl={profileImageSrc}
        />
      </div>
      <div id="members-sidebar-item-name">{name}</div>
      {!isRegularMember && <div className="members-sidebar-item-role">{role}</div>}
    </li>
  );
}
