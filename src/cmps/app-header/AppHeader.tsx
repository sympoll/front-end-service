import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../global/CustomButton";
import { useUpdateContext } from "../../context/UpdateContext";

export default function AppHeader() {
  const navigate = useNavigate();
  const { triggerUpdate } = useUpdateContext();

  // Can change later the navigation to navigate to the feed page.
  // For now more convenient to navigate to the landing page.
  return (
    <div className="app-header-container">
      <div id="app-header-title" onClick={() => navigate("/")}>
        Sympoll™
      </div>
      <CustomButton name="update-btn" theme="light" onClick={triggerUpdate}>
        Update
      </CustomButton>
    </div>
  );
}
