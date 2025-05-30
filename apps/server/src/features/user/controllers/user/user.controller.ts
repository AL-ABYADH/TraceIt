import { Body, Controller, Get, NotImplementedException, Param, Put } from "@nestjs/common";
import { UserService } from "../../services/user/user.service";
import { UpdateUserDto } from "../../dtos/update-user.dto";
import { User } from "../../entities/user.entity";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put(":id")
  updateProfile(@Param("id") id: string, @Body() dto: UpdateUserDto): Promise<User> {
    throw new NotImplementedException();
  }

  @Get(":id")
  find(@Param("id") id: string): Promise<User> {
    throw new NotImplementedException();
  }
}
