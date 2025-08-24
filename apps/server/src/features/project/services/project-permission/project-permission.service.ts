import { Injectable, NotFoundException } from "@nestjs/common";
import { ProjectPermissionRepository } from "../../repositories/project-permission/project-permission.repository";
import { ProjectPermission } from "../../entities/project-permission.entity";
import { CreateProjectPermissionInterface } from "../../interfaces/create-project-permission.interface";
import { UpdateProjectPermissionInterface } from "../../interfaces/update-project-permission.interface";

@Injectable()
export class ProjectPermissionService {
  constructor(private readonly projectPermissionRepository: ProjectPermissionRepository) {}

  async create(projectPermission: CreateProjectPermissionInterface): Promise<ProjectPermission> {
    return this.projectPermissionRepository.create(projectPermission);
  }

  async find(id: string): Promise<ProjectPermission> {
    const permission = await this.projectPermissionRepository.getById(id);
    if (!permission) {
      throw new NotFoundException(`ProjectPermission with ID ${id} not found`);
    }

    return permission;
  }

  async list(): Promise<ProjectPermission[]> {
    return this.projectPermissionRepository.getAll();
  }

  async update(
    id: string,
    projectPermission: UpdateProjectPermissionInterface,
  ): Promise<ProjectPermission[]> {
    await this.find(id);

    return this.projectPermissionRepository.update(id, projectPermission);
  }

  async delete(id: string): Promise<boolean> {
    await this.find(id);

    return this.projectPermissionRepository.delete(id);
  }
}
