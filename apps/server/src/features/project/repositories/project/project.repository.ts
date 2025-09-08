import { Injectable } from "@nestjs/common";
import { Project } from "../../entities/project.entity";
import { CreateProjectInterface } from "../../interfaces/create-project.interface";
import { UpdateProjectInterface } from "../../interfaces/update-project.interface";
import { ProjectStatus } from "../../enums/project-status.enum";
import { ProjectModel, ProjectModelType } from "../../models/project.model";
import { Neo4jService } from "src/core/neo4j/neo4j.service";

@Injectable()
export class ProjectRepository {
  projectModel: ProjectModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.projectModel = ProjectModel(this.neo4jService.getNeogma());
  }

  async create(projectData: CreateProjectInterface): Promise<Project> {
    const project = await this.projectModel.createOne({
      name: projectData.name,
      description: projectData.description,
      status: ProjectStatus.ACTIVE,
      owner: {
        where: [{ params: { id: projectData.ownerId } }],
      },
    });
    return this.mapToProjectEntity(project);
  }

  async getById(id: string): Promise<Project | null> {
    const project = await this.projectModel.findOneWithRelations({ where: { id: id } });
    if (!project) {
      return null;
    }

    return this.mapToProjectEntity(project);
  }

  async update(id: string, project: UpdateProjectInterface): Promise<any> {
    const updatedProject = await this.projectModel.update(project, {
      where: { id },
      return: true,
    });
    console.log(updatedProject);
    return updatedProject;
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await this.projectModel.delete({
      detach: true,
      where: { id },
    });

    return deletedCount > 0;
  }

  async setStatus(id: string, status: ProjectStatus): Promise<boolean> {
    const updated = await this.projectModel.update(
      { status: status },
      {
        where: { id },
      },
    );

    return updated.length > 0;
  }

  async getProjects(userId: string, status?: ProjectStatus): Promise<Project[]> {
    const projects = await this.projectModel.findByRelatedEntity({
      whereRelated: { id: userId },
      relationshipAlias: "owner",
      where: status ? (status as unknown as { status: ProjectStatus }) : {},
    });
    return this.mapListToProjectEntity(projects);
  }

  /**
   * Transforms raw data into a Project entity instance.
   */
  private mapToProjectEntity(data: any): Project {
    const entity = {
      ...data,
      createdAt: new Date(data.createdAt),
    } as Project;

    if (data.hasOwnProperty("updatedAt")) {
      entity.updatedAt = new Date(data.updatedAt);
    }
    return entity;
  }

  /**
   * Transforms raw data into a Project entity instance.
   */
  private mapListToProjectEntity(data: any): Project[] {
    const items: Project[] = [];
    for (const item of data) {
      items.push(this.mapToProjectEntity(item));
    }
    return items;
  }
}
