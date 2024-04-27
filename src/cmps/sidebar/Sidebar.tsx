import React from "react";
import SidebarItem from "./SidebarItem";
import GroupsIcon from "@mui/icons-material/Groups";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

export default function Sidebar() {
  /*
    At the moment the sidebar items don't route.
    after we add multiple groups, change to the path of the chosen group,
    by setting the path to "/group-name"
  */
  return (
    <ul className="sidebar-container">
      <SidebarItem
        title="All Groups"
        Icon={FormatListBulletedIcon}
        path="/feed"
      />
      <SidebarItem title="Group 1" Icon={GroupsIcon} path="/feed/group1" />
      <SidebarItem title="Group 69" Icon={GroupsIcon} path="/feed/group69" />
      <SidebarItem title="Group 31" Icon={GroupsIcon} path="/feed/group31" />
    </ul>
  );
}
