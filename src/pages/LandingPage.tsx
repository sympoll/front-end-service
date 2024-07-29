import React, { useEffect, useState } from "react";
import logo from "../assets/imgs/logo-no-bg.png";
import Button from "../cmps/global/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
console.log("Backend URL:", backendUrl); // Log the backend URL to ensure it's correctly loaded

export default function LandingPage() {
  // TEST:
  const [healthData, setHealthData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchHealth(backendUrl: string) {
    try {
      console.log("Creating axios instance with baseURL:", backendUrl);
      const axiosInstance = axios.create({
        baseURL: backendUrl, // Use the backend URL from environment variables
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
  
      console.log("Making GET request to /health");
      const response = await axiosInstance.get("/health");
  
      console.log("Response received:", response);
      return response.data;
    } catch (error: unknown) { // Explicitly typing 'error' as 'unknown'
      if (axios.isAxiosError(error)) { // Type guard for Axios errors
        // Log detailed error information for Axios errors
        console.error("Error response data:", error.response?.data);
        console.error("Error response status:", error.response?.status);
        console.error("Error response headers:", error.response?.headers);
        console.error("Error request data:", error.request);
      } else {
        // Handle other types of errors
        console.error("Unexpected error:", error);
      }
  
      throw error; // Re-throw the error after logging
    }
  }

  useEffect(() => {
    fetchHealth(backendUrl)
      .then((data) => {
        setHealthData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [backendUrl]);
  // END TEST

  const navigate = useNavigate();
  const test = fetchHealth(backendUrl);

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
        THIS IS A TEST:{" "}
        {loading ? "Loading..." : error ? `Error: ${error}` : healthData}
      </h1>
    </section>
  );
}
