import { Injectable, NotImplementedException } from "@nestjs/common";
import { ProjectInvitation } from "../../entities/project-invitation.entity";
import { ProjectInvitationRepository } from "../../repositories/project-invitation/project-invitation.repository";
import { InviteParamsInterface } from "../../interfaces/invite-params.interface";

@Injectable()
export class ProjectInvitationService {
  constructor(private readonly projectInvitationRepository: ProjectInvitationRepository) {}

  async invite(params: InviteParamsInterface): Promise<ProjectInvitation> {
    throw new NotImplementedException();
  }

  async accept(id: string): Promise<boolean> {
    throw new NotImplementedException();
  }

  async deny(id: string): Promise<boolean> {
    throw new NotImplementedException();
  }

  async cancel(id: string): Promise<boolean> {
    throw new NotImplementedException();
  }
}
