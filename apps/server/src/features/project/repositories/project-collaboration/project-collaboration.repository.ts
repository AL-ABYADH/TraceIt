import { Injectable } from "@nestjs/common";
import { ProjectCollaboration } from "../../entities/project-collaboration.entity";
import { CreateProjectCollaborationInterface } from "../../interfaces/create-project-collaboration.interface";
import { UpdateProjectCollaborationInterface } from "../../interfaces/update-project-collaboration.interface";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { ProjectCollaborationModel } from "../../models/project-collaboration.model";

@Injectable()
export class ProjectCollaborationRepository {
  private projectCollaborationModel: any;

  constructor(private readonly neo4jService: Neo4jService) {
    this.projectCollaborationModel = ProjectCollaborationModel(neo4jService.getNeogma());
  }

  async create(
    projectCollaboration: CreateProjectCollaborationInterface,
  ): Promise<ProjectCollaboration> {
    const collaboration = await this.projectCollaborationModel.createOne({
      ...projectCollaboration,
    });
    return { ...collaboration, createdAt: new Date(collaboration.createdAt) };
  }

  async getByProject(projectId: string): Promise<ProjectCollaboration[]> {
    const projectCollaborations = await this.projectCollaborationModel.find({
      whereRelated: {
        project: {
          where: {
            id: projectId,
          },
        },
      },
    });

    return projectCollaborations.map((collaboration) => ({
      ...collaboration,
      createdAt: new Date(collaboration.createdAt),
    }));
  }

  async update(
    id: string,
    projectCollaboration: UpdateProjectCollaborationInterface,
  ): Promise<ProjectCollaboration> {
    const updatedCollaboration = await this.projectCollaborationModel.update(projectCollaboration, {
      where: { id },
      return: true,
    })[0][0];

    return {
      ...updatedCollaboration,
      createdAt: new Date(updatedCollaboration.createdAt),
    };
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await this.projectCollaborationModel.delete({
      where: { id },
    });

    return deletedCount > 0;
  }
}
