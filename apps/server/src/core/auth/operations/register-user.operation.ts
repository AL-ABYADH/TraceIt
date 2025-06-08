import { Injectable } from "@nestjs/common";
import { UserService } from "../../../features/user/services/user/user.service";
import { RegisterDto } from "../dtos/register.dto";
import { AuthRepository } from "../repositories/auth.repository";
import { GenerateTokensOperation } from "./generate-tokens.operation";
import { Response } from "express";
import * as argon2 from "argon2";

@Injectable()
export class RegisterUserOperation {
  constructor(
    private userService: UserService,
    private authRepository: AuthRepository,
    private generateTokensOperation: GenerateTokensOperation,
  ) {}

  async execute(registerDto: RegisterDto, userAgent: string, ip: string, res: Response) {
    const hashedPassword = await argon2.hash(registerDto.password);

    const user = await this.userService.register({
      username: registerDto.username,
      displayName: registerDto.displayName,
      email: registerDto.email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return this.generateTokensOperation.execute(user, userAgent, ip, res);
  }
}
