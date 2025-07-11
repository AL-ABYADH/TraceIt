import { Injectable } from "@nestjs/common";
import { Project } from "../../entities/project.entity";
import { CreateProjectInterface } from "../../interfaces/create-project.interface";
import { UpdateProjectInterface } from "../../interfaces/update-project.interface";
import { ProjectStatus } from "../../enums/project-status.enum";
import { ProjectModel } from "../../models/project.model";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { plainToInstance } from "class-transformer";

@Injectable()
export class ProjectRepository {
  private projectModel: any;

  constructor(private readonly neo4jService: Neo4jService) {
    this.projectModel = ProjectModel(neo4jService.getNeogma());
  }

  async create(projectData: CreateProjectInterface): Promise<Project> {
    const newProject = {
      ...projectData,
    };

    const project = await this.projectModel.createOne(newProject);
    return plainToInstance(Project, project.getDataValues());
  }

  async getById(id: string): Promise<Project> {
    const project = await this.projectModel.findOne({ where: { id } });

    return plainToInstance(Project, project.getDataValues());
  }

  async getByOwnerOrCollaboration(userId: string, status: ProjectStatus): Promise<Project[]> {
    const projects = await this.projectModel.find({
      where: {
        status,
      },
      or: [
        {
          whereRelated: {
            owner: {
              where: {
                id: userId,
              },
            },
          },
        },
        {
          whereRelated: {
            collaborations: {
              whereRelated: {
                user: {
                  where: {
                    id: userId,
                  },
                },
              },
            },
          },
        },
      ],
    });

    return projects.map((project) => plainToInstance(Project, project.getDataValues()));
  }

  async update(id: string, project: UpdateProjectInterface): Promise<Project> {
    const [updatedProject] = await this.projectModel.update(
      {
        id,
      },
      project,
    );

    return plainToInstance(Project, updatedProject.getDataValues());
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await this.projectModel.delete({
      where: { id },
    });

    return deletedCount > 0;
  }

  async setStatus(id: string, status: ProjectStatus): Promise<boolean> {
    const updated = await this.projectModel.update({ id }, { status: status });

    return updated.length > 0;
  }
}
