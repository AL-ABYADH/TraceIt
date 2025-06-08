import { Injectable, BadRequestException } from "@nestjs/common";
import { UserService } from "../../../features/user/services/user/user.service";
import { LoginDto } from "../dtos/login.dto";
import * as argon2 from "argon2";
import { User } from "src/features/user/entities/user.entity";

@Injectable()
export class ValidateUserOperation {
  constructor(private userService: UserService) {}

  async execute(loginDto: LoginDto): Promise<any> {
    let user: User | null | undefined;

    if (loginDto.email) {
      user = await this.userService.findByEmail(loginDto.email);
    } else if (loginDto.username) {
      user = await this.userService.findByUsername(loginDto.username);
    } else {
      throw new BadRequestException("Email or username must be provided");
    }

    if (!user) return null;

    try {
      const isPasswordValid = await argon2.verify(user.password, loginDto.password);
      if (!isPasswordValid) return null;

      const { password, ...result } = user;
      return result;
    } catch (error) {
      return null;
    }
  }
}
