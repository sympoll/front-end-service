import React, { createContext, ReactNode, useEffect, useState, useContext } from "react";
import keycloak, { initKeycloak } from "../services/keycloak.service";
import Keycloak, { KeycloakTokenParsed } from "keycloak-js";
import { invokeSignUp } from "../services/signup.service";
import { UserSignupData } from "../models/UserSignupData.model";
import { useUser } from "./UserContext";

// This file defines the AuthProvider component and AuthContext for managing authentication state using Keycloak in the React application.
// The AuthProvider initializes Keycloak, tracks authentication and initialization states, and handles user signup by using information from the Keycloak token.
// It provides the authentication state and Keycloak instance via AuthContext to the application, and the useAuth hook allows easy access to this context.

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

type ParsedToken = KeycloakTokenParsed & {
  userId?: string | undefined;
  email?: string;
  preferred_username?: string;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false); // Initialization state
  const [keycloakInstance, setKeycloakInstance] = useState<Keycloak | null>(null);
  const { user, setUser } = useUser(); // Destructure setUser from useUser hook

  // onAuthSuccess function to handle authentication success
  const onAuthSuccess = async () => {
    const parsedToken: ParsedToken | undefined = keycloak?.tokenParsed;

    if (parsedToken) {
      parsedToken.userId = parsedToken.sub; // Map sub to userId
    }

    if (parsedToken?.preferred_username && parsedToken.email) {
      const userData: UserSignupData = {
        userId: parsedToken.userId,
        username: parsedToken.preferred_username,
        email: parsedToken.email
      };

      try {
        const signedUpUser = await invokeSignUp(userData);
        // Save user data in UserContext
        setUser({
          userId: signedUpUser.userId, // Assuming the response contains userId
          username: signedUpUser.username,
          email: signedUpUser.email,
          profilePictureUrl: signedUpUser.profilePictureUrl,
          bannerPictureUrl: signedUpUser.bannerPictureUrl,
          timeCreated: signedUpUser.timeCreated
        });
        console.log(user);
      } catch (error) {
        console.error("Error during signup:", error);
      }
    } else {
      console.error("Missing username or email in the token");
    }
  };

  // Extract enableAuth environment variable
  const enableAuth = import.meta.env.VITE_ENABLE_AUTH === "auth-enabled";

  // useEffect hook to initialize Keycloak
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
        // Set dummy user data
        const userData: UserSignupData = {
          userId: import.meta.env.VITE_DEBUG_USER_ID,
          username: import.meta.env.VITE_DEBUG_USERNAME,
          email: import.meta.env.VITE_DEBUG_EMAIL
        };
        try {
          const signedUpUser = await invokeSignUp(userData);

          setUser({
            userId: signedUpUser.userId, // Assuming the response contains userId
            username: signedUpUser.username,
            email: signedUpUser.email,
            profilePictureUrl: signedUpUser.profilePictureUrl,
            bannerPictureUrl: signedUpUser.bannerPictureUrl,
            timeCreated: signedUpUser.timeCreated
          });
          // If authentication is disabled, mock authenticated state
          setAuthenticated(true);
          setInitialized(true);
        } catch (error) {
          console.error("dummy data login failed", error);
          setInitialized(true); // Mark as initialized even if it failed to prevent blocking UI
        }
      }
    };

    initializeKeycloak();
  }, [enableAuth, onAuthSuccess]);

  // Return the AuthContext.Provider with the necessary values
  return (
    <AuthContext.Provider value={{ keycloak: keycloakInstance, authenticated, initialized }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access the auth context
export const useAuth = () => useContext(AuthContext);
