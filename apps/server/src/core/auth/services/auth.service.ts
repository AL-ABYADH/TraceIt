import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Response, Request } from "express";

import { ValidateUserOperation } from "../operations/validate-user.operation";
import { RegisterUserOperation } from "../operations/register-user.operation";
import { LoginUserOperation } from "../operations/login-user.operation";
import { RefreshTokensOperation } from "../operations/refresh-tokens.operation";
import { LogoutUserOperation } from "../operations/logout-user.operation";
import { LogoutAllDevicesOperation } from "../operations/logout-all-devices.operation";
import { CleanupExpiredTokensOperation } from "../operations/cleanup-expired-tokens.operation";

import { LoginInterface } from "../interfaces/login.interface";
import { RegisterInterface } from "../interfaces/register.interface";
import { RefreshToken } from "../entities/refresh-token.entity";
import { AuthRepository } from "../repositories/auth.repository";

@Injectable()
export class AuthService {
  constructor(
    private readonly validateUserOp: ValidateUserOperation,
    private readonly registerUserOp: RegisterUserOperation,
    private readonly loginUserOp: LoginUserOperation,
    private readonly refreshTokensOp: RefreshTokensOperation,
    private readonly logoutUserOp: LogoutUserOperation,
    private readonly logoutAllDevicesOp: LogoutAllDevicesOperation,
    private readonly cleanupExpiredTokensOp: CleanupExpiredTokensOperation,
    private readonly authRepository: AuthRepository,
  ) {}

  /**
   * Validates the user's credentials.
   * @param credentials - Login credentials.
   */
  async validateUser(credentials: LoginInterface): Promise<any> {
    return this.validateUserOp.execute(credentials);
  }

  /**
   * Registers a new user and issues tokens.
   * @param registrationData - Registration payload.
   * @param userAgent - User-Agent string from the request.
   * @param ipAddress - Client IP address.
   * @param res - Express Response object for setting cookies.
   */
  async register(
    registrationData: RegisterInterface,
    userAgent: string,
    ipAddress: string,
    res: Response,
  ) {
    return this.registerUserOp.execute(registrationData, userAgent, ipAddress, res);
  }

  /**
   * Authenticates a user and issues tokens.
   * @param credentials - Login payload.
   * @param userAgent - User-Agent string from the request.
   * @param ipAddress - Client IP address.
   * @param res - Express Response object for setting cookies.
   */
  async login(credentials: LoginInterface, userAgent: string, ipAddress: string, res: Response) {
    return this.loginUserOp.execute(credentials, userAgent, ipAddress, res);
  }

  /**
   * Refreshes access and refresh tokens using the provided refresh token.
   * @param refreshToken - Refresh token string.
   * @param userAgent - User-Agent string.
   * @param ipAddress - IP address of the client.
   * @param res - Express response object.
   */
  async refreshTokens(refreshToken: string, userAgent: string, ipAddress: string, res: Response) {
    return this.refreshTokensOp.execute(refreshToken, userAgent, ipAddress, res);
  }

  /**
   * Logs the user out by revoking the current refresh token.
   * @param req - Express request object.
   * @param res - Express response object.
   */
  async logout(req: Request, res: Response): Promise<boolean> {
    return this.logoutUserOp.execute(req, res);
  }

  /**
   * Logs the user out from all devices by revoking all refresh tokens.
   * @param req - Express request object.
   * @param res - Express response object.
   */
  async logoutAll(req: Request, res: Response): Promise<boolean> {
    return this.logoutAllDevicesOp.execute(req, res);
  }

  /**
   * Cleans up expired refresh tokens that are no longer valid.
   */
  async cleanupExpiredTokens(): Promise<void> {
    return this.cleanupExpiredTokensOp.execute();
  }

  async checkIfExists(refreshToken: string): Promise<RefreshToken | null> {
    const token = await this.authRepository.checkIfExists(refreshToken);

    if (token) {
      if (token.expiresAt < new Date().toISOString()) {
        throw new UnauthorizedException("Refresh token has expired.");
      }

      // if (token.revoked) {
      //   throw new UnauthorizedException("Refresh token has been stopped.");
      // }
    }

    return token;
  }
}
