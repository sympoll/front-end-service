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
  const [isInGroup, setIsInGroup] = useState(false);
  const { registerForUpdate } = useUpdateContext(); // Access context

  const cmpName = "MEMBERS_SIDEBAR ";

  // Fetch initial data
  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);

      if (groupId) {
        setIsInGroup(true);
        try {
          const data = await fetchGroupMembers(groupId);
          logDataReceived(data);
          setMembers(data);
        } catch (error) {
          console.error(cmpName + error);
        }
      } else {
        setIsInGroup(false);
        setMembers([]);
      }

      setIsLoading(false);
    };

    fetchMembers();
  }, [groupId]);

  const updateMembers = useCallback(async () => {
    if (groupId) {
      try {
        let fetchedMembers = [];
        fetchedMembers = await fetchGroupMembers(groupId);

        setMembers((prevMembers) => {
          // Ensure a new reference to trigger React re-render
          return [
            ...fetchedMembers,
            ...prevMembers.filter(
              (member) => !fetchedMembers.some((fm: GroupMember) => fm.userId === member.userId)
            )
          ];
        });
      } catch (error) {
        console.error(cmpName + error);
        setIsLoading(false);
      }
    }
  }, [groupId]);

  useEffect(() => {
    // Register the updateMembers function and handle unregistration
    const unregister = registerForUpdate(updateMembers);
    return () => {
      unregister();
    };
  }, [registerForUpdate, updateMembers]);

  // Memoize the members array to prevent unnecessary re-renders
  const memoizedMembers = useMemo(() => members, [members]);

  const logDataReceived = (data: GroupMember[]) => {
    console.log(cmpName + "got data");
  };

  return (
    <div className="members-sidebar-container">
      <div className={`members-sidebar-title ${!isInGroup ? "with-border" : ""}`}>
        {!isInGroup && "Group Members:"}
      </div>
      <ul className="members-sidebar-members-container">
        {isLoading && (
          <LoadingAnimation message="Loading members" messageFontSize="16px" ripple="off" />
        )}
        {!isLoading &&
          memoizedMembers.map((member) => (
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
