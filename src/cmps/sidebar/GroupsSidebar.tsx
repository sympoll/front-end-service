import React, { useEffect, useState } from "react";
import GroupsSidebarItem from "./GroupsSidebarItem";
import GroupsIcon from "@mui/icons-material/Groups";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import UserInfoSidebarItem from "./SidebarUserInfo";
import CreateGroupButton from "../global/CreateGroupButton";
import CreateGroupPopup from "../popup/CreateGroupPopup";
import LoadingAnimation from "../global/LoadingAnimation";
import { useGroups } from "../group/GroupContext";

export default function GroupsSidebar() {
  // TODO: change username to the current user
  // Temporary hard coded user ID
  const userId = "b1f8e925-2129-473d-bc09-b3a2a331f839";

  const { groups, isLoading } = useGroups();
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <div className="groups-sidebar-container">
      <UserInfoSidebarItem username="Moishe" email="moishe@gmail.com" />
      <ul className="groups-sidebar-groups-list">
        <GroupsSidebarItem title="All Groups" Icon={FormatListBulletedIcon} path="/feed" />
        {isLoading && (
          <LoadingAnimation message="Loading groups" messageFontSize="16px" ripple="off" />
        )}
        {!isLoading &&
          groups?.map((group) => (
            <GroupsSidebarItem
              title={group.groupName}
              Icon={GroupsIcon}
              path={"/feed/" + group.groupId}
            />
          ))}
      </ul>
      <CreateGroupButton onClick={openPopup} />
      {isPopupOpen && <CreateGroupPopup userId={userId} onClose={closePopup} groups={groups} />}
    </div>
  );
}
