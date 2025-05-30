import { Injectable, NotImplementedException } from "@nestjs/common";
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

  async create(projectRole: CreateProjectRoleInterface): Promise<ProjectRole> {
    throw new NotImplementedException();
  }

  async getById(id: string): Promise<ProjectRole> {
    throw new NotImplementedException();
  }

  async getAll(): Promise<ProjectRole[]> {
    throw new NotImplementedException();
  }

  async update(id: string, projectRole: UpdateProjectRoleInterface): Promise<ProjectRole> {
    throw new NotImplementedException();
  }

  async delete(id: string): Promise<boolean> {
    throw new NotImplementedException();
  }
}
