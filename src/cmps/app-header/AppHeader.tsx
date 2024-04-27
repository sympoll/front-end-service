import React from "react";
import { useNavigate } from "react-router-dom";

export default function AppHeader() {
  const navigate = useNavigate();

  // Can change later the navigation to navigate to the feed page.
  // For now more convenient to navigate to the landing page.
  return (
    <div className="app-header-container" onClick={() => navigate("/")}>
      <div id="app-header-title">Sympoll™</div>
    </div>
  );
}
