import { Injectable, BadRequestException } from "@nestjs/common";
import { UserService } from "../../../features/user/services/user/user.service";
import * as argon2 from "argon2";
import { User } from "src/features/user/entities/user.entity";
import { LoginInterface } from "../interfaces/login.interface";

@Injectable()
export class ValidateUserOperation {
  constructor(private userService: UserService) {}

  async execute(loginInterface: LoginInterface): Promise<any> {
    let user: User | null | undefined;

    if (loginInterface.email) {
      user = await this.userService.findByEmail(loginInterface.email);
    } else if (loginInterface.username) {
      user = await this.userService.findByUsername(loginInterface.username);
    } else {
      throw new BadRequestException("Email or username must be provided");
    }

    if (!user) return null;

    try {
      const isPasswordValid = await argon2.verify(user.password, loginInterface.password);
      if (!isPasswordValid) return null;

      const { password, ...result } = user;
      return result;
    } catch (error) {
      return null;
    }
  }
}
