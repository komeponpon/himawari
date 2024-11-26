export const config = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
  },
  keycloak: {
    realm: process.env.KEYCLOAK_REALM || 'your-realm',
    authServerUrl: process.env.KEYCLOAK_AUTH_SERVER_URL || 'http://localhost:8080/auth',
    clientId: process.env.KEYCLOAK_CLIENT_ID || 'your-client-id',
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || 'your-client-secret',
  }
};