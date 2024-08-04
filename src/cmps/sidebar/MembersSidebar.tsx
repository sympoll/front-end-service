import React from "react";
import MembersSidebarItem from "./MembersSidebarItem";
import PersonIcon from "@mui/icons-material/Person";

export default function MembersSidebar() {
  /*
    At the moment the sidebar items don't route.
    after we add multiple groups, change to the path of the chosen group,
    by setting the path to "/group-name"
  */
  return (
    <ul className="members-sidebar-container">
      <div className="members-sidebar-title">Group Members:</div>
      <MembersSidebarItem name="Roneni" Icon={PersonIcon} path="/roneni" />
      <MembersSidebarItem name="Roy" Icon={PersonIcon} path="/roy" />
      <MembersSidebarItem name="Idan" Icon={PersonIcon} path="/idan" />
    </ul>
  );
}
