import { Injectable, NotFoundException } from "@nestjs/common";
import { ProjectInvitation } from "../../entities/project-invitation.entity";
import { ProjectInvitationRepository } from "../../repositories/project-invitation/project-invitation.repository";
import { InviteParamsInterface } from "../../interfaces/invite-params.interface";
import { ProjectInvitationStatus } from "../../enums/project-invitation-status.enum";

@Injectable()
export class ProjectInvitationService {
  constructor(private readonly projectInvitationRepository: ProjectInvitationRepository) {}

  async invite(params: InviteParamsInterface): Promise<ProjectInvitation> {
    throw new NotImplementedException();
  }

  private handleInvitationNotFound(id: string): never {
    throw new NotFoundException(`Invitation with ID ${id} not found`);
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
