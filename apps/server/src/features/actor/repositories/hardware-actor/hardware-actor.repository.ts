import { Injectable, NotFoundException } from "@nestjs/common";
import { ConcreteActorRepositoryInterface } from "../interfaces/concrete-actor-repository.interface";
import { HardwareActor } from "../../entities/hardware-actor.entity";
import { CreateActorInterface } from "../../interfaces/create-actor.interface";
import { UpdateActorInterface } from "../../interfaces/update-actor.interface";
import { HardwareActorModel, HardwareActorModelType } from "../../models/hardware-actor.model";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { ActorType } from "../../enums/actor-type.enum";
import { ActorSubtype } from "../../enums/actor-subtype.enum";

@Injectable()
export class HardwareActorRepository implements ConcreteActorRepositoryInterface<HardwareActor> {
  private hardwareActorModel: HardwareActorModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.hardwareActorModel = HardwareActorModel(this.neo4jService.getNeogma());
  }

  async create(createActorInterface: CreateActorInterface): Promise<HardwareActor> {
    try {
      const actor = await this.hardwareActorModel.createOne({
        name: createActorInterface.name,
        type: ActorType.ACTUAL,
        subtype: ActorSubtype.HARDWARE,
        project: {
          where: [{ params: { id: createActorInterface.projectId } }],
        },
      });

      return actor;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to create hardware actor: ${error.message}`);
    }
  }

  async update(
    actorId: string,
    updateActorInterface: UpdateActorInterface,
  ): Promise<HardwareActor[]> {
    try {
      const updated = await this.hardwareActorModel.update(
        { name: updateActorInterface.name },
        {
          where: { id: actorId },
        },
      );

      if (!updated) {
        throw new NotFoundException(`Hardware actor with ID ${actorId} not found`);
      }

      return updated;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to update hardware actor: ${error.message}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const deletedCount = await this.hardwareActorModel.delete({
        where: { id },
        detach: true,
      });

      return deletedCount > 0;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to delete hardware actor: ${error.message}`);
    }
  }

  async getById(id: string): Promise<HardwareActor | null> {
    try {
      const actor = await this.hardwareActorModel.findOne({
        where: { id },
      });

      return actor ?? null;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to retrieve hardware actor: ${error.message}`);
    }
  }

  async getAll(): Promise<HardwareActor[]> {
    try {
      const actors = await this.hardwareActorModel.findMany({});
      return actors;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to retrieve all hardware actors: ${error.message}`);
    }
  }
}
