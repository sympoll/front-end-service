import React from "react";
import logo from "../assets/imgs/logo-no-bg.png";
import Button from "../cmps/global/Button";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <section className="landing-page-container">
      <img className="landing-page-logo-img" src={logo} alt="sympoll-logo" />
      <p className="landing-page-content">
        Welcome to Sympoll™, where decisions are made...
      </p>
      <div className="landing-page-buttons">
        <Button onClick={() => navigate("/login")}>Log In / Sign Up</Button>
        <Button onClick={() => navigate("/feed")}>
          Temporary - Move to feed
        </Button>
      </div>
    </section>
  );
}
