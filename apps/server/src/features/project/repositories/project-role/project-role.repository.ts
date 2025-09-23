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
    this.projectRoleModel = ProjectRoleModel(this.neo4jService.getNeogma());
  }

  async create(role: CreateProjectRoleInterface): Promise<ProjectRole> {
    const projectRole = await this.projectRoleModel.createOne({
      name: role.name,
      projectPermissions: {
        where: { params: { id: { [Op.in]: role.permissionIds } } },
      },
    });
    return projectRole;
  }

  async getById(id: string): Promise<ProjectRole | null> {
    const projectRole = await this.projectRoleModel.findOne({ where: { id: id } });

    return projectRole != null ? projectRole : null;
  }

  async getAll(): Promise<ProjectRole[]> {
    const projectRoles = await this.projectRoleModel.findManyWithRelations({});
    return projectRoles;
  }

  async update(id: string, projectRoleInterface: UpdateProjectRoleInterface): Promise<ProjectRole> {
    await this.projectRoleModel.updateOneOrThrow(
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
    if (!updatedRolsPermission) {
      throw new Error(`Project role with ID ${id} not found after update`);
    }
    return updatedRolsPermission;
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await this.projectRoleModel.delete({
      where: { id },
      detach: true,
    });
    return deleteResult > 0;
  }
}
