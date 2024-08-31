import React, { useCallback, useEffect, useMemo, useState } from "react";
import GroupsSidebarItem from "./GroupsSidebarItem";
import GroupsIcon from "@mui/icons-material/Groups";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import UserInfoSidebarItem from "./SidebarUserInfo";
import CreateGroupButton from "../global/CreateGroupButton";
import CreateGroupPopup from "../popup/CreateGroupPopup";
import { GroupData } from "../../models/GroupData.model";
import { fetchUserGroups } from "../../services/group.service";
import LoadingAnimation from "../global/LoadingAnimation";
import { useUpdateContext } from "../../context/UpdateContext";

export default function GroupsSidebar() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const { registerForUpdate } = useUpdateContext(); // Access context

  // TODO: Change username to the current user dynamically
  const userId = "b1f8e925-2129-473d-bc09-b3a2a331f839";
  const cmpName = "GROUP_SIDEBAR ";

  // Effect to fetch groups data on component mount or userId change
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await fetchUserGroups(userId);
        logDataReceived(data);
        setGroups(data);
      } catch (error) {
        console.error(cmpName + error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [userId]);

  // Function to update groups with the latest data
  const updateGroups = useCallback(async () => {
    try {
      let fetchedGroups = [];
      fetchedGroups = await fetchUserGroups(userId);

      setGroups((prevGroups) => {
        return [
          ...fetchedGroups,
          ...prevGroups.filter(
            (group) => !fetchedGroups.some((fg: GroupData) => fg.groupId === group.groupId)
          )
        ];
      });
    } catch (error) {
      console.error(cmpName + error);
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    // Register the updateGroups function and handle unregistration
    const unregister = registerForUpdate(updateGroups);
    return () => {
      unregister();
    };
  }, [registerForUpdate, updateGroups]);

  // Memoize the groups array to prevent unnecessary re-renders
  const memoizedGroups = useMemo(() => groups, [groups]);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const logDataReceived = (data: GroupData[]) => {
    console.log(cmpName + "got data");
  };

  return (
    <div className="groups-sidebar-container">
      <UserInfoSidebarItem username="Moishe" email="moishe@gmail.com" />
      <ul className="groups-sidebar-groups-list">
        <GroupsSidebarItem title="All Groups" Icon={FormatListBulletedIcon} path="/feed" />
        {isLoading ? (
          <LoadingAnimation message="Loading groups" messageFontSize="16px" ripple="off" />
        ) : (
          memoizedGroups.map((group) => (
            <GroupsSidebarItem
              key={group.groupId}
              title={group.groupName}
              Icon={GroupsIcon}
              path={"/feed/" + group.groupId}
            />
          ))
        )}
      </ul>
      <CreateGroupButton onClick={openPopup} />
      {isPopupOpen && <CreateGroupPopup userId={userId} onClose={closePopup} groups={groups} />}
    </div>
  );
}
