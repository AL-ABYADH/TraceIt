import { Injectable, NotFoundException } from "@nestjs/common";
import { ConcreteActorRepositoryInterface } from "../interfaces/concrete-actor-repository.interface";
import { EventActor } from "../../entities/event-actor.entity";
import { CreateActorInterface } from "../../interfaces/create-actor.interface";
import { UpdateActorInterface } from "../../interfaces/update-actor.interface";
import { EventActorModel, EventActorModelType } from "../../models/event-actor.model";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import ActorType from "../../enums/actor-type.enum";
import ActorSubtype from "../../enums/actor-subtype.enum";

@Injectable()
export class EventActorRepository implements ConcreteActorRepositoryInterface<EventActor> {
  private eventActorModel: EventActorModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.eventActorModel = EventActorModel(this.neo4jService.getNeogma());
  }

  async create(createActorInterface: CreateActorInterface): Promise<EventActor> {
    try {
      const actor = await this.eventActorModel.createOne({
        name: createActorInterface.name,
        type: ActorType.VIRTUAL,
        subtype: ActorSubtype.EVENT,
        project: {
          where: [{ params: { id: createActorInterface.projectId } }],
        },
      });

      return actor;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to create event actor: ${error.message}`);
    }
  }

  async update(actorId: string, updateActorInterface: UpdateActorInterface): Promise<EventActor> {
    try {
      const updated = await this.eventActorModel.updateOneOrThrow(
        { name: updateActorInterface.name },
        {
          where: { id: actorId },
        },
      );

      return updated;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to update event actor: ${error.message}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const deletedCount = await this.eventActorModel.delete({
        where: { id },
        detach: true,
      });

      return deletedCount > 0;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to delete event actor: ${error.message}`);
    }
  }

  async getById(id: string): Promise<EventActor | null> {
    try {
      const actor = await this.eventActorModel.findOne({
        where: { id },
      });

      return actor ?? null;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to retrieve event actor: ${error.message}`);
    }
  }

  async getAll(): Promise<EventActor[]> {
    try {
      const actors = await this.eventActorModel.findMany({});
      return actors;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to retrieve all event actors: ${error.message}`);
    }
  }
}
