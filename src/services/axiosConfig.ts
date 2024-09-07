// This automatically configures axios to work with access tokens and refresh them.

import axios from "axios";
import keycloak from "./keycloak.service"; // Adjust the import path as needed

// Set base URL globally if your API is consistent across services
axios.defaults.baseURL = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_API_GATEWAY_URL}`;
axios.defaults.withCredentials = true; // Include credentials with requests

// Add a request interceptor to attach the Keycloak access token to every request
axios.interceptors.request.use(
  async (config) => {
    if (keycloak.authenticated) {
      try {
        // Refresh the token if it's about to expire
        await keycloak.updateToken(30); // Refresh if the token will expire in the next 30 seconds
        const token = keycloak.token;

        // Attach the token to the Authorization header
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Failed to refresh Keycloak token", error);
        keycloak.login(); // Redirect to login if token refresh fails
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optionally, set common headers globally
axios.defaults.headers.common["Content-Type"] = "application/json";

export default axios;
