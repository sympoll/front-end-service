import { useEffect, useState, useCallback } from "react";
import MembersSidebarItem from "./MembersSidebarItem";
import { useLocation, useParams } from "react-router-dom";
import { fetchGroupMembers } from "../../services/group.service";
import LoadingAnimation from "../global/LoadingAnimation";
import { useUpdateContext } from "../../context/UpdateContext";
import { useMembers } from "../../context/MemebersContext";
import defaultProfilePictureUrl from "/imgs/profile/blank-profile-picture.jpg";

export default function MembersSidebar() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { groupId } = useParams();
  const { members, setMembers, sortMembers } = useMembers();
  const [isShowingFriendsList, setIsShowingFriendsList] = useState(true);
  const { registerForUpdate } = useUpdateContext(); // Access context
  const { userId } = useParams();
  const location = useLocation();

  const cmpName = "MEMBERS_SIDEBAR ";

  // Initial fetch on component render
  useEffect(() => {
    updateMembers();
  }, [groupId, userId, location.pathname]);

  const updateMembers = useCallback(async () => {
    const isInFeedPage = location.pathname.startsWith("/feed");
    const isInGroupPage = location.pathname.startsWith("/group");

    if (isInFeedPage && groupId && !userId) {
      // On specific group feed page
      setIsLoading(true);
      setIsShowingFriendsList(false);
      try {
        const fetchedMembers = await fetchGroupMembers(groupId);
        console.log("Fetched members: " + fetchedMembers[0].userData);
        setMembers(sortMembers(fetchedMembers));
        setIsLoading(false);
      } catch (error) {
        console.error(cmpName + error);
        setIsLoading(false);
      }
    } else if (!isInFeedPage && !groupId && userId) {
      // On user profile page
      setIsShowingFriendsList(true);
      setMembers(undefined);
    } else if (isInGroupPage) {
      // On group profile page
      setIsShowingFriendsList(true);
      setMembers(undefined);
    } else if (isInFeedPage) {
      // On all groups feed page
      setIsShowingFriendsList(true);
      setMembers(undefined);
    }
  }, [groupId, userId, location.pathname]);

  useEffect(() => {
    // Register the updateMembers function and handle unregistration
    const unregister = registerForUpdate(updateMembers);
    return () => {
      unregister();
    };
  }, [registerForUpdate, updateMembers]);

  useEffect(() => {
    if (members) {
      setMembers(sortMembers(members));
    }
  }, [members]);

  return (
    <div className="members-sidebar-container">
      <div className={`members-sidebar-title ${!isShowingFriendsList ? "with-border" : ""}`}>
        {!isShowingFriendsList && "Group Members:"}
      </div>
      <ul className="members-sidebar-members-container">
        {isLoading && !isShowingFriendsList && (
          <LoadingAnimation message="Loading members" messageFontSize="16px" ripple="off" />
        )}
        {!isLoading &&
          members?.map((member) => (
            <MembersSidebarItem
              key={member.userData.userId}
              name={member.userData.username}
              profilePictureUrl={member.userData.profilePictureUrl ?? defaultProfilePictureUrl}
              path={"/" + member.userData.userId}
              role={member.roleName}
            />
          ))}
      </ul>
    </div>
  );
}
