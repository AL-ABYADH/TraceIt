import { IsNotEmpty, IsString } from "class-validator";

/**
 * Data Transfer Object for token refresh requests
 * Used when client wants to get a new access token using their refresh token
 *
 * Note: In most implementations, the refresh token is sent via HTTP-only cookie,
 * so this DTO might not be necessary. It's included here for completeness and
 * for scenarios where the refresh token is sent in the request body.
 */
export class RefreshTokenDto {
  @IsString({ message: "Refresh token must be a string" })
  @IsNotEmpty({ message: "Refresh token is required" })
  refreshToken: string;

  constructor(partial: Partial<RefreshTokenDto>) {
    Object.assign(this, partial);
  }
}
