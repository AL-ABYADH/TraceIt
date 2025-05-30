import { Injectable, NotImplementedException } from "@nestjs/common";
import { ProjectInvitationStatus } from "../../enums/project-invitation-status.enum";
import { ProjectInvitation } from "../../entities/project-invitation.entity";
import { CreateProjectInvitationInterface } from "../../interfaces/create-project-invitation.interface";
import { ProjectInvitationModel } from "../../models/project-invitation.model";
import { Neo4jService } from "src/core/neo4j/neo4j.service";

@Injectable()
export class ProjectInvitationRepository {
  private projectInvitationModel: any;

  constructor(private readonly neo4jService: Neo4jService) {
    this.projectInvitationModel = ProjectInvitationModel(neo4jService.getNeogma());
  }

  async create(projectInvitation: CreateProjectInvitationInterface): Promise<ProjectInvitation> {
    throw new NotImplementedException();
  }

  async getBySender(
    senderId: string,
    status: ProjectInvitationStatus,
  ): Promise<ProjectInvitation[]> {
    throw new NotImplementedException();
  }

  async getByReceiver(
    receiverId: string,
    status: ProjectInvitationStatus,
  ): Promise<ProjectInvitation[]> {
    throw new NotImplementedException();
  }

  async setStatus(id: string, status: ProjectInvitationStatus): Promise<boolean> {
    throw new NotImplementedException();
  }
}
