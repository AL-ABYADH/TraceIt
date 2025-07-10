import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthRepository } from "../repositories/auth.repository";
import { GenerateTokensOperation } from "./generate-tokens.operation";
import { Response } from "express";

@Injectable()
export class RefreshTokensOperation {
  constructor(
    private authRepository: AuthRepository,
    private generateTokensOperation: GenerateTokensOperation,
  ) {}

  async execute(refreshToken: string, userAgent: string, ip: string, res: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token not found");
    }

    const user = await this.authRepository.findUserByRefreshToken(refreshToken);
    if (!user) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    await this.authRepository.revokeRefreshToken(refreshToken);
    return this.generateTokensOperation.execute(user, userAgent, ip, res);
  }
}
