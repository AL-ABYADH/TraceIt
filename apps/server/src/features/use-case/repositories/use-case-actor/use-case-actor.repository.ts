import { Injectable, NotImplementedException } from "@nestjs/common";
import { ConcreteUseCaseRepositoryInterface } from "../interfaces/concrete-use-case-repository.interface";
import { UseCaseActor } from "../../entities/use-case-actor.entity";
import { UseCaseActorModel, UseCaseActorModelType } from "../../models/use-case-actor.model";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { CreateUseCaseInterface } from "../../interfaces/create-use-case.interface";
import { UpdateUseCaseInterface } from "../../interfaces/update-use-case.interface";

@Injectable()
export class UseCaseActorRepository implements ConcreteUseCaseRepositoryInterface<UseCaseActor> {
  private useCaseActorModel: UseCaseActorModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.useCaseActorModel = UseCaseActorModel(neo4jService.getNeogma());
  }

  create(createDto: CreateUseCaseInterface): Promise<UseCaseActor> {
    throw new NotImplementedException();
  }

  update(updateDto: UpdateUseCaseInterface): Promise<UseCaseActor> {
    throw new NotImplementedException();
  }

  delete(id: string): Promise<boolean> {
    throw new NotImplementedException();
  }

  getById(id: string): Promise<UseCaseActor | null> {
    throw new NotImplementedException();
  }

  getAll(): Promise<UseCaseActor[]> {
    throw new NotImplementedException();
  }
}
