import { Injectable, NotImplementedException } from "@nestjs/common";
import { ProjectPermissionRepository } from "../../repositories/project-permission/project-permission.repository";
import { ProjectPermission } from "../../entities/project-permission.entity";
import { CreateProjectPermissionInterface } from "../../interfaces/create-project-permission.interface";
import { UpdateProjectPermissionInterface } from "../../interfaces/update-project-permission.interface";

@Injectable()
export class ProjectPermissionService {
  constructor(private readonly projectPermissionRepository: ProjectPermissionRepository) {}

  async create(projectPermission: CreateProjectPermissionInterface): Promise<ProjectPermission> {
    throw new NotImplementedException();
  }
  async find(id: string): Promise<ProjectPermission> {
    throw new NotImplementedException();
  }

  async list(): Promise<ProjectPermission[]> {
    throw new NotImplementedException();
  }

  async update(
    id: string,
    projectPermission: UpdateProjectPermissionInterface,
  ): Promise<ProjectPermission> {
    throw new NotImplementedException();
  }

  async delete(id: string): Promise<boolean> {
    throw new NotImplementedException();
  }
}
