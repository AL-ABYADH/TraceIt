import { Injectable, NotFoundException } from "@nestjs/common";
import { ProjectInvitation } from "../../entities/project-invitation.entity";
import { ProjectInvitationRepository } from "../../repositories/project-invitation/project-invitation.repository";
import { ProjectInvitationStatus } from "../../enums/project-invitation-status.enum";
import { CreateProjectInvitationInterface } from "../../interfaces/create-project-invitation.interface";

@Injectable()
export class ProjectInvitationService {
  constructor(private readonly projectInvitationRepository: ProjectInvitationRepository) {}

  async getProjectInvitations(
    userID: string,
    status?: ProjectInvitationStatus,
  ): Promise<ProjectInvitation[]> {
    return this.projectInvitationRepository.getByReceiver(userID, status);
  }

  async getSentInvitations(
    userID: string,
    status?: ProjectInvitationStatus,
  ): Promise<ProjectInvitation[]> {
    return this.projectInvitationRepository.getBySender(userID, status);
  }
  async invite(
    userID: string,
    params: CreateProjectInvitationInterface,
  ): Promise<ProjectInvitation> {
    return this.projectInvitationRepository.create(userID, params);
  }
  async accept(id: string): Promise<boolean> {
    const updated = await this.projectInvitationRepository.setStatus(
      id,
      ProjectInvitationStatus.ACCEPTED,
    );
    if (!updated) {
      throw new NotFoundException(`Invitation with ID ${id} not found`);
    }
    return true;
  }

  async deny(id: string): Promise<boolean> {
    const updated = await this.projectInvitationRepository.setStatus(
      id,
      ProjectInvitationStatus.DENIED,
    );
    if (!updated) {
      throw new NotFoundException(`Invitation with ID ${id} not found`);
    }
    return true;
  }

  async cancel(id: string): Promise<boolean> {
    const updated = await this.projectInvitationRepository.setStatus(
      id,
      ProjectInvitationStatus.CANCELLED,
    );
    if (!updated) {
      throw new NotFoundException(`Invitation with ID ${id} not found`);
    }
    return true;
  }
}
