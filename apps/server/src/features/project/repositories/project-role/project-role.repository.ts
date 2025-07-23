import { Injectable } from "@nestjs/common";
import { ProjectRole } from "../../entities/project-role.entity";
import { CreateProjectRoleInterface } from "../../interfaces/create-project-role.interface";
import { UpdateProjectRoleInterface } from "../../interfaces/update-project-role.interface";
import { ProjectRoleModel } from "../../models/project-role.model";
import { Neo4jService } from "src/core/neo4j/neo4j.service";

@Injectable()
export class ProjectRoleRepository {
  private projectRoleModel: any;

  constructor(private readonly neo4jService: Neo4jService) {
    this.projectRoleModel = ProjectRoleModel(neo4jService.getNeogma());
  }

  async create(role: CreateProjectRoleInterface): Promise<ProjectRole> {
    const projectRole = await this.projectRoleModel.createOne({
      ...role,
    });
    return { ...projectRole };
  }

  async getById(id: string): Promise<ProjectRole | null> {
    const projectRole = await this.projectRoleModel.findOne({ where: { id } });

    return projectRole != null
      ? {
          ...projectRole,
          createdAt: new Date(projectRole.createdAt),
        }
      : null;
  }

  async getAll(): Promise<ProjectRole[]> {
    const projectRoles = await this.projectRoleModel.findMany({});
    return projectRoles.map((role) => ({ ...role }));
  }

  async update(id: string, projectRole: UpdateProjectRoleInterface): Promise<ProjectRole> {
    const updatedProjectRole = await this.projectRoleModel.update(projectRole, {
      where: { id },
      return: true,
    })[0][0];
    return { ...updatedProjectRole };
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await this.projectRoleModel.delete({
      where: { id },
    });
    return deleteResult.count > 0;
  }
}
