import React, { useEffect, useState } from "react";
import logo from "../assets/imgs/logo-no-bg.png";
import Button from "../cmps/global/Button";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
console.log("Backend URL:", backendUrl); // Log the backend URL to ensure it's correctly loaded

export default function LandingPage() {
  // TEST:
  const [test, setTest] = useState("Fetching data...");

  useEffect(() => {
    const fetchHealthCheck = async () => {
      try {
        console.log("Making request to:", `${backendUrl}/api/poll/health`);
        const response = await fetch(`${backendUrl}/api/poll/health`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        console.log("Raw response: ", response); // Log the raw response

        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }

        const contentType = response.headers.get("content-type");
        console.log("Content-Type: ", contentType); // Log the content-type

        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          console.log("Parsed data: ", data); // Log the parsed data
          setTest(data);
        } else {
          throw new Error("Expected JSON response");
        }
      } catch (error) {
        console.error("Fetch error:", error); // Log the error for debugging
        setTest("2. Error: " + error);
      }
    };

    fetchHealthCheck();
  }, [backendUrl]);
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
