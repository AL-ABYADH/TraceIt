import { Injectable, NotImplementedException } from "@nestjs/common";
import { ConcreteActorRepositoryInterface } from "../interfaces/concrete-actor-repository.interface";
import { HardwareActor } from "../../entities/hardware-actor.entity";
import { CreateActorInterface } from "../../interfaces/create-actor.interface";
import { UpdateActorInterface } from "../../interfaces/update-actor.interface";
import { HardwareActorModel, HardwareActorModelType } from "../../models/hardware-actor.model";
import { Neo4jService } from "src/core/neo4j/neo4j.service";

@Injectable()
export class HardwareActorRepository implements ConcreteActorRepositoryInterface<HardwareActor> {
  private hardwareActorModel: HardwareActorModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.hardwareActorModel = HardwareActorModel(neo4jService.getNeogma());
  }

  create(createActorInterface: CreateActorInterface): Promise<HardwareActor> {
    throw new NotImplementedException();
  }

  update(updateActorInterface: UpdateActorInterface): Promise<HardwareActor> {
    throw new NotImplementedException();
  }

  delete(id: string): Promise<boolean> {
    throw new NotImplementedException();
  }

  getById(id: string): Promise<HardwareActor | null> {
    throw new NotImplementedException();
  }

  getAll(): Promise<HardwareActor[]> {
    throw new NotImplementedException();
  }
}
