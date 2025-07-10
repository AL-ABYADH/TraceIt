import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthRepository } from "../repositories/auth.repository";
import { Response, Request } from "express";

@Injectable()
export class LogoutAllDevicesOperation {
  constructor(private authRepository: AuthRepository) {}

  async execute(req: Request, res: Response): Promise<boolean> {
    const refreshToken = req.cookies["refreshToken"] as string | undefined;
    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token is missing");
    }
    const userId = await this.authRepository.findUserIdByRefreshToken(refreshToken);
    if (!userId) {
      throw new UnauthorizedException("Refresh token is missing");
    }
    await this.authRepository.revokeAllUserRefreshTokens(userId);
    res.clearCookie("refreshToken");
    res.removeHeader("authorization");
    return true;
  }
}
