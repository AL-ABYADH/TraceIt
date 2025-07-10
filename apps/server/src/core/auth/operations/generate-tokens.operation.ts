import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { v4 as uuidv4 } from "uuid";
import { Response } from "express";

import { AuthRepository } from "../repositories/auth.repository";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { TokensInterface } from "../interfaces/tokens.interface";
import { User } from "../../../features/user/entities/user.entity";

@Injectable()
export class GenerateTokensOperation {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authRepository: AuthRepository,
  ) {}

  /**
   * Generates access and refresh tokens for a given user.
   * Sets refresh token as an HTTP-only cookie in the response.
   *
   * @param user - The authenticated user entity
   * @param userAgent - The client's User-Agent string
   * @param ipAddress - The client's IP address
   * @param res - Express Response object (used for setting cookie)
   * @returns TokensInterface - Access token metadata
   */
  async execute(
    user: User,
    userAgent: string,
    ipAddress: string,
    res: Response,
  ): Promise<TokensInterface> {
    // Load config values
    const accessTokenTTL = this.configService.get<string>("JWT_EXPIRATION", "15m");
    const refreshTokenTTL = this.configService.get<number>("JWT_REFRESH_EXPIRATION", 604800); // default: 7 days
    const isSecureCookie = this.configService.get<boolean>("COOKIE_SECURE", false);
    const cookieDomain = this.configService.get<string>("COOKIE_DOMAIN", "localhost");

    // Generate a new UUID-based refresh token
    const rawRefreshToken = uuidv4();

    // Save refresh token in the database and associate it with the user
    const storedToken = await this.authRepository.createRefreshToken(
      user.id,
      rawRefreshToken,
      userAgent,
      ipAddress,
      refreshTokenTTL,
    );

    // Build JWT payload
    const jwtPayload: JwtPayload = {
      sub: user.id,
      data: storedToken.id, // Reference to refresh token record in DB
      username: user.username,
      email: user.email,
    };

    // Generate access token
    const accessToken = this.jwtService.sign(jwtPayload);

    // Set refresh token as a secure HTTP-only cookie
    res.cookie("refreshToken", rawRefreshToken, {
      httpOnly: true,
      secure: isSecureCookie,
      sameSite: "strict",
      domain: cookieDomain,
      path: "/",
      maxAge: refreshTokenTTL * 1000, // Convert seconds to milliseconds
    });

    // Calculate access token expiration time in seconds
    const expiresIn = this.parseExpiration(accessTokenTTL);

    // Return the access token and its metadata
    return {
      accessToken,
      tokenType: "Bearer",
      expiresIn,
    };
  }

  /**
   * Converts string duration like '15m' or '1h' to seconds.
   */
  private parseExpiration(duration: string): number {
    const unit = duration.slice(-1);
    const value = parseInt(duration.slice(0, -1));

    switch (unit) {
      case "m":
        return value * 60;
      case "h":
        return value * 3600;
      case "d":
        return value * 86400;
      default:
        return 900; // Default: 15 minutes
    }
  }
}
