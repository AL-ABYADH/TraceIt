import { Body, Controller, Get, Param, Put } from "@nestjs/common";
import { UserService } from "../../services/user/user.service";
import { UpdateUserDto } from "../../dtos/update-user.dto";
import { User } from "../../entities/user.entity";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put(":id")
  updateProfile(@Param("id") id: string, @Body() dto: UpdateUserDto): Promise<User> {
    return this.userService.updateProfile(id, dto);
  }

  @Get(":id")
  find(@Param("id") id: string): Promise<User> {
    return this.userService.find(id);
  }

  @Put(":id/verify-email")
  verifyEmail(@Param("id") id: string): Promise<User> {
    return this.userService.verifyEmail(id);
  }
}
