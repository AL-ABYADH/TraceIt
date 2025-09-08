import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { v4 as uuidv4 } from "uuid";
import { Response } from "express";
import { createHash } from "crypto";

import { AuthRepository } from "../repositories/auth.repository";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { TokensInterface } from "../interfaces/tokens.interface";
import { User } from "../../../features/user/models/user.model";

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
   */
  async execute(
    user: User,
    userAgent: string,
    ipAddress: string,
    res: Response,
  ): Promise<TokensInterface> {
    // Load config values
    const accessTokenTTL = this.configService.get<string>("JWT_EXPIRATION", "15m");
    const refreshTokenTTL = this.configService.get<string>("JWT_REFRESH_EXPIRATION", "7d");
    const isSecureCookie = this.configService.get<boolean>("COOKIE_SECURE", false);
    const cookieDomain = this.configService.get<string>("COOKIE_DOMAIN", "localhost");
    const refreshSecret = this.configService.get<string>("JWT_REFRESH_SECRET");

    if (!refreshSecret) {
      throw new Error("JWT_REFRESH_SECRET is not defined in the environment variables");
    }

    // Generate a token ID
    const tokenId = uuidv4();

    // Calculate expirations
    const refreshTokenExpiresIn = this.parseExpiration(refreshTokenTTL);
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + refreshTokenExpiresIn);

    // Build access token payload
    const jwtPayload: JwtPayload = {
      sub: user.id,
      data: tokenId,
      username: user.username,
      email: user.email,
    };

    // Generate access token
    const accessToken = this.jwtService.sign(jwtPayload);

    // Create a fingerprint of the access token (for linking without DB check)
    const accessTokenFingerprint = this.createFingerprint(accessToken);

    // Create JWT refresh token payload
    const refreshTokenPayload = {
      jti: tokenId, // JWT ID - unique identifier for this token
      sub: user.id, // Subject - user ID
      fingerprint: accessTokenFingerprint, // Link to access token
      iat: Math.floor(Date.now() / 1000), // Issued at time
    };

    // Sign the refresh token with dedicated secret
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      secret: refreshSecret,
      expiresIn: refreshTokenTTL,
    });

    // Save refresh token reference in the database
    await this.authRepository.createRefreshToken(
      user.id,
      tokenId, // Store token ID, not the full JWT
      userAgent,
      ipAddress,
      expiresAt.getTime() / 1000,
    );

    // Set refresh token as a secure HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isSecureCookie,
      sameSite: "strict",
      domain: cookieDomain,
      path: "/",
      maxAge: refreshTokenExpiresIn * 1000, // Convert seconds to milliseconds
    });

    // Return the access token and its metadata
    return {
      accessToken,
      tokenType: "Bearer",
      expiresIn: this.parseExpiration(accessTokenTTL),
    };
  }

  /**
   * Creates a fingerprint of a token for linking tokens without DB checks
   */
  private createFingerprint(token: string): string {
    // Use first 8 characters of SHA-256 hash as fingerprint
    return createHash("sha256")
      .update(token.split(".")[2] || "")
      .digest("hex")
      .substring(0, 8);
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
