import { Injectable, NotImplementedException } from "@nestjs/common";
import { Project } from "../../entities/project.entity";
import { CreateProjectInterface } from "../../interfaces/create-project.interface";
import { UpdateProjectInterface } from "../../interfaces/update-project.interface";
import { ProjectStatus } from "../../enums/project-status.enum";
import { ProjectModel } from "../../models/project.model";
import { Neo4jService } from "src/core/neo4j/neo4j.service";

@Injectable()
export class ProjectRepository {
  private projectModel: any;

  constructor(private readonly neo4jService: Neo4jService) {
    this.projectModel = ProjectModel(neo4jService.getNeogma());
  }

  async create(project: CreateProjectInterface): Promise<Project> {
    throw new NotImplementedException();
  }

  async getById(id: string): Promise<Project> {
    throw new NotImplementedException();
  }

  async getByOwnerOrCollaboration(userId: string, status: ProjectStatus): Promise<Project[]> {
    throw new NotImplementedException();
  }

  async update(id: string, project: UpdateProjectInterface): Promise<Project> {
    throw new NotImplementedException();
  }

  async delete(id: string): Promise<boolean> {
    throw new NotImplementedException();
  }

  async setStatus(id: string, status: ProjectStatus): Promise<boolean> {
    throw new NotImplementedException();
  }
}
