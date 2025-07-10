import { BaseDto } from "../../../common/dto/base.dto";
import { TokensInterface } from "../interfaces/tokens.interface";
import { Expose } from "class-transformer";

/**
 * Data Transfer Object representing the tokens response
 * Used when returning authentication tokens to the client
 * The refresh token is sent as an HTTP-only cookie and not included in the response body
 */
export class TokensDto extends BaseDto<TokensInterface> {
  /**
   * JWT access token for authenticating API requests
   * Short-lived (15-60 minutes)
   */
  @Expose()
  accessToken: string;

  /**
   * Token type, typically "Bearer" for JWT authentication
   */
  @Expose()
  tokenType: string;

  /**
   * Access token expiration time in seconds
   */
  @Expose()
  expiresIn: number;
}
