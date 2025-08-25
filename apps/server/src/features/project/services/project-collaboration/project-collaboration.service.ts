import { Injectable } from "@nestjs/common";
import { ProjectCollaborationRepository } from "../../repositories/project-collaboration/project-collaboration.repository";
import { ProjectCollaboration } from "../../entities/project-collaboration.entity";
import { UpdateProjectCollaborationInterface } from "../../interfaces/update-project-collaboration.interface";
import { CreateProjectCollaborationInterface } from "../../interfaces/create-project-collaboration.interface";

@Injectable()
export class ProjectCollaborationService {
  constructor(private readonly projectCollaborationRepository: ProjectCollaborationRepository) {}

  async create(params: CreateProjectCollaborationInterface): Promise<ProjectCollaboration> {
    return this.projectCollaborationRepository.create(params);
  }

  async listProjectCollaborations(projectId: string): Promise<ProjectCollaboration[]> {
    return this.projectCollaborationRepository.getByProject(projectId);
  }

  async removeProjectCollaboration(id: string): Promise<boolean> {
    return this.projectCollaborationRepository.delete(id);
  }

  async updateProjectCollaborationRoles(
    id: string,
    projectCollaboration: UpdateProjectCollaborationInterface,
  ): Promise<ProjectCollaboration> {
    return this.projectCollaborationRepository.update(id, projectCollaboration);
  }
}
