import Keycloak, { KeycloakConfig } from "keycloak-js";
import { useAuth } from "../context/AuthProvider";

// This file sets up the Keycloak configuration and initializes a Keycloak instance for managing authentication in the application.
// The initKeycloak function initializes Keycloak and optionally handles authentication success through a callback.
// It uses a promise guard to ensure that the Keycloak initialization is only triggered once, preventing multiple initializations.

const keycloakConfig: KeycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID
};

const keycloak = new Keycloak(keycloakConfig);

let initPromise: Promise<boolean> | null = null; // Guard with a promise

export const initKeycloak = (onAuthSuccess: () => void): Promise<boolean> => {
  if (!initPromise) {
    initPromise = keycloak
      .init({
        onLoad: "check-sso",
        checkLoginIframe: false,
        silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
        enableLogging: true
      })
      .then((authenticated) => {
        if (authenticated) {
          onAuthSuccess();
        }
        return authenticated;
      })
      .catch((error) => {
        console.error("Keycloak initialization failed", error);
        throw error;
      });
  }
  return initPromise;
};

export default keycloak;
