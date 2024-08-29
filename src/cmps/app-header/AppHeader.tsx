import React from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../global/CustomButton";

export default function AppHeader() {
  const navigate = useNavigate();

  // Can change later the navigation to navigate to the feed page.
  // For now more convenient to navigate to the landing page.
  return (
    <div className="app-header-container">
      <div id="app-header-title" onClick={() => navigate("/")}>
        Sympoll™
      </div>
      <CustomButton name="update-btn" theme="dark">
        Update
      </CustomButton>
    </div>
  );
}
