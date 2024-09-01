import React, { useEffect, useMemo, useState, useCallback } from "react";
import MembersSidebarItem from "./MembersSidebarItem";
import PersonIcon from "@mui/icons-material/Person";
import { useParams } from "react-router-dom";
import { GroupMember } from "../../models/GroupMember.model";
import { fetchGroupMembers } from "../../services/group.service";
import LoadingAnimation from "../global/LoadingAnimation";
import { useUpdateContext } from "../../context/UpdateContext";
import { useMembers } from "../../context/MemebersContext";

export default function MembersSidebar() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { groupId } = useParams();
  const { members, setMembers, isChanged } = useMembers();
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
      setIsShowingAllGroups(false);
      try {
        const fetchedMembers = await fetchGroupMembers(groupId);
        setMembers(sortMembers(fetchedMembers));
      } catch (error) {
        console.error(cmpName + error);
      } finally {
        if (isLoading) setIsLoading(false); // End initial loading state after fetching or error
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

  useEffect(() => {
    if (members) {
      setMembers(sortMembers(members));
    }
  }, [isChanged]);

  const sortMembers = (members: GroupMember[]) => {
    return members.sort((a, b) => {
      const roleOrder: { [key: string]: number } = {
        Admin: 1,
        Moderator: 2,
        Member: 4
      };
      // Give a higher order number to roles that are not 'Member'
      const aRoleOrder = roleOrder[a.roleName] || 3;
      const bRoleOrder = roleOrder[b.roleName] || 3;

      return aRoleOrder - bRoleOrder;
    });
  };

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
          members?.map((member) => (
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
