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
  const [isLoading, setIsLoading] = useState<boolean>(true); // Tracks loading state
  const [groups, setGroups] = useState<GroupData[]>([]); // Stores groups data
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false); // Controls popup visibility

  // TODO: Change username to the current user dynamically
  const userId = "b1f8e925-2129-473d-bc09-b3a2a331f839"; // Hardcoded user ID for demo purposes
  const cmpName = "GROUP_SIDEBAR "; // Component name for logging purposes

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
  }, [userId]); // Dependency array includes userId

  // Function to update groups with the latest data
  const updateGroups = async () => {
    try {
      const fetchedGroups = await fetchUserGroups(userId);
      logDataReceived(fetchedGroups);

      // Merge new groups with existing ones, ensuring uniqueness by groupId
      setGroups((prevGroups) => {
        const groupsMap = new Map(
          [...prevGroups, ...fetchedGroups].map((group) => [group.groupId, group])
        );
        return Array.from(groupsMap.values());
      });
    } catch (error) {
      console.error(cmpName + error);
    }
  };

  // Memoize the groups array to prevent unnecessary re-renders
  const memoizedGroups = useMemo(() => groups, [groups]);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const logDataReceived = (data: GroupData[]) => {
    console.log(cmpName + "got data");
  };

  return (
    <div className="groups-sidebar-container">
      {/* User info item displaying username and email */}
      <UserInfoSidebarItem username="Moishe" email="moishe@gmail.com" />
      <ul className="groups-sidebar-groups-list">
        {/* Static sidebar item for "All Groups" */}
        <GroupsSidebarItem title="All Groups" Icon={FormatListBulletedIcon} path="/feed" />
        {/* Conditionally render loading animation or groups list */}
        {isLoading ? (
          <LoadingAnimation message="Loading groups" messageFontSize="16px" ripple="off" />
        ) : (
          memoizedGroups.map((group) => (
            <GroupsSidebarItem
              key={group.groupId} // Unique key for each group item
              title={group.groupName}
              Icon={GroupsIcon}
              path={"/feed/" + group.groupId} // Dynamic path for each group
            />
          ))
        )}
      </ul>
      {/* Button to trigger the group creation popup */}
      <CreateGroupButton onClick={openPopup} />
      {/* Conditionally render the group creation popup */}
      {isPopupOpen && <CreateGroupPopup userId={userId} onClose={closePopup} groups={groups} />}
    </div>
  );
}
