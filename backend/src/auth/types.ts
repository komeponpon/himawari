export interface KeycloakUser {
  id: string;
  email: string;
  customerGroup: string;
  roles: string[];
}

declare global {
  namespace Express {
    interface Request {
      user: KeycloakUser;
    }
  }
}
