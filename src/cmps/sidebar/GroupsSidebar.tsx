import React, { useEffect, useState } from "react";
import GroupsSidebarItem from "./GroupsSidebarItem";
import GroupsIcon from "@mui/icons-material/Groups";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import UserInfoSidebarItem from "./SidebarUserInfo";

export default function GroupsSidebar() {
  // TODO: change username to the current user
  return (
    <div className="groups-sidebar-container">
      <UserInfoSidebarItem username="Moishe" email="moishe@gmail.com" />
      <ul className="groups-sidebar-groups-list">
        <GroupsSidebarItem title="All Groups" Icon={FormatListBulletedIcon} path="/feed" />
        <GroupsSidebarItem title="Group 1" Icon={GroupsIcon} path="/feed/group1" />
        <GroupsSidebarItem title="Group 69" Icon={GroupsIcon} path="/feed/group69" />
        <GroupsSidebarItem title="Group 31" Icon={GroupsIcon} path="/feed/group31" />
      </ul>
    </div>
  );
}
