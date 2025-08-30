import { Injectable, NotImplementedException } from "@nestjs/common";
import { ConcreteUseCaseRepositoryInterface } from "../interfaces/concrete-use-case-repository.interface";
import { PrimaryUseCase } from "../../entities/primary-use-case.entity";
import { PrimaryUseCaseModel, PrimaryUseCaseModelType } from "../../models/primary-use-case.model";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { CreateUseCaseInterface } from "../../interfaces/create-use-case.interface";
import { UpdateUseCaseInterface } from "../../interfaces/update-use-case.interface";

@Injectable()
export class PrimaryUseCaseRepository
  implements ConcreteUseCaseRepositoryInterface<PrimaryUseCase>
{
  private primaryUseCaseModel: PrimaryUseCaseModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.primaryUseCaseModel = PrimaryUseCaseModel(neo4jService.getNeogma());
  }

  create(createDto: CreateUseCaseInterface): Promise<PrimaryUseCase> {
    throw new NotImplementedException();
  }

  update(updateDto: UpdateUseCaseInterface): Promise<PrimaryUseCase> {
    throw new NotImplementedException();
  }

  delete(id: string): Promise<boolean> {
    throw new NotImplementedException();
  }

  getById(id: string): Promise<PrimaryUseCase | null> {
    throw new NotImplementedException();
  }

  getAll(): Promise<PrimaryUseCase[]> {
    throw new NotImplementedException();
  }
}
