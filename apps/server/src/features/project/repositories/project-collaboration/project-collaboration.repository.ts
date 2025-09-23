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
    return collaboration;
  }

  async getByProject(projectId: string): Promise<ProjectCollaboration[]> {
    const projectCollaborations = await this.projectCollaborationModel.findByRelatedEntity({
      whereRelated: { id: projectId },
      relationshipAlias: "project",
    });

    return projectCollaborations;
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

    if (!updatedCollaboration) {
      throw new Error(`ProjectCollaboration with ID ${id} not found`);
    }

    return updatedCollaboration;
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await this.projectCollaborationModel.delete({
      where: { id },
    });

    return deletedCount > 0;
  }
}
