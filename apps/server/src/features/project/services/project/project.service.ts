import { Injectable, NotImplementedException } from "@nestjs/common";
import { ProjectRepository } from "../../repositories/project/project.repository";
import { Project } from "../../entities/project.entity";
import { UpdateProjectInterface } from "../../interfaces/update-project.interface";
import { CreateProjectParamsInterface } from "../../interfaces/create-project-params.interface";

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async create(project: CreateProjectParamsInterface): Promise<Project> {
    throw new NotImplementedException();
  }
  async find(id: string): Promise<Project> {
    throw new NotImplementedException();
  }

  async listUserProjects(userId: string): Promise<Project[]> {
    throw new NotImplementedException();
  }

  async update(id: string, project: UpdateProjectInterface): Promise<Project> {
    throw new NotImplementedException();
  }

  async delete(id: string): Promise<boolean> {
    throw new NotImplementedException();
  }

  async activate(id: string): Promise<boolean> {
    throw new NotImplementedException();
  }

  async archive(id: string): Promise<boolean> {
    throw new NotImplementedException();
  }
}
