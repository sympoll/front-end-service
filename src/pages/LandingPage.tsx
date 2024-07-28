import React from "react";
import logo from "../assets/imgs/logo-no-bg.png";
import Button from "../cmps/global/Button";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function LandingPage() {
  // TEST:
  let test;
  fetch(`${backendUrl}/api/poll/health`, {
    method: "GET",
    // other options
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      test = "1. " + JSON.stringify(data);
      console.log(test); // Log the result for debugging
    })
    .catch((error) => {
      test = "2. Error: " + error.message;
      console.error(test); // Log the error for debugging
    });

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
