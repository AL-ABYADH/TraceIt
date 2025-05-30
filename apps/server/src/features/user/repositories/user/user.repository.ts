import { Injectable, NotImplementedException } from "@nestjs/common";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { UserModel } from "../../models/user.model";
import { User } from "../../entities/user.entity";
import { CreateUserInterface } from "../../interfaces/create-user.interface";
import { UpdateUserInterface } from "../../interfaces/update-user.interface";

@Injectable()
export class UserRepository {
  private userModel: any;

  constructor(private readonly neo4jService: Neo4jService) {
    this.userModel = UserModel(neo4jService.getNeogma());
  }

  async create(user: CreateUserInterface): Promise<User> {
    throw new NotImplementedException();
  }

  async getById(id: string): Promise<User> {
    throw new NotImplementedException();
  }

  async update(id: string, user: UpdateUserInterface): Promise<User> {
    throw new NotImplementedException();
  }

  async updatePassword(password: string): Promise<User> {
    throw new NotImplementedException();
  }

  async setEmailVerified(): Promise<User> {
    throw new NotImplementedException();
  }
}
