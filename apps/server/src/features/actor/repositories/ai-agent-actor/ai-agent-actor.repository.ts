import { Injectable, NotImplementedException } from "@nestjs/common";
import { ConcreteActorRepositoryInterface } from "../interfaces/concrete-actor-repository.interface";
import { AiAgentActor } from "../../entities/ai-agent-actor.entity";
import { CreateActorInterface } from "../../interfaces/create-actor.interface";
import { UpdateActorInterface } from "../../interfaces/update-actor.interface";
import { AiAgentActorModel, AiAgentActorModelType } from "../../models/ai-agent-actor.model";
import { Neo4jService } from "src/core/neo4j/neo4j.service";

@Injectable()
export class AiAgentActorRepository implements ConcreteActorRepositoryInterface<AiAgentActor> {
  private aiAgentActorModel: AiAgentActorModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.aiAgentActorModel = AiAgentActorModel(neo4jService.getNeogma());
  }

  create(createActorInterface: CreateActorInterface): Promise<AiAgentActor> {
    throw new NotImplementedException();
  }

  update(updateActorInterface: UpdateActorInterface): Promise<AiAgentActor> {
    throw new NotImplementedException();
  }

  delete(id: string): Promise<boolean> {
    throw new NotImplementedException();
  }

  getById(id: string): Promise<AiAgentActor | null> {
    throw new NotImplementedException();
  }

  getAll(): Promise<AiAgentActor[]> {
    throw new NotImplementedException();
  }
}
