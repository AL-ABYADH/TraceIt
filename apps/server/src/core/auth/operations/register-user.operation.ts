import { Injectable } from "@nestjs/common";
import { UserService } from "../../../features/user/services/user/user.service";
import { GenerateTokensOperation } from "./generate-tokens.operation";
import { Response } from "express";
import * as argon2 from "argon2";
import { RegisterInterface } from "../interfaces/register.interface";

@Injectable()
export class RegisterUserOperation {
  constructor(
    private userService: UserService,
    private generateTokensOperation: GenerateTokensOperation,
  ) {}

  async execute(
    registerInterface: RegisterInterface,
    userAgent: string,
    ip: string,
    res: Response,
  ) {
    const hashedPassword = await argon2.hash(registerInterface.password);

    const user = await this.userService.register({
      username: registerInterface.username,
      displayName: registerInterface.displayName,
      email: registerInterface.email,
      password: hashedPassword,
    });

    return this.generateTokensOperation.execute(user, userAgent, ip, res);
  }
}
