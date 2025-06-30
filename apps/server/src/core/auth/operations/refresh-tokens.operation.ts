import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../../../features/user/services/user/user.service";
import { AuthRepository } from "../repositories/auth.repository";
import { GenerateTokensOperation } from "./generate-tokens.operation";
import { Response } from "express";

@Injectable()
export class RefreshTokensOperation {
  constructor(
    private userService: UserService,
    private authRepository: AuthRepository,
    private generateTokensOperation: GenerateTokensOperation,
  ) {}

  async execute(refreshToken: string, userAgent: string, ip: string, res: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token not found");
    }

    const storedToken = await this.authRepository.findRefreshTokenWithUserId(refreshToken);

    if (!storedToken || storedToken.revoked) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    const userId = storedToken.user.id;
    if (!userId) {
      throw new UnauthorizedException("Could not verify token owner");
    }

    await this.authRepository.revokeRefreshToken(refreshToken);

    const user = await this.userService.find(userId);
    if (!user) {
      throw new UnauthorizedException("User no longer exists");
    }

    return this.generateTokensOperation.execute(user, userAgent, ip, res);
  }
}
