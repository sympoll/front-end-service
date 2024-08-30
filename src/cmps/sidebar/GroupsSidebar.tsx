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
  const cmpName = "GROUP_SIDEBAR ";

  const [groups, setGroups] = useState<GroupData[]>([]);
  const [fetchedGroups, setFetchedGroups] = useState<GroupData[]>([]); // Store all groups fetched

  // Fetch initial data
  useEffect(() => {
    fetchUserGroups(userId)
      .then((data) => {
        logDataReceived(data);
        setGroups(data);
        setFetchedGroups(data);
      })
      .catch((error) => {
        console.error(cmpName + error);
      });
    setIsLoading(false);
  }, []);

  const updateGroups = () => {
    fetchUserGroups(userId)
      .then((data) => {
        logDataReceived(data);
        setFetchedGroups(data); // Update all groups with new data
      })
      .catch((error) => {
        console.error(cmpName + error);
        setIsLoading(false);
      });
  };

  // Memoize the updated groups array to avoid unnecessary re-renders.
  // This combines the fetched groups with existing ones:
  // - Updates existing groups by merging new details.
  // - Adds any new groups not already in the state.
  const memoizedGroups = useMemo(() => {
    return fetchedGroups.map((fetchedGroup) => {
      const existingGroup = groups.find((group) => group.groupId === fetchedGroup.groupId);
      if (existingGroup) {
        // Update the existing group with new details
        return { ...existingGroup, ...fetchedGroup };
      } else {
        // Add new group
        return fetchedGroup;
      }
    });
  }, [fetchedGroups, groups]);

  // Update the groups state only with new or changed groups
  useEffect(() => {
    if (memoizedGroups.length > 0) {
      setGroups((prevGroups) => [...prevGroups, ...memoizedGroups]);
    }
  }, [memoizedGroups]);

  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const logDataReceived = (data: GroupData[]) => {
    console.log(cmpName + "got data " + data);
  };

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
