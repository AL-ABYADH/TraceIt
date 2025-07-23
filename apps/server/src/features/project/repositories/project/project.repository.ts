import { Injectable } from "@nestjs/common";
import { Project } from "../../entities/project.entity";
import { CreateProjectInterface } from "../../interfaces/create-project.interface";
import { UpdateProjectInterface } from "../../interfaces/update-project.interface";
import { ProjectStatus } from "../../enums/project-status.enum";
import { ProjectModel } from "../../models/project.model";
import { Neo4jService } from "src/core/neo4j/neo4j.service";

@Injectable()
export class ProjectRepository {
  private projectModel: any;

  constructor(private readonly neo4jService: Neo4jService) {
    this.projectModel = ProjectModel(neo4jService.getNeogma());
  }

  async create(projectData: CreateProjectInterface): Promise<Project> {
    const project = await this.projectModel.createOne({ ...projectData });
    return { ...project, createdAt: new Date(project.createdAt) };
  }

  async getById(id: string): Promise<Project | null> {
    const project = await this.projectModel.findOne({ where: { id } });

    return project != null ? { ...project, createdAt: new Date(project.createdAt) } : null;
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

    return projects.map((project) => ({ ...project, createdAt: new Date(project.createdAt) }));
  }

  async update(id: string, project: UpdateProjectInterface): Promise<Project> {
    const updatedProject = await this.projectModel.update(project, {
      where: { id },
      return: true,
    })[0][0];

    return {
      ...updatedProject,
      createdAt: new Date(updatedProject.createdAt),
    };
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
