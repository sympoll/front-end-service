import React, { useState, useEffect } from "react";
import logger from "../../logger/logger";

interface HealthCheckResponse {
  status: string;
}

function HealthCheckButton() {
  const [healthStatus, setHealthStatus] = useState<string | null>(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchHealthStatus = async () => {
    try {
      logger.info("Try to fetch from URL: " + backendUrl + "/api/poll/health");
      const response = await fetch(backendUrl + "/api/poll/health");
      logger.info("Awaiting fetch from: " + backendUrl + "/api/poll/health");
      const data: HealthCheckResponse = await response.json();
      logger.info("Completed fetch from: " + backendUrl + "/api/poll/health");
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
