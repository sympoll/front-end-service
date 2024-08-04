import React, { useEffect, useState } from "react";
import GroupsSidebarItem from "./GroupsSidebarItem";
import GroupsIcon from "@mui/icons-material/Groups";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

export default function GroupsSidebar() {
  /*
    At the moment the sidebar items don't route.
    after we add multiple groups, change to the path of the chosen group,
    by setting the path to "/group-name"
  */
 // const groups = {title: 'All Groups',}
 // const [groups, setGroups] = useState(null);

  useEffect(() => {

  }, []);

  return (
    <ul className="groups-sidebar-container">
      <GroupsSidebarItem
        title="All Groups"
        Icon={FormatListBulletedIcon}
        path="/feed"
      />
      <GroupsSidebarItem
        title="Group 1"
        Icon={GroupsIcon}
        path="/feed/group1"
      />
      <GroupsSidebarItem
        title="Group 69"
        Icon={GroupsIcon}
        path="/feed/group69"
      />
      <GroupsSidebarItem
        title="Group 31"
        Icon={GroupsIcon}
        path="/feed/group31"
      />
    </ul>
  );
}
