import { Injectable, NotImplementedException } from "@nestjs/common";
import { ProjectCollaboration } from "../../entities/project-collaboration.entity";
import { CreateProjectCollaborationInterface } from "../../interfaces/create-project-collaboration.interface";
import { UpdateProjectCollaborationInterface } from "../../interfaces/update-project-collaboration.interface";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { ProjectCollaborationModel } from "../../models/project-collaboration.model";

@Injectable()
export class ProjectCollaborationRepository {
  private projectCollaborationModel: any;

  constructor(private readonly neo4jService: Neo4jService) {
    this.projectCollaborationModel = ProjectCollaborationModel(neo4jService.getNeogma());
  }

  async create(
    projectCollaboration: CreateProjectCollaborationInterface,
  ): Promise<ProjectCollaboration> {
    throw new NotImplementedException();
  }

  async getByProject(projectId: string): Promise<ProjectCollaboration[]> {
    throw new NotImplementedException();
  }

  async update(
    id: string,
    projectCollaboration: UpdateProjectCollaborationInterface,
  ): Promise<ProjectCollaboration> {
    throw new NotImplementedException();
  }

  async delete(id: string): Promise<boolean> {
    throw new NotImplementedException();
  }
}
