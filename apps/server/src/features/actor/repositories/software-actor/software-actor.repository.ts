import { Injectable, NotFoundException } from "@nestjs/common";
import { ConcreteActorRepositoryInterface } from "../interfaces/concrete-actor-repository.interface";
import { SoftwareActor } from "../../entities/software-actor.entity";
import { CreateActorInterface } from "../../interfaces/create-actor.interface";
import { UpdateActorInterface } from "../../interfaces/update-actor.interface";
import { SoftwareActorModel, SoftwareActorModelType } from "../../models/software-actor.model";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { ActorType } from "../../enums/actor-type.enum";
import { ActorSubtype } from "../../enums/actor-subtype.enum";

@Injectable()
export class SoftwareActorRepository implements ConcreteActorRepositoryInterface<SoftwareActor> {
  private softwareActorModel: SoftwareActorModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.softwareActorModel = SoftwareActorModel(this.neo4jService.getNeogma());
  }

  async create(createActorInterface: CreateActorInterface): Promise<SoftwareActor> {
    try {
      const actor = await this.softwareActorModel.createOne({
        name: createActorInterface.name,
        type: ActorType.VIRTUAL,
        subtype: ActorSubtype.SOFTWARE,
        project: {
          where: [{ params: { id: createActorInterface.projectId } }],
        },
      });

      return actor;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to create software actor: ${error.message}`);
    }
  }

  async update(
    actorId: string,
    updateActorInterface: UpdateActorInterface,
  ): Promise<SoftwareActor> {
    try {
      const updated = await this.softwareActorModel.updateOneOrThrow(
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
      throw new Error(`Failed to update software actor: ${error.message}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const deletedCount = await this.softwareActorModel.delete({
        where: { id },
        detach: true,
      });

      return deletedCount > 0;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to delete software actor: ${error.message}`);
    }
  }

  async getById(id: string): Promise<SoftwareActor | null> {
    try {
      const actor = await this.softwareActorModel.findOne({
        where: { id },
      });

      return actor ?? null;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to retrieve software actor: ${error.message}`);
    }
  }

  async getAll(): Promise<SoftwareActor[]> {
    try {
      const actors = await this.softwareActorModel.findMany({});
      return actors;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to retrieve all software actors: ${error.message}`);
    }
  }
}
