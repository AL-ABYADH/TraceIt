import { Injectable } from "@nestjs/common";
import { ProjectRole } from "../../entities/project-role.entity";
import { CreateProjectRoleInterface } from "../../interfaces/create-project-role.interface";
import { UpdateProjectRoleInterface } from "../../interfaces/update-project-role.interface";
import { ProjectRoleModel, ProjectRoleModelType } from "../../models/project-role.model";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { Op } from "@repo/custom-neogma";

@Injectable()
export class ProjectRoleRepository {
  private projectRoleModel: ProjectRoleModelType;

  constructor(private readonly neo4jService: Neo4jService) {
    this.projectRoleModel = ProjectRoleModel(neo4jService.getNeogma());
  }

  async create(role: CreateProjectRoleInterface): Promise<ProjectRole> {
    const projectRole = await this.projectRoleModel.createOne({
      name: role.name,
      projectPermissions: {
        where: { params: { id: { [Op.in]: role.permissionIds } } },
      },
    });
    return this.mapOneToProjectRoleEntity(projectRole);
  }

  async getById(id: string): Promise<ProjectRole | null> {
    const projectRole = await this.projectRoleModel.findOne({ where: { id: id } });

    return projectRole != null ? this.mapOneToProjectRoleEntity(projectRole) : null;
  }

  async getAll(): Promise<ProjectRole[]> {
    const projectRoles = await this.projectRoleModel.findManyWithRelations({});
    return this.mapToProjectRoleEntities(projectRoles);
  }

  async update(id: string, projectRoleInterface: UpdateProjectRoleInterface): Promise<ProjectRole> {
    const updatedProjectRole = await this.projectRoleModel.update(
      { name: projectRoleInterface.name },
      {
        where: { id },
      },
    );

    await this.projectRoleModel.deleteRelationships({
      alias: "projectPermissions",
      where: {
        source: { id: id },
      },
    });
    for (const permissionId of projectRoleInterface.permissionIds) {
      await this.projectRoleModel.relateTo({
        alias: "projectPermissions",
        where: {
          source: { id: id },
          target: { id: permissionId },
        },
      });
    }
    const updatedRolsPermission = await this.projectRoleModel.findOneWithRelations({
      where: { id: id },
      include: ["projectPermissions"],
    });
    return this.mapOneToProjectRoleEntity(updatedRolsPermission);
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await this.projectRoleModel.delete({
      where: { id },
      detach: true,
    });
    return deleteResult > 0;
  }

  private mapToProjectRoleEntities(data: any): ProjectRole[] {
    if (!data) return [];
    if (Array.isArray(data)) {
      return data.map((item) => this.mapOneToProjectRoleEntity(item));
    }
    return [this.mapOneToProjectRoleEntity(data)];
  }

  private mapOneToProjectRoleEntity(item: any): ProjectRole {
    const { createdAt, updatedAt, ...rest } = item ?? {};
    const result: any = { ...rest };

    if (createdAt != null)
      result.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
    if (updatedAt != null)
      result.updatedAt = updatedAt instanceof Date ? updatedAt : new Date(updatedAt);

    return result as ProjectRole;
  }
}
