import { Body, Controller, Get, NotImplementedException, Param, Put } from "@nestjs/common";
import { UserService } from "../../services/user/user.service";
import { UpdateUserDto } from "../../dtos/update-user.dto";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put(":id")
  updateProfile(@Param("id") id: string, @Body() dto: UpdateUserDto) {
    throw new NotImplementedException();
  }

  @Get(":id")
  find(@Param("id") id: string) {
    throw new NotImplementedException();
  }
}
