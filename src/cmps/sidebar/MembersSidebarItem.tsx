import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material/SvgIcon";
import { matchPath, useLocation, useNavigate } from "react-router-dom";

interface MembersSidebarItemProps {
  name: string;
  Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  path: string;
}

export default function MembersSidebarItem({
  name,
  Icon,
  path,
}: MembersSidebarItemProps) {
  // Find the current path, compare it to the given path.
  // If currently in the given path, set the sidebar item's ID as active.
  const navigate = useNavigate();

  return (
    <li
      className="members-sidebar-item-container"
      onClick={() => navigate(path)}
    >
      <div id="members-sidebar-item-icon">{<Icon />}</div>
      <div id="members-sidebar-item-name">{name}</div>
    </li>
  );
}
