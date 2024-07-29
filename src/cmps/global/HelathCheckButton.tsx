import React, { useState, useEffect } from 'react';


interface HealthCheckResponse {
    status: string;
  }
  
  function HealthCheckButton() {
    const [healthStatus, setHealthStatus] = useState<string | null>(null);
  
    const fetchHealthStatus = async () => {
      try {
        const response = await fetch('http://poll-manager:8081/api/poll/health');
        const data: HealthCheckResponse = await response.json();
        setHealthStatus(data.status);
      } catch (error) {
        console.error('Error fetching health status:', error);
        setHealthStatus('Error fetching health status');
      }
    };
  
    return (
      <div>
        <button onClick={fetchHealthStatus}>Check Health</button>
        <header>Health Status: {healthStatus || 'Not checked yet'}</header>
      </div>
    );
  }
export default HealthCheckButton;