import React, { useEffect, useState } from "react";
import logo from "../assets/imgs/logo-no-bg.png";
import Button from "../cmps/global/CustomButton";
import { useNavigate } from "react-router-dom";
import CreatePollForm from "../cmps/feed/poll/CreatePollForm";
import CustomButton from "../cmps/global/CustomButton";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <section className="landing-page-container">
      <img className="landing-page-logo-img" src={logo} alt="sympoll-logo" />
      <p className="landing-page-content">Welcome to Sympoll™, where decisions are made...</p>
      <div className="landing-page-buttons">
        <CustomButton onClick={() => navigate("/login")}>Log In / Sign Up</CustomButton>
        <CustomButton onClick={() => navigate("/feed")}>Temporary - Move to feed</CustomButton>
      </div>
    </section>
  );
}
