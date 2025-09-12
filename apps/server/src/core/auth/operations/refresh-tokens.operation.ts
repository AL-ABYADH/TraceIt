import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthRepository } from "../repositories/auth.repository";
import { GenerateTokensOperation } from "./generate-tokens.operation";
import { Response } from "express";
import jwt from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../../../features/user/services/user/user.service";

@Injectable()
export class RefreshTokensOperation {
  constructor(
    private authRepository: AuthRepository,
    private userService: UserService,
    private generateTokensOperation: GenerateTokensOperation,
    private configService: ConfigService,
  ) {}

  async execute(refreshToken: string, userAgent: string, ip: string, res: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token not found");
    }

    // Verify refresh token JWT and extract tokenId
    const refreshSecret = this.configService.get<string>("JWT_REFRESH_SECRET");
    if (!refreshSecret) {
      throw new Error("JWT_REFRESH_SECRET is not defined");
    }

    try {
      // Verify the JWT
      const payload = jwt.verify(refreshToken, refreshSecret) as {
        jti: string;
        sub: string;
        fingerprint: string;
      };
      const tokenId = payload.jti;
      const userId = payload.sub;

      // Check in the database to ensure the token has not been revoked
      const isValid = await this.authRepository.checkIfExists(tokenId);
      if (!isValid) {
        throw new UnauthorizedException("Refresh token has been revoked");
      }

      // Fetch the user directly using the ID without validating the token
      const user = await this.userService.findById(userId);
      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      // Revoke the old token
      await this.authRepository.revokeRefreshToken(tokenId);

      // Generate new tokens
      return this.generateTokensOperation.execute(user, userAgent, ip, res);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException("Refresh token has expired");
      }
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException("Invalid refresh token");
    }
  }
}
