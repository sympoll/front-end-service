import React, { useEffect, useState } from "react";
import GroupsSidebarItem from "./GroupsSidebarItem";
import GroupsIcon from "@mui/icons-material/Groups";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import CreateGroupButton from "../global/CreateGroupButton";
import CreateGroupPopup from "../popup/CreateGroupPopup";
import { GroupData } from "../../models/GroupData.model";
import { fetchUserGroups } from "../../services/group.service";

export default async function GroupsSidebar() {
  /*
    At the moment the sidebar items don't route.
    after we add multiple groups, change to the path of the chosen group,
    by setting the path to "/group-name"
  */
 // const groups = {title: 'All Groups',}
 // const [groups, setGroups] = useState(null);

  // Temporary hard coded user ID
  const userId = 'b1f8e925-2129-473d-bc09-b3a2a331f839'

  const [groups, setGroups] = useState<GroupData[]>(await fetchUserGroups(userId));

  useEffect(() => {
    fetchUserGroups(userId)
    .then((data) => {
      console.log("Fetching user groups data: ", data);
      setGroups(data);
    })
  }, [groups]);

  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <div className="groups-sidebar-container">
      <ul className="groups-list">
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
        {groups?.map((group) => (
          <GroupsSidebarItem
            title={group.groupName}
            Icon={GroupsIcon}
            path={"/feed/" + group.groupId}
            />
        ))}
      </ul>
      <CreateGroupButton onClick = {openPopup} />
      {isPopupOpen && <CreateGroupPopup userId = {userId} onClose = {closePopup} groups={groups} />}
    </div>
  );
}
