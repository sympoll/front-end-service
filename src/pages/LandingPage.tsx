import React, { useEffect, useState } from "react";
import logo from "../assets/imgs/logo-no-bg.png";
import Button from "../cmps/global/Button";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function LandingPage() {
  // TEST:
  const [test, setTest] = useState("Fetching data...");

  useEffect(() => {
    // AXIOS insead of fetch
    fetch(`${backendUrl}/api/poll/health`, {
      method: "GET",
      // other options
    }).then((response) => {
      setTest("Raw response: " + response);
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
    });
  }, []);
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
