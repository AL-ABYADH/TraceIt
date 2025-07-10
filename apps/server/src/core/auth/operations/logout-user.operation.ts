import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Response, Request } from "express";
import { AuthRepository } from "../repositories/auth.repository";

@Injectable()
export class LogoutUserOperation {
  constructor(private authRepository: AuthRepository) {}
  async execute(req: Request, res: Response): Promise<boolean> {
    const refreshToken = req.cookies["refreshToken"] as string | undefined;
    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token is missing");
    }
    await this.authRepository.revokeRefreshToken(refreshToken);
    res.clearCookie("refreshToken");
    res.removeHeader("authorization");
    return true;
  }
}
