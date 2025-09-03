import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthRepository } from "../repositories/auth.repository";
import { Response, Request } from "express";
import jwt from "jsonwebtoken";
import { TokenBlacklistService } from "../services/token-blacklist.service";

@Injectable()
export class LogoutAllDevicesOperation {
  constructor(
    private authRepository: AuthRepository,
    private blacklistService: TokenBlacklistService, // Add blacklist service
  ) {}

  async execute(req: Request, res: Response): Promise<boolean> {
    const refreshToken = req.cookies["refreshToken"] as string | undefined;
    const accessToken = this.extractAccessToken(req);

    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token is missing");
    }

    // Add access token to the blacklist if it exists
    if (accessToken) {
      await this.blacklistService.addToBlacklist(accessToken);
    }

    try {
      const refreshSecret = process.env.JWT_REFRESH_SECRET;
      if (!refreshSecret) {
        throw new Error("JWT_REFRESH_SECRET is not defined");
      }

      const payload = jwt.verify(refreshToken, refreshSecret) as { jti: string; sub: string };
      const userId = payload.sub;

      // Revoke all refresh tokens for the user
      await this.authRepository.revokeAllUserRefreshTokens(userId);

      res.clearCookie("refreshToken");
      res.removeHeader("authorization");
      return true;
    } catch (error) {
      res.clearCookie("refreshToken");
      res.removeHeader("authorization");

      if (error instanceof jwt.TokenExpiredError) {
        return true;
      }

      throw new UnauthorizedException("Invalid refresh token");
    }
  }
  private extractAccessToken(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    return authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  }
}
