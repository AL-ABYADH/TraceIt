import { Injectable, NotFoundException } from "@nestjs/common";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { UserModel, UserModelType } from "../../models/user.model";
import { User } from "../../entities/user.entity";
import { CreateUserInterface } from "../../interfaces/create-user.interface";
import { UpdateUserInterface } from "../../interfaces/update-user.interface";
import { plainToInstance } from "class-transformer";

@Injectable()
export class UserRepository {
  private userModel: UserModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.userModel = UserModel(this.neo4jService.getNeogma());
  }

  async create(userData: CreateUserInterface): Promise<User> {
    const newUser = {
      ...userData,
      emailVerified: false,
    };

    const user = await this.userModel.createOne(newUser);
    return this.mapToUserEntity(user.getDataValues());
  }

  async getById(id: string): Promise<User> {
    const user = await this.userModel.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} was not found`);
    }

    return this.mapToUserEntity(user);
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ where: { email } });
    return user ? this.mapToUserEntity(user) : null;
  }

  async getByUsername(username: string): Promise<User | null> {
    const user = await this.userModel.findOne({ where: { username } });
    return user ? this.mapToUserEntity(user) : null;
  }

  async update(id: string, userData: UpdateUserInterface): Promise<User> {
    await this.ensureUserExists(id);
    await this.userModel.update(userData, { where: { id } });
    return this.getById(id);
  }

  async updatePassword(id: string, password: string): Promise<User> {
    await this.ensureUserExists(id);
    await this.userModel.update({ password }, { where: { id } });
    return this.getById(id);
  }

  async setEmailVerified(id: string, verified = true): Promise<User> {
    await this.ensureUserExists(id);
    await this.userModel.update({ emailVerified: verified }, { where: { id } });
    return this.getById(id);
  }

  /**
   * Retrieves a user along with their non-revoked (active) refresh tokens.
   *
   * @param userId - The ID of the user to retrieve.
   * @returns User object including only active refresh tokens, or null if not found.
   */
  async getUserWithActiveRefreshTokens(userId: string): Promise<any> {
    const user = await this.userModel.findOneWithRelations({
      where: { id: userId },
      include: ["refreshTokens"],
    });

    if (!user) return null;

    user.refreshTokens = user.refreshTokens.filter(
      (token) => !token.revoked && new Date(token.expiresAt) > new Date(),
    );

    return user;
  }

  private async ensureUserExists(id: string): Promise<void> {
    const user = await this.userModel.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} was not found`);
    }
  }

  private mapToUserEntity(data: any): User {
    return plainToInstance(User, data);
  }
}
