import React, { useEffect, useMemo, useState } from "react";
import MembersSidebarItem from "./MembersSidebarItem";
import PersonIcon from "@mui/icons-material/Person";
import { useParams } from "react-router-dom";
import { GroupMember } from "../../models/GroupMember.model";
import { fetchGroupMembers } from "../../services/group.service";
import LoadingAnimation from "../global/LoadingAnimation";

export default function MembersSidebar() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { groupId } = useParams();
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [allMembers, setAllMembers] = useState<GroupMember[]>([]);
  const [isAllGroups, setIsAllGroups] = useState(true);

  const cmpName = "MEMBERS_SIDEBAR ";

  // Fetch initial data
  useEffect(() => {
    setIsLoading(true);

    if (groupId) {
      setIsAllGroups(false);
      fetchGroupMembers(groupId)
        .then((data) => {
          logDataReceived(data);
          const sortedMembers = sortMembers(data);
          setMembers(sortedMembers);
          setAllMembers(sortedMembers);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(cmpName + error);
          setIsLoading(false);
        });
    } else {
      setIsAllGroups(true);
      setMembers([]);
      setAllMembers([]);
      setIsLoading(false);
    }
  }, [groupId]);

  const updateMembers = () => {
    if (groupId) {
      fetchGroupMembers(groupId)
        .then((data) => {
          setAllMembers(data);
        })
        .catch((error) => {
          console.error(cmpName + error);
          setIsLoading(false);
        });
    }
  };

  const memoizedMembers = useMemo(() => {
    // Return only groups that are newly added or have changed
    return allMembers.filter(
      (newMember) => !members.some((existingMember) => existingMember.userId === newMember.userId)
    );
  }, [allMembers, members]);

  const logDataReceived = (data: GroupMember[]) => {
    console.log(cmpName + "got data " + data);
  };

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
      <div className={`members-sidebar-title ${!isAllGroups ? "with-border" : ""}`}>
        {!isAllGroups && "Group Members:"}
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
