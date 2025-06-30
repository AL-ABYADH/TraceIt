import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { UserRepository } from "../../repositories/user/user.repository";
import { CreateUserInterface } from "../../interfaces/create-user.interface";
import { UpdateUserInterface } from "../../interfaces/update-user.interface";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(userData: CreateUserInterface) {
    const { email, username } = userData;

    const existingEmailUser = await this.userRepository.getByEmail(email);
    if (existingEmailUser) {
      throw new ConflictException(`The email address ${email} is already in use`);
    }

    const existingUsernameUser = await this.userRepository.getByUsername(username);
    if (existingUsernameUser) {
      throw new ConflictException(`The username ${username} is already in use`);
    }

    return this.userRepository.create(userData);
  }

  async find(id: string) {
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string) {
    return (await this.userRepository.getByEmail(email)) ?? null;
  }

  async findByUsername(username: string) {
    return (await this.userRepository.getByUsername(username)) ?? null;
  }

  async updateProfile(id: string, userData: UpdateUserInterface) {
    if (userData.username) {
      const existingUser = await this.userRepository.getByUsername(userData.username);
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException(`The username ${userData.username} is already in use`);
      }
    }

    const updatedUser = await this.userRepository.update(id, userData);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return updatedUser;
  }

  async resetPassword(id: string, password: string) {
    const result = await this.userRepository.updatePassword(id, password);
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return result;
  }

  async verifyEmail(id: string) {
    const result = await this.userRepository.setEmailVerified(id, true);
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return result;
  }
}
