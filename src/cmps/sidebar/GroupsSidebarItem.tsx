import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material/SvgIcon";
import { matchPath, useLocation, useNavigate } from "react-router-dom";

interface GroupsSidebarItemProps {
  title: string;
  Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  path: string;
}

export default function SidebarItem({ title, Icon, path }: GroupsSidebarItemProps) {
  // Find the current path, compare it to the given path.
  // If currently in the given path, set the sidebar item's ID as active.
  const navigate = useNavigate();
  const location = useLocation();
  const getID = matchPath(path, location.pathname) ? "groups-sidebar-item-active" : "";

  return (
    <li className="groups-sidebar-item-container" id={getID} onClick={() => navigate(path)}>
      <div className="groups-sidebar-activated-item-highlight" id={"highlight-" + getID}></div>
      <div id="groups-sidebar-item-icon">{<Icon />}</div>
      <div id="groups-sidebar-item-title">{title}</div>
    </li>
  );
}
