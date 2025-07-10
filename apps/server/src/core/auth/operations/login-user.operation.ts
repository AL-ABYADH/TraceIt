import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Response } from "express";

import { ValidateUserOperation } from "./validate-user.operation";
import { GenerateTokensOperation } from "./generate-tokens.operation";
import { LoginInterface } from "../interfaces/login.interface";

@Injectable()
export class LoginUserOperation {
  constructor(
    private readonly validateUserOperation: ValidateUserOperation,
    private readonly generateTokensOperation: GenerateTokensOperation,
  ) {}

  /**
   * Executes the user login operation.
   * - Validates the provided credentials
   * - Generates and returns access and refresh tokens
   *
   * @param loginData - The user's login credentials
   * @param userAgent - The client's user-agent header string
   * @param ipAddress - The client's IP address
   * @param res - Express Response object (used for setting cookie)
   * @throws UnauthorizedException if credentials are invalid
   * @returns Object containing JWT access token and metadata
   */
  async execute(loginData: LoginInterface, userAgent: string, ipAddress: string, res: Response) {
    // Validate user credentials
    const user = await this.validateUserOperation.execute(loginData);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Generate tokens and return to client
    return this.generateTokensOperation.execute(user, userAgent, ipAddress, res);
  }
}
