import React, { useState, useEffect } from "react";
import axios from "axios";

interface HealthCheckResponse {
  status: string;
}

function HealthCheckButton() {
  const [healthStatus, setHealthStatus] = useState<string | null>(null);
  const pollServiceUrl =
    import.meta.env.VITE_BASE_URL +
    import.meta.env.VITE_API_GATEWAY_URL +
    import.meta.env.VITE_POLL_SERVICE_URL;

  // USE THIS INSTEAD OF FETCH:
  const [healthData, setHealthData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const tempp = 2;
  
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

  const fetchHealthStatus = async () => {
    try {
      console.log("Try to fetch from URL: " + pollServiceUrl + "/health");
      const response = await fetch(pollServiceUrl + "/health");
      console.log("Awaiting fetch from: " + pollServiceUrl + "/health");
      const data: HealthCheckResponse = await response.json();
      console.log("Completed fetch from: " + pollServiceUrl + "/health");
      setHealthStatus(data.status);
    } catch (error) {
      console.error("Error fetching health status:", error);
      setHealthStatus("Error fetching health status");
    }
  };

  return (
    <div>
      <button onClick={fetchHealthStatus}>Check Health</button>
      <header>Health Status: {healthStatus || "Not checked yet"}</header>
    </div>
  );
}
export default HealthCheckButton;
