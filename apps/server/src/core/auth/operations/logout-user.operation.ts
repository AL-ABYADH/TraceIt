import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Response, Request } from "express";
import { AuthRepository } from "../repositories/auth.repository";
import jwt from "jsonwebtoken";

@Injectable()
export class LogoutUserOperation {
  constructor(private authRepository: AuthRepository) {}

  async execute(req: Request, res: Response): Promise<boolean> {
    const refreshToken = req.cookies["refreshToken"] as string | undefined;
    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token is missing");
    }

    // Extract the tokenId (jti) from the JWT
    try {
      const refreshSecret = process.env.JWT_REFRESH_SECRET;
      if (!refreshSecret) {
        throw new Error("JWT_REFRESH_SECRET is not defined");
      }

      const payload = jwt.verify(refreshToken, refreshSecret) as { jti: string };
      const tokenId = payload.jti;

      // Revoke the token using the tokenId
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
}
