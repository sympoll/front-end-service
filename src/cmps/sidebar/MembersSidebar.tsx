import React, { useEffect, useState } from "react";
import MembersSidebarItem from "./MembersSidebarItem";
import PersonIcon from "@mui/icons-material/Person";
import { useParams } from "react-router-dom";
import { GroupMember } from "../../models/GroupMember.model";
import { fetchGroupMembers } from "../../services/group.service";

export default function MembersSidebar() {
  /*
    At the moment the sidebar items don't route.
    after we add multiple groups, change to the path of the chosen group,
    by setting the path to "/group-name"
  */
  const {groupId} = useParams();
  const [members, setMembers] = useState<GroupMember[]>();

  useEffect(() => {
    if(groupId){
      fetchGroupMembers(groupId).then((data) => {
        console.log("Fetching group users data: ", data);
        setMembers(data);
      })
    }
  }, [groupId]);

  return (
    <div className="members-sidebar-container">
      <div className="members-sidebar-title">Group Members:</div>
      <ul className="members-sidebar-members-container">
        {members?.map((member) =>
          <MembersSidebarItem name={member.username} Icon={PersonIcon} path={"/"+member.username} />
        )}
      </ul>
    </div>
  );
}
