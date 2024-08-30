import React, { useEffect, useMemo, useState } from "react";
import GroupsSidebarItem from "./GroupsSidebarItem";
import GroupsIcon from "@mui/icons-material/Groups";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import UserInfoSidebarItem from "./SidebarUserInfo";
import CreateGroupButton from "../global/CreateGroupButton";
import CreateGroupPopup from "../popup/CreateGroupPopup";
import { GroupData } from "../../models/GroupData.model";
import { fetchUserGroups } from "../../services/group.service";
import LoadingAnimation from "../global/LoadingAnimation";

export default function GroupsSidebar() {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // TODO: change username to the current user
  // Temporary hard coded user ID
  const userId = "b1f8e925-2129-473d-bc09-b3a2a331f839";
  const cmpName = "GROUP_SIDEBAR: ";

  const [groups, setGroups] = useState<GroupData[]>([]);
  const [allGroups, setAllGroups] = useState<GroupData[]>([]); // Store all groups fetched

  // Fetch initial data
  useEffect(() => {
    console.log(cmpName + "fetching user " + userId + " initial data");
    fetchUserGroups(userId)
      .then((data) => {
        setGroups(data);
        setAllGroups(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(cmpName + "error fetching user's groups data.");
        setIsLoading(false);
      });
  }, []);

  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const updateGroups = () => {
    fetchUserGroups(userId)
      .then((data) => {
        setAllGroups(data); // Update all groups with new data
      })
      .catch((error) => {
        console.error(cmpName + "error fetching user's groups data.");
        setIsLoading(false);
      });
  };

  const memoizedGroups = useMemo(() => {
    // Return only groups that are newly added or have changed
    return allGroups.filter(
      (newGroup) => !groups.some((existingGroup) => existingGroup.groupId === newGroup.groupId)
    );
  }, [allGroups, groups]);

  // Update the groups state only with new or changed groups
  useEffect(() => {
    if (memoizedGroups.length > 0) {
      setGroups((prevGroups) => [...prevGroups, ...memoizedGroups]);
    }
  }, [memoizedGroups]);

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
              key={group.groupId}
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
