import { Injectable, NotImplementedException } from "@nestjs/common";
import { ConcreteUseCaseRepositoryInterface } from "../interfaces/concrete-use-case-repository.interface";
import { SecondaryUseCase } from "../../entities/secondary-use-case.entity";
import {
  SecondaryUseCaseModel,
  SecondaryUseCaseModelType,
} from "../../models/secondary-use-case.model";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { CreateUseCaseInterface } from "../../interfaces/create-use-case.interface";
import { UpdateUseCaseInterface } from "../../interfaces/update-use-case.interface";

@Injectable()
export class SecondaryUseCaseRepository
  implements ConcreteUseCaseRepositoryInterface<SecondaryUseCase>
{
  private secondaryUseCaseModel: SecondaryUseCaseModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.secondaryUseCaseModel = SecondaryUseCaseModel(neo4jService.getNeogma());
  }

  create(createDto: CreateUseCaseInterface): Promise<SecondaryUseCase> {
    throw new NotImplementedException();
  }

  update(updateDto: UpdateUseCaseInterface): Promise<SecondaryUseCase> {
    throw new NotImplementedException();
  }

  delete(id: string): Promise<boolean> {
    throw new NotImplementedException();
  }

  getById(id: string): Promise<SecondaryUseCase | null> {
    throw new NotImplementedException();
  }

  getAll(): Promise<SecondaryUseCase[]> {
    throw new NotImplementedException();
  }
}
