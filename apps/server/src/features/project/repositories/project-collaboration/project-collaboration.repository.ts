import { Injectable } from "@nestjs/common";
import { ProjectCollaboration } from "../../entities/project-collaboration.entity";
import { CreateProjectCollaborationInterface } from "../../interfaces/create-project-collaboration.interface";
import { UpdateProjectCollaborationInterface } from "../../interfaces/update-project-collaboration.interface";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import {
  ProjectCollaborationAttributes,
  ProjectCollaborationModel,
  ProjectCollaborationModelType,
} from "../../models/project-collaboration.model";
import { Op } from "@repo/custom-neogma";

@Injectable()
export class ProjectCollaborationRepository {
  private projectCollaborationModel: ProjectCollaborationModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.projectCollaborationModel = ProjectCollaborationModel(this.neo4jService.getNeogma());
  }

  async create(
    projectCollaboration: CreateProjectCollaborationInterface,
  ): Promise<ProjectCollaboration> {
    const collaboration: ProjectCollaborationAttributes =
      await this.projectCollaborationModel.createOne({
        user: { where: [{ params: { id: projectCollaboration.userId } }] },
        project: { where: [{ params: { id: projectCollaboration.projectId } }] },
        projectRoles: {
          where: { params: { id: { [Op.in]: projectCollaboration.roleIds } } },
        },
      });
    return this.mapOneToProjectCollaborationEntities(collaboration);
  }

  async getByProject(projectId: string): Promise<ProjectCollaboration[]> {
    const projectCollaborations = await this.projectCollaborationModel.findByRelatedEntity({
      whereRelated: { id: projectId },
      relationshipAlias: "project",
    });

    return this.mapToProjectCollaborationEntities(projectCollaborations);
  }

  async update(
    id: string,
    projectCollaboration: UpdateProjectCollaborationInterface,
  ): Promise<ProjectCollaboration> {
    await this.projectCollaborationModel.deleteRelationships({
      alias: "projectRoles",
      where: {
        source: { id: id },
      },
    });
    for (const roleId of projectCollaboration.roleIds) {
      await this.projectCollaborationModel.relateTo({
        alias: "projectRoles",
        where: {
          source: { id: id },
          target: { id: roleId },
        },
      });
    }
    const updatedCollaboration = await this.projectCollaborationModel.findOneWithRelations({
      where: { id: id },
      include: ["projectRoles"],
    });

    return this.mapOneToProjectCollaborationEntities(updatedCollaboration);
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await this.projectCollaborationModel.delete({
      where: { id },
    });

    return deletedCount > 0;
  }

  /**
   * Transforms raw data into a ProjectCollaboration entity instance.
   */

  private mapOneToProjectCollaborationEntities(item: any): ProjectCollaboration {
    const { createdAt, updatedAt, ...rest } = item ?? {};
    const result: any = { ...rest };

    if (createdAt != null)
      result.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
    if (updatedAt != null)
      result.updatedAt = updatedAt instanceof Date ? updatedAt : new Date(updatedAt);

    return result as ProjectCollaboration;
  }

  private mapToProjectCollaborationEntities(data: any): ProjectCollaboration[] {
    return Array.isArray(data)
      ? data.map((d) => this.mapOneToProjectCollaborationEntities(d))
      : [this.mapOneToProjectCollaborationEntities(data)];
  }
}
