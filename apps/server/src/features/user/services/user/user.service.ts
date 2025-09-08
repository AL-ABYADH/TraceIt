import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { UserRepository } from "../../repositories/user/user.repository";
import { CreateUserInterface } from "../../interfaces/create-user.interface";
import { UpdateUserInterface } from "../../interfaces/update-user.interface";
import { User } from "../../entities/user.entity";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(userData: CreateUserInterface): Promise<User> {
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

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return (await this.userRepository.getByEmail(email)) ?? null;
  }

  async findByUsername(username: string): Promise<User | null> {
    return (await this.userRepository.getByUsername(username)) ?? null;
  }

  async updateProfile(id: string, userData: UpdateUserInterface): Promise<User[]> {
    await this.findById(id);

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

  async resetPassword(id: string, password: string): Promise<User[]> {
    await this.findById(id);
    const user = await this.userRepository.updatePassword(id, password);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async verifyEmail(id: string): Promise<User[]> {
    await this.findById(id);
    const user = await this.userRepository.setEmailVerified(id, true);
    return user;
  }
}
