import React from "react";
import logo from "../assets/imgs/logo-no-bg.png";
import Button from "../cmps/global/Button";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <section className="landing-page-container">
      <img className="logo-img" src={logo} alt="pic" />
      <div>Welcome to Sympoll™, where decisions are made...</div>
      <div>
        <Button onClick={() => navigate("/login")}>Log In</Button>
        <Button onClick={() => navigate("/signup")}>Sign Up</Button>
        <Button onClick={() => navigate("/feed")}>
          Temporary - Move to feed
        </Button>
      </div>
    </section>
  );
}
