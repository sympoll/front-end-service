import React, { useEffect, useState } from "react";
import logo from "../assets/imgs/logo-no-bg.png";
import Button from "../cmps/global/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
console.log("Backend URL:", backendUrl); // Log the backend URL to ensure it's correctly loaded

export default function LandingPage() {
  // TEST:
  async function fetchHealth(backendUrl: string) {
    try {
      const response = await axios.get(backendUrl);
      return response.data;
    } catch (error) {
      console.error("Error fetching health: ", error);
      throw error;
    }
  }
  // END TEST

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
      <h1>THIS IS A TEST: "{test}"</h1>
    </section>
  );
}
