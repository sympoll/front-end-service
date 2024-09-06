import React, { useEffect, useState } from "react";
import logo from "/imgs/logo-no-bg.png";
import Button from "../cmps/global/CustomButton";
import { useNavigate } from "react-router-dom";
import CreatePollForm from "../cmps/feed/poll/CreatePollForm";
import CustomButton from "../cmps/global/CustomButton";
import { useAuth } from "../context/AuthProvider";

export default function LandingPage() {
  const { keycloak } = useAuth();

  const handleLogIn = () => {
    if (keycloak) {
      keycloak.login();
    }
  };

  const handleSignUp = () => {
    if (keycloak) {
      keycloak.register(); // Redirects to Keycloak registration page
    }
  };

  const navigate = useNavigate();

  return (
    <section className="landing-page-container">
      <img className="landing-page-logo-img" src={logo} alt="sympoll-logo" />
      <p className="landing-page-content">Welcome to Sympoll™, where decisions are made...</p>
      <div className="landing-page-buttons">
        <CustomButton onClick={handleLogIn}>Log In / Sign Up</CustomButton>
        <CustomButton onClick={() => navigate("/feed")}>Temporary - Move to feed</CustomButton>
      </div>
    </section>
  );
}
