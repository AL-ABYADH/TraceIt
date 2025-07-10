import { Injectable, NotImplementedException } from "@nestjs/common";
import { ConcreteActorRepositoryInterface } from "../interfaces/concrete-actor-repository.interface";
import { EventActor } from "../../entities/event-actor.entity";
import { CreateActorInterface } from "../../interfaces/create-actor.interface";
import { UpdateActorInterface } from "../../interfaces/update-actor.interface";
import { EventActorModel, EventActorModelType } from "../../models/event-actor.model";
import { Neo4jService } from "src/core/neo4j/neo4j.service";

@Injectable()
export class EventActorRepository implements ConcreteActorRepositoryInterface<EventActor> {
  private eventActorModel: EventActorModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.eventActorModel = EventActorModel(neo4jService.getNeogma());
  }

  create(createActorInterface: CreateActorInterface): Promise<EventActor> {
    throw new NotImplementedException();
  }

  update(updateActorInterface: UpdateActorInterface): Promise<EventActor> {
    throw new NotImplementedException();
  }

  delete(id: string): Promise<boolean> {
    throw new NotImplementedException();
  }

  getById(id: string): Promise<EventActor | null> {
    throw new NotImplementedException();
  }

  getAll(): Promise<EventActor[]> {
    throw new NotImplementedException();
  }
}
