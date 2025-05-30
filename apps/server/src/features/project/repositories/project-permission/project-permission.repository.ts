import { Injectable, NotImplementedException } from "@nestjs/common";
import { ProjectPermission } from "../../entities/project-permission.entity";
import { CreateProjectPermissionInterface } from "../../interfaces/create-project-permission.interface";
import { UpdateProjectPermissionInterface } from "../../interfaces/update-project-permission.interface";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { ProjectPermissionModel } from "../../models/project-permission.model";

@Injectable()
export class ProjectPermissionRepository {
  private projectPermissionModel: any;

  constructor(private readonly neo4jService: Neo4jService) {
    this.projectPermissionModel = ProjectPermissionModel(neo4jService.getNeogma());
  }

  async create(projectPermission: CreateProjectPermissionInterface): Promise<ProjectPermission> {
    throw new NotImplementedException();
  }

  async getById(id: string): Promise<ProjectPermission> {
    throw new NotImplementedException();
  }

  async getAll(): Promise<ProjectPermission[]> {
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
