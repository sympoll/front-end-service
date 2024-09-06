import React, { createContext, ReactNode, useEffect, useState, useContext } from "react";
import keycloak, { initKeycloak } from "../services/keycloak.service";
import Keycloak from "keycloak-js";

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
    const initializeKeycloak = async () => {
      if (enableAuth) {
        try {
          await initKeycloak(); // Use the guarded initKeycloak function
          setAuthenticated(keycloak.authenticated || false);
          setKeycloakInstance(keycloak);
        } catch (error) {
          console.error("Keycloak initialization failed", error);
        }
      } else {
        // If authentication is disabled, mock authenticated state
        setAuthenticated(true);
      }
    };

    initializeKeycloak();
  }, [enableAuth]);

  return (
    <AuthContext.Provider value={{ keycloak: keycloakInstance, authenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access the auth context
export const useAuth = () => useContext(AuthContext);
