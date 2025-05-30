import { Injectable, NotImplementedException } from "@nestjs/common";
import { ProjectRoleRepository } from "../../repositories/project-role/project-role.repository";
import { ProjectRole } from "../../entities/project-role.entity";
import { CreateProjectRoleInterface } from "../../interfaces/create-project-role.interface";
import { UpdateProjectRoleInterface } from "../../interfaces/update-project-role.interface";

@Injectable()
export class ProjectRoleService {
  constructor(private readonly projectRoleRepository: ProjectRoleRepository) {}

  async create(projectRole: CreateProjectRoleInterface): Promise<ProjectRole> {
    throw new NotImplementedException();
  }
  async find(id: string): Promise<ProjectRole> {
    throw new NotImplementedException();
  }

  async list(): Promise<ProjectRole[]> {
    throw new NotImplementedException();
  }

  async update(id: string, projectRole: UpdateProjectRoleInterface): Promise<ProjectRole> {
    throw new NotImplementedException();
  }

  async delete(id: string): Promise<boolean> {
    throw new NotImplementedException();
  }
}
