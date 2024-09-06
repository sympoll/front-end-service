import Keycloak, { KeycloakConfig } from "keycloak-js";

const keycloakConfig: KeycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID
};

const keycloak = new Keycloak(keycloakConfig);

let initPromise: Promise<void> | null = null;

export const initKeycloak = async () => {
  if (!initPromise) {
    // Create a new promise and assign it to initPromise
    initPromise = keycloak.init({
      onLoad: "check-sso",
      checkLoginIframe: false,
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    }).then(() => {
      console.log('Keycloak initialized successfully');
    }).catch((error) => {
      console.error('Keycloak init failed', error);
      throw error; // This keeps the promise rejected state
    });
  }
  
  // Return the existing promise to prevent multiple initializations
  return initPromise;
};

export default keycloak;