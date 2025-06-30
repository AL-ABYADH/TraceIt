/**
 * Interface representing the structure of the JWT payload.
 * Aligns with JWT standards by using `sub` (subject) to denote user identity.
 */
export interface JwtPayload {
  sub: string; // Subject: Unique user ID (commonly used as `sub` in JWT standard)
  username: string; // Username of the authenticated user
  email: string; // Email of the authenticated user
  iat?: number; // Issued At (timestamp automatically added by JWT)
  exp?: number; // Expiration Time (timestamp automatically added by JWT)
}
