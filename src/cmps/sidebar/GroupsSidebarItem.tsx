import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material/SvgIcon";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import ProfilePicture from "../global/ProfilePicture";
import React from "react";

interface GroupsSidebarItemProps {
  title: string;
  path: string;
  iconSvg?: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  profilePictureUrl?: string;
}

export default function GroupsSidebarItem({
  title,
  path,
  iconSvg,
  profilePictureUrl
}: GroupsSidebarItemProps) {
  // Find the current path, compare it to the given path.
  // If currently in the given path, set the sidebar item's ID as active.
  const navigate = useNavigate();
  const location = useLocation();
  const getID = matchPath(path, location.pathname) ? "groups-sidebar-item-active" : "";

  return (
    <li className="groups-sidebar-item-container" id={getID} onClick={() => navigate(path)}>
      <div className="groups-sidebar-activated-item-highlight" id={"highlight-" + getID}></div>
      <div id="groups-sidebar-item-icon">
        {iconSvg && React.createElement(iconSvg)}{" "}
        {profilePictureUrl && <ProfilePicture size="26px" imageUrl={profilePictureUrl} />}
      </div>
      <div id="groups-sidebar-item-title">{title}</div>
    </li>
  );
}
