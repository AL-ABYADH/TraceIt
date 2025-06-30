/**
 * Data Transfer Object representing the tokens response
 * Used when returning authentication tokens to the client
 * The refresh token is sent as an HTTP-only cookie and not included in the response body
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

  constructor(partial: Partial<TokensDto>) {
    Object.assign(this, partial);
  }
}
