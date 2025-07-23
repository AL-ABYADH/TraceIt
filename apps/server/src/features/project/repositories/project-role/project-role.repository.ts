import { Injectable } from "@nestjs/common";
import { ProjectRole } from "../../entities/project-role.entity";
import { CreateProjectRoleInterface } from "../../interfaces/create-project-role.interface";
import { UpdateProjectRoleInterface } from "../../interfaces/update-project-role.interface";
import { ProjectRoleModel } from "../../models/project-role.model";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { plainToInstance } from "class-transformer";

@Injectable()
export class ProjectRoleRepository {
  private projectRoleModel: any;

  constructor(private readonly neo4jService: Neo4jService) {
    this.projectRoleModel = ProjectRoleModel(neo4jService.getNeogma());
  }

  async create(projectRole: CreateProjectRoleInterface): Promise<ProjectRole> {
    const newProjectRole = {
      ...projectRole,
    };

    const role = await this.projectRoleModel.createOne(newProjectRole);
    return plainToInstance(ProjectRole, role.getDataValues());
  }

  async getById(id: string): Promise<ProjectRole> {
    const projectRole = await this.projectRoleModel.findOne({ where: { id } });

    return plainToInstance(ProjectRole, projectRole.getDataValues());
  }

  async getAll(): Promise<ProjectRole[]> {
    const projectRoles = await this.projectRoleModel.findMany({});
    return projectRoles.map((role) => plainToInstance(ProjectRole, role.getDataValues()));
  }

  async update(id: string, projectRole: UpdateProjectRoleInterface): Promise<ProjectRole> {
    const [updatedProjectRole] = await this.projectRoleModel.update({ id }, projectRole);
    return plainToInstance(ProjectRole, updatedProjectRole.getDataValues());
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await this.projectRoleModel.delete({
      where: { id },
    });
    return deleteResult.count > 0;
  }
}
