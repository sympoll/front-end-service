import Keycloak, { KeycloakConfig } from "keycloak-js";


const keycloakConfig: KeycloakConfig = {
    url: import.meta.env.VITE_BASE_AUTH_URL,
    realm: "sympoll-realm",
    clientId: 'frontend-client'
}

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;