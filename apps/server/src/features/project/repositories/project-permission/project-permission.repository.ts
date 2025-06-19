import { Injectable } from "@nestjs/common";
import { ProjectPermission } from "../../entities/project-permission.entity";
import { CreateProjectPermissionInterface } from "../../interfaces/create-project-permission.interface";
import { UpdateProjectPermissionInterface } from "../../interfaces/update-project-permission.interface";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { ProjectPermissionModel } from "../../models/project-permission.model";
import { plainToInstance } from "class-transformer";

@Injectable()
export class ProjectPermissionRepository {
  private projectPermissionModel: any;

  constructor(private readonly neo4jService: Neo4jService) {
    this.projectPermissionModel = ProjectPermissionModel(neo4jService.getNeogma());
  }

  async create(projectPermission: CreateProjectPermissionInterface): Promise<ProjectPermission> {
    const newProjectPermission = {
      ...projectPermission,
    };

    const permission = await this.projectPermissionModel.createOne(newProjectPermission);
    return plainToInstance(ProjectPermission, permission.getDataValues());
  }

  async getById(id: string): Promise<ProjectPermission> {
    const projectPermission = await this.projectPermissionModel.findOne({ where: { id } });

    return plainToInstance(ProjectPermission, projectPermission.getDataValues());
  }

  async getAll(): Promise<ProjectPermission[]> {
    const projectPermissions = await this.projectPermissionModel.find({});
    return projectPermissions.map((permission) =>
      plainToInstance(ProjectPermission, permission.getDataValues()),
    );
  }

  async update(
    id: string,
    projectPermission: UpdateProjectPermissionInterface,
  ): Promise<ProjectPermission> {
    const [updatedProjectPermission] = await this.projectPermissionModel.update(
      {
        id,
      },
      projectPermission,
    );

    return plainToInstance(ProjectPermission, updatedProjectPermission.getDataValues());
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await this.projectPermissionModel.delete({
      where: { id },
    });

    return deleteResult.count > 0;
  }
}
