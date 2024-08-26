import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material/SvgIcon";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface MembersSidebarItemProps {
  name: string;
  Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  path: string;
  role: string;
}

export default function MembersSidebarItem({
  name,
  Icon,
  path,
  role,
}: MembersSidebarItemProps) {
  // Find the current path, compare it to the given path.
  // If currently in the given path, set the sidebar item's ID as active.
  const navigate = useNavigate();
  const [isRegularMember, setIsRegularMember] = useState(true)

  useEffect(() => {
    if(role !== 'member') {
      setIsRegularMember(false);
    } else {
      setIsRegularMember(true);
    }
  }, [role])

  return (
    <li
      className="members-sidebar-item-container"
      onClick={() => navigate(path)}
    >
      <div id="members-sidebar-item-icon">{<Icon />}</div>
      <div id="members-sidebar-item-name">{name}</div>
      {!isRegularMember && <div className="members-sidebar-item-role">{role}</div>}
    </li>
  );
}
