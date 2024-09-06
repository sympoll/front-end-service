import React, { createContext, ReactNode, useEffect, useState, useContext } from "react";
import keycloak, { initKeycloak } from "../services/keycloak.service";
import Keycloak from "keycloak-js";

// Define types for context
interface AuthContextType {
  keycloak: Keycloak | null;
  authenticated: boolean;
  initialized: boolean; // Track initialization state
}

const AuthContext = createContext<AuthContextType>({
  keycloak: null,
  authenticated: false,
  initialized: false
});

interface AuthProviderProps {
  children: ReactNode;
}

const onAuthSuccess = () => {
  // Handle post-authentication actions if needed
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false); // Initialization state
  const [keycloakInstance, setKeycloakInstance] = useState<Keycloak | null>(null);

  const enableAuth = import.meta.env.VITE_ENABLE_AUTH === "auth-enabled";

  useEffect(() => {
    const initializeKeycloak = async () => {
      if (enableAuth) {
        try {
          const isAuthenticated = await initKeycloak(onAuthSuccess);
          setAuthenticated(isAuthenticated);
          setInitialized(true); // Set initialized to true after init completes
          setKeycloakInstance(keycloak);
        } catch (error) {
          console.error("Keycloak initialization failed", error);
          setInitialized(true); // Mark as initialized even if it failed to prevent blocking UI
        }
      } else {
        // If authentication is disabled, mock authenticated state
        setAuthenticated(true);
        setInitialized(true);
      }
    };

    initializeKeycloak();
  }, [enableAuth]);

  return (
    <AuthContext.Provider value={{ keycloak: keycloakInstance, authenticated, initialized }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access the auth context
export const useAuth = () => useContext(AuthContext);
