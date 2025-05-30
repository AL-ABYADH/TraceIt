import { Injectable, NotImplementedException } from "@nestjs/common";
import { ProjectCollaborationRepository } from "../../repositories/project-collaboration/project-collaboration.repository";
import { ProjectCollaboration } from "../../entities/project-collaboration.entity";
import { UpdateProjectCollaborationInterface } from "../../interfaces/update-project-collaboration.interface";

@Injectable()
export class ProjectCollaborationService {
  constructor(private readonly projectCollaborationRepository: ProjectCollaborationRepository) {}

  async listProjectCollaborations(projectId: string): Promise<ProjectCollaboration[]> {
    throw new NotImplementedException();
  }

  async removeProjectCollaboration(id: string): Promise<boolean> {
    throw new NotImplementedException();
  }

  async updateProjectCollaborationRoles(
    id: string,
    projectCollaboration: UpdateProjectCollaborationInterface,
  ): Promise<ProjectCollaboration> {
    throw new NotImplementedException();
  }
}
