// axiosInstance.ts
import axios from "axios";
import keycloak from "./keycloak.service"; // Import your initialized Keycloak instance

// Create an Axios instance with a common base URL
const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_API_GATEWAY_URL}`, // Common base URL for all services
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

// Add a request interceptor to attach the Keycloak access token to every request
axiosInstance.interceptors.request.use(
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

export default axiosInstance;
