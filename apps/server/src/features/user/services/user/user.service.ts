import { Injectable, NotImplementedException } from "@nestjs/common";
import { UserRepository } from "../../repositories/user/user.repository";
import { CreateUserInterface } from "../../interfaces/create-user.interface";
import { User } from "../../entities/user.entity";
import { UpdateUserInterface } from "../../interfaces/update-user.interface";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(user: CreateUserInterface): Promise<User> {
    throw new NotImplementedException();
  }

  async find(id: string): Promise<User> {
    throw new NotImplementedException();
  }

  async findByEmail(email: string): Promise<User> {
    throw new NotImplementedException();
  }

  async findByUsername(username: string): Promise<User> {
    throw new NotImplementedException();
  }

  async updateProfile(id: string, user: UpdateUserInterface): Promise<User> {
    throw new NotImplementedException();
  }

  async resetPassword(password: string): Promise<User> {
    throw new NotImplementedException();
  }

  async verifyEmail(): Promise<User> {
    throw new NotImplementedException();
  }
}
