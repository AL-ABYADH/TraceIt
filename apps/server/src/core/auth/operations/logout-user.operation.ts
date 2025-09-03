import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Response, Request } from "express";
import { AuthRepository } from "../repositories/auth.repository";
import jwt from "jsonwebtoken";
import { TokenBlacklistService } from "../services/token-blacklist.service";

@Injectable()
export class LogoutUserOperation {
  constructor(
    private authRepository: AuthRepository,
    private blacklistService: TokenBlacklistService,
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

    // Extract the tokenId (jti) from the JWT
    try {
      const refreshSecret = process.env.JWT_REFRESH_SECRET;
      if (!refreshSecret) {
        throw new Error("JWT_REFRESH_SECRET is not defined");
      }

      const payload = jwt.verify(refreshToken, refreshSecret) as { jti: string };
      const tokenId = payload.jti;

      // Revoke the refresh token using the tokenId
      await this.authRepository.revokeRefreshToken(tokenId);

      res.clearCookie("refreshToken");
      res.removeHeader("authorization");
      return true;
    } catch (error) {
      // If there is an issue with the JWT, at least clear the cookies
      res.clearCookie("refreshToken");
      res.removeHeader("authorization");

      // If the error is due to expiration, the token is already invalid
      if (error instanceof jwt.TokenExpiredError) {
        return true;
      }

      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  // Extract access token from the Authorization header
  private extractAccessToken(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    return authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  }
}
