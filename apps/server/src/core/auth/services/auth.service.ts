// src/core/auth/services/auth.service.ts
import { Injectable } from "@nestjs/common";
import { ValidateUserOperation } from "../operations/validate-user.operation";
import { RegisterUserOperation } from "../operations/register-user.operation";
import { LoginUserOperation } from "../operations/login-user.operation";
import { RefreshTokensOperation } from "../operations/refresh-tokens.operation";
import { LogoutUserOperation } from "../operations/logout-user.operation";
import { LogoutAllDevicesOperation } from "../operations/logout-all-devices.operation";
import { CleanupExpiredTokensOperation } from "../operations/cleanup-expired-tokens.operation";
import { LoginDto } from "../dtos/login.dto";
import { RegisterDto } from "../dtos/register.dto";
import { Response, Request } from "express";
import { GenerateKeysCommand } from "../../commands/generate-keys.command";

@Injectable()
export class AuthService {
  constructor(
    private validateUserOperation: ValidateUserOperation,
    private registerUserOperation: RegisterUserOperation,
    private loginUserOperation: LoginUserOperation,
    private refreshTokensOperation: RefreshTokensOperation,
    private logoutUserOperation: LogoutUserOperation,
    private logoutAllDevicesOperation: LogoutAllDevicesOperation,
    private cleanupExpiredTokensOperation: CleanupExpiredTokensOperation,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<any> {
    return this.validateUserOperation.execute(loginDto);
  }

  async register(registerDto: RegisterDto, userAgent: string, ip: string, res: Response) {
    return this.registerUserOperation.execute(registerDto, userAgent, ip, res);
  }

  async login(loginDto: LoginDto, userAgent: string, ip: string, res: Response) {
    return this.loginUserOperation.execute(loginDto, userAgent, ip, res);
  }

  async refreshTokens(refreshToken: string, userAgent: string, ip: string, res: Response) {
    return this.refreshTokensOperation.execute(refreshToken, userAgent, ip, res);
  }

  async logout(res: Response): Promise<boolean> {
    return this.logoutUserOperation.execute(res);
  }

  async logoutAll(req: Request, res: Response): Promise<boolean> {
    return this.logoutAllDevicesOperation.execute(req, res);
  }

  async cleanupExpiredTokens(): Promise<void> {
    return this.cleanupExpiredTokensOperation.execute();
  }
}
