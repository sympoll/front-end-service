import React, { useEffect, useState } from "react";
import logo from "../assets/imgs/logo-no-bg.png";
import Button from "../cmps/global/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HealthCheckButton from "../cmps/global/HelathCheckButton";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
console.log("Backend URL:", backendUrl); // Log the backend URL to ensure it's correctly loaded

export default function LandingPage() {
  // TEST:
  const [healthData, setHealthData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // async function fetchHealth(backendUrl: string) {
  //   try {
  //     const response = await axios
  //       .create({
  //         baseURL: "http://backend.default.svc.cluster.local:8081/api/poll",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         withCredentials: true,
  //       })
  //       .get("/health");
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error fetching health: ", error);
  //     throw error;
  //   }
  // }

  // useEffect(() => {
  //   fetchHealth(backendUrl)
  //     .then((data) => {
  //       setHealthData(data);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       setError(error.message);
  //       setLoading(false);
  //     });
  // }, [backendUrl]);
  // // END TEST

  const navigate = useNavigate();
  // const test = fetchHealth(backendUrl);

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
      <h1>
        THIS IS A TEST
        <HealthCheckButton/>
      </h1>
    </section>
  );
}
