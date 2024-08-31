import React, { useEffect, useMemo, useState, useCallback } from "react";
import MembersSidebarItem from "./MembersSidebarItem";
import PersonIcon from "@mui/icons-material/Person";
import { useParams } from "react-router-dom";
import { GroupMember } from "../../models/GroupMember.model";
import { fetchGroupMembers } from "../../services/group.service";
import LoadingAnimation from "../global/LoadingAnimation";
import { useUpdateContext } from "../../context/UpdateContext";

export default function MembersSidebar() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { groupId } = useParams();
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [isShowingAllGroups, setIsShowingAllGroups] = useState(true);
  const { registerForUpdate } = useUpdateContext(); // Access context
  const { userId } = useParams();

  const cmpName = "MEMBERS_SIDEBAR ";

  // Initial fetch on component render
  useEffect(() => {
    setIsLoading(true);
    updateMembers();
    setIsLoading(false);
  }, [groupId]);

  const updateMembers = useCallback(async () => {
    if (groupId && !userId) {
      setIsShowingAllGroups(false);
      try {
        const fetchedMembers = await fetchGroupMembers(groupId);
        setMembers(fetchedMembers);
      } catch (error) {
        console.error(cmpName + error);
      }
    } else {
      if (!userId) {
        setIsShowingAllGroups(true);
        setMembers([]);
      }
    }
  }, [groupId, userId]);

  useEffect(() => {
    // Register the updateMembers function and handle unregistration
    const unregister = registerForUpdate(updateMembers);
    return () => {
      unregister();
    };
  }, [registerForUpdate, updateMembers]);

  return (
    <div className="members-sidebar-container">
      <div className={`members-sidebar-title ${!isShowingAllGroups ? "with-border" : ""}`}>
        {!isShowingAllGroups && "Group Members:"}
      </div>
      <ul className="members-sidebar-members-container">
        {isLoading && (
          <LoadingAnimation message="Loading members" messageFontSize="16px" ripple="off" />
        )}
        {!isLoading &&
          members.map((member) => (
            <MembersSidebarItem
              key={member.userId}
              name={member.username}
              Icon={PersonIcon}
              path={"/" + member.userId}
              role={member.roleName}
            />
          ))}
      </ul>
    </div>
  );
}
