import { useEffect, useState, useCallback } from "react";
import MembersSidebarItem from "./MembersSidebarItem";
import { useParams } from "react-router-dom";
import { fetchGroupMembers } from "../../services/group.service";
import LoadingAnimation from "../global/LoadingAnimation";
import { useUpdateContext } from "../../context/UpdateContext";
import { useMembers } from "../../context/MemebersContext";
import defaultProfilePictureUrl from "/imgs/profile/blank-profile-picture.jpg";

export default function MembersSidebar() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { groupId } = useParams();
  const { members, setMembers, sortMembers } = useMembers();
  const [isShowingAllGroups, setIsShowingAllGroups] = useState(true);
  const { registerForUpdate } = useUpdateContext(); // Access context
  const { userId } = useParams();

  const cmpName = "MEMBERS_SIDEBAR ";

  // Initial fetch on component render
  useEffect(() => {
    updateMembers();
  }, [groupId, userId]);

  const updateMembers = useCallback(async () => {
    if (groupId && !userId) {
      setIsLoading(true);
      setIsShowingAllGroups(false);
      try {
        const fetchedMembers = await fetchGroupMembers(groupId);
        console.log("Fetched members: " + fetchedMembers[0].userData);
        setMembers(sortMembers(fetchedMembers));
        setIsLoading(false);
      } catch (error) {
        console.error(cmpName + error);
        setIsLoading(false);
      }
    } else {
      setIsShowingAllGroups(true);
      setMembers(undefined);
    }
  }, [groupId, userId]);

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
      <div className={`members-sidebar-title ${!isShowingAllGroups ? "with-border" : ""}`}>
        {!isShowingAllGroups && "Group Members:"}
      </div>
      <ul className="members-sidebar-members-container">
        {isLoading && !isShowingAllGroups && (
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
