/**
 * Interface representing the structure of the JWT payload.
 *
 * This payload conforms to JWT standards and includes additional fields
 * for enhanced authentication and token tracking.
 */
export interface JwtPayload {
  sub: string; // Subject: Unique user ID (as per JWT standard)
  data: string; // Refresh token ID stored in the database
  username: string; // Authenticated user's username
  email: string; // Authenticated user's email address
  iat?: number; // Issued At (timestamp when the token was issued)
  exp?: number; // Expiration Time (timestamp when the token expires)
}
