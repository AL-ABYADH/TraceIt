import { Injectable } from "@nestjs/common";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { UserModel, UserModelType } from "../../models/user.model";
import { CreateUserInterface } from "../../interfaces/create-user.interface";
import { UpdateUserInterface } from "../../interfaces/update-user.interface";
import { User } from "../../entities/user.entity";

@Injectable()
export class UserRepository {
  private userModel: UserModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.userModel = UserModel(this.neo4jService.getNeogma());
  }

  async create(userData: CreateUserInterface): Promise<User> {
    const user = await this.userModel.createOne({ ...userData, emailVerified: false });
    return user;
  }

  async getById(id: string): Promise<User | null> {
    const user = await this.userModel.findOne({ where: { id } });
    return user;
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ where: { email } });
    return user;
  }

  async getByUsername(username: string): Promise<User | null> {
    const user = await this.userModel.findOne({ where: { username } });
    return user;
  }

  async update(id: string, userData: UpdateUserInterface): Promise<User> {
    const user = await this.userModel.updateOneOrThrow(userData, { where: { id }, return: true });
    return user;
  }

  async updatePassword(id: string, password: string): Promise<User> {
    const user = await this.userModel.updateOneOrThrow(
      { password: password },
      { where: { id }, return: true },
    );
    return user;
  }

  async setEmailVerified(id: string, verified: boolean = true): Promise<User> {
    const user = await this.userModel.updateOneOrThrow(
      { emailVerified: verified },
      { where: { id }, return: true },
    );
    return user;
  }
}
