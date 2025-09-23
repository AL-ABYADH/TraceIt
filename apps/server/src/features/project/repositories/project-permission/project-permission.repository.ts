import { Injectable } from "@nestjs/common";
import { ProjectPermission } from "../../entities/project-permission.entity";
import { CreateProjectPermissionInterface } from "../../interfaces/create-project-permission.interface";
import { UpdateProjectPermissionInterface } from "../../interfaces/update-project-permission.interface";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import {
  ProjectPermissionModel,
  ProjectPermissionModelType,
} from "../../models/project-permission.model";

@Injectable()
export class ProjectPermissionRepository {
  private projectPermissionModel: ProjectPermissionModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.projectPermissionModel = ProjectPermissionModel(this.neo4jService.getNeogma());
  }

  async create(permission: CreateProjectPermissionInterface): Promise<ProjectPermission> {
    const projectPermission = await this.projectPermissionModel.createOne({
      ...permission,
    });
    return projectPermission;
  }

  async getById(id: string): Promise<ProjectPermission | null> {
    const projectPermission = await this.projectPermissionModel.findOne({ where: { id } });

    return projectPermission != null ? projectPermission : null;
  }

  async getAll(): Promise<ProjectPermission[]> {
    const projectPermissions = await this.projectPermissionModel.findManyWithRelations({});
    return projectPermissions;
  }

  async update(
    id: string,
    projectPermission: UpdateProjectPermissionInterface,
  ): Promise<ProjectPermission[]> {
    const updatedProjectPermission: any = await this.projectPermissionModel.updateOneOrThrow(
      projectPermission,
      {
        where: { id: id },
      },
    );

    return updatedProjectPermission;
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await this.projectPermissionModel.delete({
      detach: true,
      where: { id },
    });

    return deleteResult > 0;
  }
}
