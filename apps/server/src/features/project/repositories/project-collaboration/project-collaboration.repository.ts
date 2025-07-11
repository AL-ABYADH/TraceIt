import { Injectable } from "@nestjs/common";
import { ProjectCollaboration } from "../../entities/project-collaboration.entity";
import { CreateProjectCollaborationInterface } from "../../interfaces/create-project-collaboration.interface";
import { UpdateProjectCollaborationInterface } from "../../interfaces/update-project-collaboration.interface";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { ProjectCollaborationModel } from "../../models/project-collaboration.model";
import { plainToInstance } from "class-transformer";

@Injectable()
export class ProjectCollaborationRepository {
  private projectCollaborationModel: any;

  constructor(private readonly neo4jService: Neo4jService) {
    this.projectCollaborationModel = ProjectCollaborationModel(neo4jService.getNeogma());
  }

  async create(
    projectCollaboration: CreateProjectCollaborationInterface,
  ): Promise<ProjectCollaboration> {
    const newProjectCollaboration = {
      ...projectCollaboration,
    };

    const collaboration = await this.projectCollaborationModel.createOne(newProjectCollaboration);
    return plainToInstance(ProjectCollaboration, collaboration.getDataValues());
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

    return projectCollaborations.map((collaboration) =>
      plainToInstance(ProjectCollaboration, collaboration.getDataValues()),
    );
  }

  async update(
    id: string,
    projectCollaboration: UpdateProjectCollaborationInterface,
  ): Promise<ProjectCollaboration> {
    const [updatedCollaboration] = await this.projectCollaborationModel.update(
      {
        id,
      },
      projectCollaboration,
    );

    return plainToInstance(ProjectCollaboration, updatedCollaboration.getDataValues());
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await this.projectCollaborationModel.delete({
      where: { id },
    });

    return deletedCount > 0;
  }
}
