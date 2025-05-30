import { Module } from "@nestjs/common";
import { UserService } from "./services/user/user.service";
import { UserController } from "./controllers/user/user.controller";
import { UserRepository } from "./repositories/user/user.repository";

@Module({
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
