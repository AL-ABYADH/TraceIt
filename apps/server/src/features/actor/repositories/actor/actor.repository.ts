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

      return this.mapToActorEntities(actors);
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
        where: { subtype },
      });

      return this.mapToActorEntities(actors);
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
        where: { type },
      });

      return this.mapToActorEntities(actors);
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

      return actor ? this.mapToActorEntity(actor) : null;
    } catch (error) {
      throw new Error(`Failed to retrieve actor: ${error.message}`);
    }
  }

  // Map database results to Actor entities
  private mapToActorEntities(data: any[]): Actor[] {
    if (!data || !Array.isArray(data)) return [];
    return data.map((item) => this.mapToActorEntity(item));
  }

  private mapToActorEntity(data: any): Actor {
    if (!data) {
      throw new Error("Invalid actor data");
    }

    const actor = { ...data } as Actor;
    actor.id = data.id;
    actor.name = data.name;
    actor.type = data.type;
    actor.subtype = data.subtype;
    actor.project = data.project;
    actor.createdAt = new Date(data.createdAt);

    if (data.updatedAt) {
      actor.updatedAt = new Date(data.updatedAt);
    }

    return actor;
  }
}
