import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useUpdateContext } from "../../context/UpdateContext";
import refreshImage from "/imgs/button/refresh.png";

export default function AppHeader() {
  const navigate = useNavigate();
  const { triggerUpdate } = useUpdateContext();

  // Can change later the navigation to navigate to the feed page.
  // For now more convenient to navigate to the landing page.
  return (
    <div className="app-header-container">
      <div id="app-header-title" onClick={() => navigate("/feed")}>
        Sympoll™
      </div>
      <button className="app-header__update-btn">
        <svg
          onClick={triggerUpdate}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="app-header__update-btn__img"
        >
          <path d="M12 2v2c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8h2c0 3.309 2.691 6 6 6s6-2.691 6-6-2.691-6-6-6v4l-5-5 5-5z" />
        </svg>
      </button>
    </div>
  );
}
