import { Injectable } from "@nestjs/common";
import { ActorModel, ActorModelType } from "../../models/actor.model";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { Actor } from "../../entities/actor.entity";
import { ActorSubtype } from "../../enums/actor-subtype.enum";
import { ActorType } from "../../enums/actor-type.enum";

@Injectable()
export class ActorRepository {
  private actorModel: ActorModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.actorModel = ActorModel(this.neo4jService.getNeogma());
  }

  // Get all actors related to a specific project
  async getAllByProject(projectId: string): Promise<Actor[]> {
    try {
      const actors = await this.actorModel.findByRelatedEntity({
        whereRelated: { id: projectId },
        relationshipAlias: "project",
      });

      return actors;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to retrieve actors for the project: ${error.message}`);
    }
  }

  // Get all actors by project and specific subtype
  async getByProjectAndSubtype(projectId: string, subtype: ActorSubtype): Promise<Actor[]> {
    try {
      const actors = await this.actorModel.findByRelatedEntity({
        whereRelated: { id: projectId },
        relationshipAlias: "project",
        where: subtype as unknown as { subtype: ActorSubtype },
      });

      return actors;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to retrieve actors for the project and subtype: ${error.message}`);
    }
  }

  // Get all actors by project and specific type
  async getByProjectAndType(projectId: string, type: ActorType): Promise<Actor[]> {
    try {
      const actors = await this.actorModel.findByRelatedEntity({
        whereRelated: { id: projectId },
        relationshipAlias: "project",
        where: type as unknown as { type: ActorType },
      });

      return actors;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to retrieve actors for the project and type: ${error.message}`);
    }
  }

  // Get an actor by ID
  async getById(id: string): Promise<Actor | null> {
    try {
      const actor = await this.actorModel.findOne({
        where: { id },
      });

      return actor ?? null;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to retrieve actor: ${error.message}`);
    }
  }
}
