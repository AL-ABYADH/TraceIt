/**
 * Data Transfer Object representing the tokens response
 * Used when returning authentication tokens to the client
 * Note: In a production environment, the refresh token should typically
 * be sent as an HTTP-only cookie and not included in the response body
 */
export class TokensDto {
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

  /**
   * Optional refresh token for obtaining a new access token
   * Only included when not using HTTP-only cookies
   */
  refreshToken?: string;

  constructor(partial: Partial<TokensDto>) {
    Object.assign(this, partial);
  }
}

/**
 * Data Transfer Object for access token only responses
 * Used when refresh token is handled via HTTP-only cookies
 */
export class AccessTokenDto {
  /**
   * JWT access token for authenticating API requests
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

  constructor(partial: Partial<AccessTokenDto>) {
    Object.assign(this, partial);
  }
}
