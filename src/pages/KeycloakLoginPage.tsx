import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { useUser } from "../context/UserContext";
import { useEffect } from "react";

export default function KeycloakLoginPage() {
  const { keycloak, authenticated, initialized } = useAuth(); // Use initialized state
  const navigate = useNavigate();
  const { user } = useUser();

  const handleLogIn = () => {
    if (initialized && keycloak && !authenticated) {
      keycloak
        .login({
          redirectUri: "http://localhost:8080/feed" // Specify the redirect URI
        })
        .catch((error) => {
          console.error("Failed to initiate Keycloak login:", error);
        });
    } else if (!initialized) {
      console.warn("Keycloak is not initialized yet.");
    } else {
      console.warn("Keycloak is already authenticated.");
    }
  };

  useEffect(() => {
    handleLogIn();
  }, [initialized]); // Run once, but only after Keycloak is initialized

  // Effect to handle redirection to /feed after user is set
  useEffect(() => {
    if (user) {
      navigate("/feed"); // Navigate to /feed when user context is set
    }
  }, [user, navigate]);

  return <section className="login-page-container"></section>;
}
