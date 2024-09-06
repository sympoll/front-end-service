import Keycloak, { KeycloakConfig } from 'keycloak-js';

const keycloakConfig: KeycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
};

const keycloak = new Keycloak(keycloakConfig);

let initPromise: Promise<boolean> | null = null; // Guard with a promise

export const initKeycloak = (onAuthSuccess: () => void): Promise<boolean> => {
  if (!initPromise) {
    initPromise = keycloak
      .init({
        onLoad: 'check-sso', // Or 'login-required' based on your use case
        checkLoginIframe: false,
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      })
      .then((authenticated) => {
        if (authenticated) {
          onAuthSuccess();
        }
        return authenticated;
      })
      .catch((error) => {
        console.error('Keycloak initialization failed', error);
        throw error;
      });
  }
  return initPromise;
};

export default keycloak;