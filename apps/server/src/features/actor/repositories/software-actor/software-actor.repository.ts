import { Injectable, NotImplementedException } from "@nestjs/common";
import { ConcreteActorRepositoryInterface } from "../interfaces/concrete-actor-repository.interface";
import { SoftwareActor } from "../../entities/software-actor.entity";
import { CreateActorInterface } from "../../interfaces/create-actor.interface";
import { UpdateActorInterface } from "../../interfaces/update-actor.interface";
import { SoftwareActorModel, SoftwareActorModelType } from "../../models/software-actor.model";
import { Neo4jService } from "src/core/neo4j/neo4j.service";

@Injectable()
export class SoftwareActorRepository implements ConcreteActorRepositoryInterface<SoftwareActor> {
  private softwareActorModel: SoftwareActorModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.softwareActorModel = SoftwareActorModel(neo4jService.getNeogma());
  }

  create(createActorInterface: CreateActorInterface): Promise<SoftwareActor> {
    throw new NotImplementedException();
  }

  update(updateActorInterface: UpdateActorInterface): Promise<SoftwareActor> {
    throw new NotImplementedException();
  }

  delete(id: string): Promise<boolean> {
    throw new NotImplementedException();
  }

  getById(id: string): Promise<SoftwareActor | null> {
    throw new NotImplementedException();
  }

  getAll(): Promise<SoftwareActor[]> {
    throw new NotImplementedException();
  }
}
