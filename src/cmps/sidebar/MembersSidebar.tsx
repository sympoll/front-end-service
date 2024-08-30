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
  const [fetchedMembers, setFetchedMembers] = useState<GroupMember[]>([]);
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
          setFetchedMembers(sortedMembers);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(cmpName + error);
          setIsLoading(false);
        });
    } else {
      setIsAllGroups(true);
      setMembers([]);
      setFetchedMembers([]);
      setIsLoading(false);
    }
  }, [groupId]);

  const updateMembers = () => {
    if (groupId) {
      fetchGroupMembers(groupId)
        .then((data) => {
          setFetchedMembers(data);
        })
        .catch((error) => {
          console.error(cmpName + error);
          setIsLoading(false);
        });
    }
  };

  // Memoize the updated members array to avoid unnecessary re-renders.
  // This combines the fetched members with existing ones:
  // - Updates existing members by merging new details.
  // - Adds any new members not already in the state.
  const memoizedMembers = useMemo(() => {
    return fetchedMembers.map((fetchedMember) => {
      const existingMember = members.find((member) => (member.userId = fetchedMember.userId));
      if (existingMember) {
        // Update the existing member with new details
        return { ...existingMember, ...fetchedMember };
      } else {
        // Add a new member
        return fetchedMember;
      }
    });
  }, [fetchedMembers, members]);

  // Update the groups state only with new or changed groups
  useEffect(() => {
    if (memoizedMembers.length > 0) {
      setMembers((prevMembers) => [...prevMembers, ...memoizedMembers]);
    }
  }, [memoizedMembers]);

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
