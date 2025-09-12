import { Injectable, NotFoundException } from "@nestjs/common";
import { ConcreteActorRepositoryInterface } from "../interfaces/concrete-actor-repository.interface";
import { HumanActor } from "../../entities/human-actor.entity";
import { CreateActorInterface } from "../../interfaces/create-actor.interface";
import { UpdateActorInterface } from "../../interfaces/update-actor.interface";
import { HumanActorModel, HumanActorModelType } from "../../models/human-actor.model";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { ActorType } from "../../enums/actor-type.enum";
import { ActorSubtype } from "../../enums/actor-subtype.enum";

@Injectable()
export class HumanActorRepository implements ConcreteActorRepositoryInterface<HumanActor> {
  private humanActorModel: HumanActorModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.humanActorModel = HumanActorModel(this.neo4jService.getNeogma());
  }

  async create(createActorInterface: CreateActorInterface): Promise<HumanActor> {
    try {
      const actor = await this.humanActorModel.createOne({
        name: createActorInterface.name,
        type: ActorType.ACTUAL,
        subtype: ActorSubtype.HUMAN,
        project: {
          where: [{ params: { id: createActorInterface.projectId } }],
        },
      });

      return actor;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to create human actor: ${error.message}`);
    }
  }

  async update(actorId: string, updateActorInterface: UpdateActorInterface): Promise<HumanActor[]> {
    try {
      const updated = await this.humanActorModel.update(
        { name: updateActorInterface.name },
        {
          where: { id: actorId },
        },
      );

      if (!updated) {
        throw new NotFoundException(`Human actor with ID ${actorId} not found`);
      }

      return updated;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to update human actor: ${error.message}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const deletedCount = await this.humanActorModel.delete({
        where: { id },
        detach: true,
      });

      return deletedCount > 0;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to delete human actor: ${error.message}`);
    }
  }

  async getById(id: string): Promise<HumanActor | null> {
    try {
      const actor = await this.humanActorModel.findOne({
        where: { id },
      });

      return actor ?? null;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to retrieve human actor: ${error.message}`);
    }
  }

  async getAll(): Promise<HumanActor[]> {
    try {
      const actors = await this.humanActorModel.findMany({});
      return actors;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to retrieve all human actors: ${error.message}`);
    }
  }
}
