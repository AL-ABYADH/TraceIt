import { Injectable } from "@nestjs/common";
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
    const invitation = await this.projectInvitationModel.createOne({
      ...projectInvitation,
    });
    return { ...invitation, createdAt: new Date(invitation.createdAt) };
  }

  async getBySender(
    senderId: string,
    status: ProjectInvitationStatus,
  ): Promise<ProjectInvitation[]> {
    const invitations = await this.projectInvitationModel.find({
      where: {
        status,
      },
      whereRelated: {
        sender: {
          where: {
            id: senderId,
          },
        },
      },
    });

    return invitations.map((invitation) => ({
      ...invitation,
      createdAt: new Date(invitation.createdAt),
    }));
  }

  async getByReceiver(
    receiverId: string,
    status: ProjectInvitationStatus,
  ): Promise<ProjectInvitation[]> {
    const invitations = await this.projectInvitationModel.find({
      where: {
        status,
      },
      whereRelated: {
        receiver: {
          where: {
            id: receiverId,
          },
        },
      },
    });

    return invitations.map((invitation) => ({
      ...invitation,
      createdAt: new Date(invitation.createdAt),
    }));
  }

  async setStatus(id: string, status: ProjectInvitationStatus): Promise<boolean> {
    const updated = await this.projectInvitationModel.update({ id }, { status: status });

    return updated.length > 0;
  }
}
