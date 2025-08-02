import { Injectable, NotImplementedException } from "@nestjs/common";
import { ConcreteUseCaseRepositoryInterface } from "../interfaces/concrete-use-case-repository.interface";
import { UseCaseDescription } from "../../entities/use-case-description.entity";
import {
  UseCaseDescriptionModel,
  UseCaseDescriptionModelType,
} from "../../models/use-case-description.model";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { CreateUseCaseInterface } from "../../interfaces/create-use-case.interface";
import { UpdateUseCaseInterface } from "../../interfaces/update-use-case.interface";

@Injectable()
export class UseCaseDescriptionRepository
  implements ConcreteUseCaseRepositoryInterface<UseCaseDescription>
{
  private descriptionModel: UseCaseDescriptionModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.descriptionModel = UseCaseDescriptionModel(neo4jService.getNeogma());
  }

  create(createDto: CreateUseCaseInterface): Promise<UseCaseDescription> {
    throw new NotImplementedException();
  }

  update(updateDto: UpdateUseCaseInterface): Promise<UseCaseDescription> {
    throw new NotImplementedException();
  }

  delete(id: string): Promise<boolean> {
    throw new NotImplementedException();
  }

  getById(id: string): Promise<UseCaseDescription | null> {
    throw new NotImplementedException();
  }

  getAll(): Promise<UseCaseDescription[]> {
    throw new NotImplementedException();
  }
}
