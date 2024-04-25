import React from "react";
import logo from "../assets/imgs/logo-no-bg.png";

export default function LandingPage() {
  return (
    <section className="landing-page-container">
      <img className="logo-img" src={logo} alt="pic" />
      <div>Welcome to Sympoll, where decisions are made :)</div>
      <div>
        <button className="button">Log In</button>
        <button className="button">Sign Up</button>
      </div>
    </section>
  );
}
