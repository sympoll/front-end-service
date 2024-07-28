import React, { useEffect, useState } from "react";
import logo from "../assets/imgs/logo-no-bg.png";
import Button from "../cmps/global/Button";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function LandingPage() {
  // TEST:
  const [test, setTest] = useState("Fetching data...");

  useEffect(() => {
    fetch(`${backendUrl}/api/poll/health`, {
      method: "GET",
      // other options
    })
      .then((response) => {
        setTest("Raw response: " + response);
        // if (!response.ok) {
        //   throw new Error("Network response was not ok " + response.statusText);
        // }
        // if (
        //   response.headers.get("content-type")?.includes("application/json")
        // ) {
        //   return response.json();
        // } else {
        //   throw new Error("Expected JSON response");
        // }
      })
      .then((data) => {
        setTest("1. " + JSON.stringify(data));
        console.log("Parsed data:", data); // Log the parsed data for debugging
      })
      .catch((error) => {
        setTest("2. Error: " + error.message);
        console.error("Fetch error:", error); // Log the error for debugging
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
