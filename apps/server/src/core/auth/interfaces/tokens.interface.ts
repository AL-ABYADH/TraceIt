export interface TokensInterface {
  /**
   * JWT access token for authenticating API requests
   * Short-lived (15-60 minutes)
   */
  accessToken: string;

  /**
   * Token type, typically "Bearer" for JWT authentication
   */
  tokenType: string;

  /**
   * Access token expiration time in seconds
   */
  expiresIn: number;
}
