import { Body, Controller, Get, Put, UseInterceptors } from "@nestjs/common";
import { UserService } from "../../services/user/user.service";
import { zodBody } from "src/common/pipes/zod";
import {
  type UpdateUserDto,
  updateUserSchema,
  SafeUserDetailDto,
  safeUserDetailSchema,
  type UuidParamsDto,
} from "@repo/shared-schemas";
import { CurrentUserId } from "../../../../common/decorators/current-user-id.decorator";
import { ZodResponseInterceptor } from "src/common/interceptors/zodResponseInterceptor";
import { ResponseSchema } from "src/common/decorators/response-schema.decorator";

@UseInterceptors(ZodResponseInterceptor)
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put()
  @ResponseSchema(safeUserDetailSchema)
  updateProfile(
    @CurrentUserId() userId: UuidParamsDto,
    @Body(zodBody(updateUserSchema)) dto: UpdateUserDto,
  ): Promise<SafeUserDetailDto> {
    return this.userService.updateProfile(userId.id, dto);
  }

  // @Get(":id")
  // find(@Param(zodParam(uuidParamsSchema)) userId: UuidParamsDto): Promise<User> {
  //   return this.userService.findById(userId.id);
  // }

  @Put("verify-email")
  @ResponseSchema(safeUserDetailSchema)
  verifyEmail(@CurrentUserId() userId: UuidParamsDto): Promise<SafeUserDetailDto> {
    return this.userService.verifyEmail(userId.id);
  }

  @Get("me")
  @ResponseSchema(safeUserDetailSchema)
  getProfile(@CurrentUserId() userId: string): Promise<SafeUserDetailDto> {
    return this.userService.findById(userId);
  }
}
