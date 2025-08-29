import { Injectable, NotFoundException } from "@nestjs/common";
import { ConcreteActorRepositoryInterface } from "../interfaces/concrete-actor-repository.interface";
import { AiAgentActor } from "../../entities/ai-agent-actor.entity";
import { CreateActorInterface } from "../../interfaces/create-actor.interface";
import { UpdateActorInterface } from "../../interfaces/update-actor.interface";
import { AiAgentActorModel, AiAgentActorModelType } from "../../models/ai-agent-actor.model";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { ActorType } from "../../enums/actor-type.enum";
import { ActorSubtype } from "../../enums/actor-subtype.enum";

@Injectable()
export class AiAgentActorRepository implements ConcreteActorRepositoryInterface<AiAgentActor> {
  private aiAgentActorModel: AiAgentActorModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.aiAgentActorModel = AiAgentActorModel(this.neo4jService.getNeogma());
  }

  async create(createActorInterface: CreateActorInterface): Promise<AiAgentActor> {
    try {
      const actor = await this.aiAgentActorModel.createOne({
        name: createActorInterface.name,
        type: ActorType.VIRTUAL,
        subtype: ActorSubtype.AI_AGENT,
        project: {
          where: [{ params: { id: createActorInterface.projectId } }],
        },
      });

      return this.mapToAiAgentActorEntity(actor);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to create AI agent actor: ${error.message}`);
    }
  }

  async update(actorId: string, updateActorInterface: UpdateActorInterface): Promise<AiAgentActor> {
    try {
      const updated = await this.aiAgentActorModel.update(
        { name: updateActorInterface.name },
        {
          where: { id: actorId },
        },
      );

      if (!updated) {
        throw new NotFoundException(`AI agent actor with ID ${actorId} not found`);
      }

      return this.mapToAiAgentActorEntity(updated[0]);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to update AI agent actor: ${error.message}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const deletedCount = await this.aiAgentActorModel.delete({
        where: { id },
        detach: true,
      });

      return deletedCount > 0;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to delete AI agent actor: ${error.message}`);
    }
  }

  async getById(id: string): Promise<AiAgentActor | null> {
    try {
      const actor = await this.aiAgentActorModel.findOne({
        where: { id },
      });

      return actor ? this.mapToAiAgentActorEntity(actor) : null;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to retrieve AI agent actor: ${error.message}`);
    }
  }

  async getAll(): Promise<AiAgentActor[]> {
    try {
      const actors = await this.aiAgentActorModel.findMany({});
      return actors.map((actor) => this.mapToAiAgentActorEntity(actor));
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to retrieve all AI agent actors: ${error.message}`);
    }
  }

  private mapToAiAgentActorEntity(data: any): AiAgentActor {
    const actor = new AiAgentActor();

    // Map base properties
    actor.id = data.id;
    actor.name = data.name;
    actor.type = data.type || ActorType.VIRTUAL;
    actor.subtype = data.subtype || ActorSubtype.AI_AGENT;
    actor.project = data.project;
    actor.createdAt = new Date(data.createdAt);

    // Only add updatedAt if it exists in the data
    if (data.updatedAt) {
      actor.updatedAt = new Date(data.updatedAt);
    }

    return actor;
  }
}
