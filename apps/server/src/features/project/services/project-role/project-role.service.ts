import { Injectable, NotFoundException } from "@nestjs/common";
import { ProjectRoleRepository } from "../../repositories/project-role/project-role.repository";
import { ProjectRole } from "../../entities/project-role.entity";
import { CreateProjectRoleInterface } from "../../interfaces/create-project-role.interface";
import { UpdateProjectRoleInterface } from "../../interfaces/update-project-role.interface";

@Injectable()
export class ProjectRoleService {
  constructor(private readonly projectRoleRepository: ProjectRoleRepository) {}

  async create(projectRole: CreateProjectRoleInterface): Promise<ProjectRole> {
    return this.projectRoleRepository.create(projectRole);
  }

  async find(id: string): Promise<ProjectRole> {
    const role = await this.projectRoleRepository.getById(id);
    if (!role) {
      throw new NotFoundException(`ProjectRole with ID ${id} was not found`);
    }
    return role;
  }

  async list(): Promise<ProjectRole[]> {
    return this.projectRoleRepository.getAll();
  }

  async update(id: string, projectRole: UpdateProjectRoleInterface): Promise<ProjectRole> {
    this.find(id);

    return this.projectRoleRepository.update(id, projectRole);
  }

  async delete(id: string): Promise<boolean> {
    this.find(id);

    return this.projectRoleRepository.delete(id);
  }
}
