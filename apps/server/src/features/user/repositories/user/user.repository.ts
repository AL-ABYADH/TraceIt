import { Injectable, NotFoundException } from "@nestjs/common";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { UserModel, UserModelType } from "../../models/user.model";
import { User } from "../../entities/user.entity";
import { CreateUserInterface } from "../../interfaces/create-user.interface";
import { UpdateUserInterface } from "../../interfaces/update-user.interface";

@Injectable()
export class UserRepository {
  private userModel: UserModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.userModel = UserModel(this.neo4jService.getNeogma());
  }

  async create(userData: CreateUserInterface): Promise<User> {
    const user = await this.userModel.createOne({ ...userData, emailVerified: false });
    return {
      ...user,
      createdAt: new Date(user.createdAt),
    };
  }

  async getById(id: string): Promise<User | null> {
    const user = await this.userModel.findOne({ where: { id } });
    return user != null
      ? {
          ...user,
          createdAt: new Date(user.createdAt),
        }
      : null;
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ where: { email } });
    return user != null
      ? {
          ...user,
          createdAt: new Date(user.createdAt),
        }
      : null;
  }

  async getByUsername(username: string): Promise<User | null> {
    const user = await this.userModel.findOne({ where: { username } });
    return user != null
      ? {
          ...user,
          createdAt: new Date(user.createdAt),
        }
      : null;
  }

  async update(id: string, userData: UpdateUserInterface): Promise<User | null> {
    const user = (await this.userModel.update(userData, { where: { id }, return: true }))[0][0];
    return user != null
      ? {
          ...user,
          createdAt: new Date(user.createdAt),
        }
      : null;
  }

  async updatePassword(id: string, password: string): Promise<User | null> {
    const user = (await this.userModel.update({ password }, { where: { id }, return: true }))[0][0];
    return user != null
      ? {
          ...user,
          createdAt: new Date(user.createdAt),
        }
      : null;
  }

  async setEmailVerified(id: string, verified = true): Promise<User | null> {
    const user = (
      await this.userModel.update({ emailVerified: verified }, { where: { id }, return: true })
    )[0][0];
    return user != null
      ? {
          ...user,
          createdAt: new Date(user.createdAt),
        }
      : null;
  }

  /**
   * Retrieves a user along with their non-revoked (active) refresh tokens.
   *
   * @param userId - The ID of the user to retrieve.
   * @returns User object including only active refresh tokens, or null if not found.
   */
  async getUserWithActiveRefreshTokens(userId: string): Promise<User | null> {
    const user = await this.userModel.findOneWithRelations({
      where: { id: userId },
      include: ["refreshTokens"],
    });

    if (!user) return null;

    user.refreshTokens = user.refreshTokens.filter(
      (token) => !token.revoked && new Date(token.expiresAt) > new Date(),
    );

    return user != null
      ? {
          ...user,
          createdAt: new Date(user.createdAt),
        }
      : null;
  }
}
