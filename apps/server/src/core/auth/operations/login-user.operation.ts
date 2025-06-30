// src/core/auth/operations/login-user.operation.ts
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ValidateUserOperation } from "./validate-user.operation";
import { GenerateTokensOperation } from "./generate-tokens.operation";
import { LoginDto } from "../dtos/login.dto";
import { Response } from "express";

@Injectable()
export class LoginUserOperation {
  constructor(
    private validateUserOperation: ValidateUserOperation,
    private generateTokensOperation: GenerateTokensOperation,
  ) {}

  async execute(loginDto: LoginDto, userAgent: string, ip: string, res: Response) {
    const user = await this.validateUserOperation.execute(loginDto);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return this.generateTokensOperation.execute(user, userAgent, ip, res);
  }
}
