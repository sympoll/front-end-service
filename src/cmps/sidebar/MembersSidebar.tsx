import React, { useEffect, useState } from "react";
import MembersSidebarItem from "./MembersSidebarItem";
import PersonIcon from "@mui/icons-material/Person";
import { useParams } from "react-router-dom";
import { GroupMember } from "../../models/GroupMember.model";
import { fetchGroupMembers } from "../../services/group.service";
import LoadingAnimation from "../global/LoadingAnimation";

export default function MembersSidebar() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { groupId } = useParams();
  const [members, setMembers] = useState<GroupMember[]>();
  const [isAllGroups, setIsAllGroups] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    if (groupId) {
      setIsAllGroups(false);
      fetchGroupMembers(groupId).then((data) => {
        console.log("Fetching group users data: ", data);
        setMembers(data);
        setIsLoading(false);
      });
    } else {
      setIsAllGroups(true);
      setMembers([]);
      setIsLoading(false);
    }
  }, [groupId]);

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
              name={member.username}
              Icon={PersonIcon}
              path={"/" + member.username}
            />
          ))}
      </ul>
    </div>
  );
}
