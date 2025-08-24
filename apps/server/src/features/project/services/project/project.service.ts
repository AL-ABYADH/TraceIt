import { Injectable, NotFoundException } from "@nestjs/common";
import { ProjectRepository } from "../../repositories/project/project.repository";
import { Project } from "../../entities/project.entity";
import { UpdateProjectInterface } from "../../interfaces/update-project.interface";
import { ProjectStatus } from "../../enums/project-status.enum";
import { CreateProjectInterface } from "../../interfaces/create-project.interface";

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async create(project: { name: string; description?: string; userId: string }): Promise<Project> {
    const newProject: CreateProjectInterface = {
      name: project.name,
      description: project.description,
      ownerId: project.userId,
    };

    return this.projectRepository.create(newProject);
  }

  async find(id: string): Promise<Project> {
    const project = await this.projectRepository.getById(id);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} was not found`);
    }
    return project;
  }

  async listUserProjects(userId: string, status?: ProjectStatus) {
    return this.projectRepository.getProjects(userId, status);
  }

  async update(id: string, project: UpdateProjectInterface): Promise<Project> {
    await this.find(id);

    return this.projectRepository.update(id, project);
  }

  async delete(id: string): Promise<boolean> {
    await this.find(id);

    return this.projectRepository.delete(id);
  }

  async activate(id: string): Promise<boolean> {
    await this.find(id);

    return this.projectRepository.setStatus(id, ProjectStatus.ACTIVE);
  }

  async archive(id: string): Promise<boolean> {
    await this.find(id);

    return this.projectRepository.setStatus(id, ProjectStatus.ARCHIVED);
  }
}
