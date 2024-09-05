import React, { createContext, ReactNode, useEffect, useState, useContext } from "react";
import Keycloak from "keycloak-js";
import keycloak from "../services/keycloak.service";

// Define types for context
interface AuthContextType {
  keycloak: Keycloak | null;
  authenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  keycloak: null,
  authenticated: false
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [keycloakInstance, setKeycloakInstance] = useState<Keycloak | null>(null);

  const enableAuth = import.meta.env.VITE_ENABLE_AUTH === "auth-enabled";

  useEffect(() => {
    if (enableAuth) {
      // Initialize Keycloak if authentication is enabled
      keycloak
        .init({
          onLoad: "login-required",
          checkLoginIframe: false
        })
        .then((auth) => {
          setAuthenticated(auth);
          setKeycloakInstance(keycloak);
        })
        .catch((error: Error) => {
          console.error("Keycloak init failed", error);
        });
    } else {
      // If authentication is disabled, mock authenticated state
      setAuthenticated(true);
    }
  }, [enableAuth]);

  return (
    <AuthContext.Provider value={{ keycloak: keycloakInstance, authenticated }}>
      {authenticated ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

// Custom hook to access the auth context
export const useAuth = () => useContext(AuthContext);
