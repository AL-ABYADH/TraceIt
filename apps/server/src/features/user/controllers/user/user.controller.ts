import { Body, Controller, Get, Param, Put } from "@nestjs/common";
import { UserService } from "../../services/user/user.service";
import { Public } from "src/core/auth/decorators/public.decorator";
import { zodBody, zodParam } from "src/common/pipes/zod";
import {
  type UpdateUserDto,
  updateUserSchema,
  type UuidParamsDto,
  uuidParamsSchema,
} from "@repo/shared-schemas";
import { User } from "../../entities/user.entity";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Public()
  @Put(":id")
  updateProfile(
    @Param(zodParam(uuidParamsSchema)) userId: UuidParamsDto,
    @Body(zodBody(updateUserSchema)) dto: UpdateUserDto,
  ): Promise<User[]> {
    return this.userService.updateProfile(userId.id, dto);
  }

  @Get(":id")
  find(@Param(zodParam(uuidParamsSchema)) userId: UuidParamsDto): Promise<User> {
    return this.userService.findById(userId.id);
  }

  @Put(":id/verify-email")
  verifyEmail(@Param(zodParam(uuidParamsSchema)) userId: UuidParamsDto): Promise<User[]> {
    return this.userService.verifyEmail(userId.id);
  }
}
