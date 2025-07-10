import { Injectable, NotImplementedException } from "@nestjs/common";
import { ConcreteActorRepositoryInterface } from "../interfaces/concrete-actor-repository.interface";
import { HumanActor } from "../../entities/human-actor.entity";
import { CreateActorInterface } from "../../interfaces/create-actor.interface";
import { UpdateActorInterface } from "../../interfaces/update-actor.interface";
import { HumanActorModel, HumanActorModelType } from "../../models/human-actor.model";
import { Neo4jService } from "src/core/neo4j/neo4j.service";

@Injectable()
export class HumanActorRepository implements ConcreteActorRepositoryInterface<HumanActor> {
  private humanActorModel: HumanActorModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.humanActorModel = HumanActorModel(neo4jService.getNeogma());
  }

  create(createActorInterface: CreateActorInterface): Promise<HumanActor> {
    throw new NotImplementedException();
  }

  update(updateActorInterface: UpdateActorInterface): Promise<HumanActor> {
    throw new NotImplementedException();
  }

  delete(id: string): Promise<boolean> {
    throw new NotImplementedException();
  }

  getById(id: string): Promise<HumanActor | null> {
    throw new NotImplementedException();
  }

  getAll(): Promise<HumanActor[]> {
    throw new NotImplementedException();
  }
}
