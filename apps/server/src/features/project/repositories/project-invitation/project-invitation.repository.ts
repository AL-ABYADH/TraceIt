import { Injectable } from "@nestjs/common";
import { ProjectInvitationStatus } from "../../enums/project-invitation-status.enum";
import { ProjectInvitation } from "../../entities/project-invitation.entity";
import { CreateProjectInvitationInterface } from "../../interfaces/create-project-invitation.interface";
import { Op } from "@repo/custom-neogma";
import {
  ProjectInvitationModel,
  ProjectInvitationModelType,
} from "../../models/project-invitation.model";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { ProjectRepository } from "../project/project.repository";

@Injectable()
export class ProjectInvitationRepository {
  private projectInvitationModel: ProjectInvitationModelType;

  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly projectRepository: ProjectRepository,
  ) {
    this.projectInvitationModel = ProjectInvitationModel(this.neo4jService.getNeogma());
  }

  async create(
    userID: string,
    projectInvitationInterface: CreateProjectInvitationInterface,
  ): Promise<ProjectInvitation> {
    const projectDetails = await this.projectRepository.getById(
      projectInvitationInterface.projectId,
    );
    if (!projectDetails) {
      throw new Error(`Project with ID ${projectInvitationInterface.projectId} not found`);
    }
    if (projectDetails.owner?.id !== projectInvitationInterface.senderId) {
      throw new Error(`User with ID ${userID} is not the owner of the project`);
    }
    if (userID !== projectInvitationInterface.senderId) {
      throw new Error("Don't have permission to create an invitation for another user");
    }
    const invitation = await this.projectInvitationModel.createOne({
      expirationDate: projectInvitationInterface.expirationDate,
      status: ProjectInvitationStatus.PENDING,
      sender: {
        where: [{ params: { id: projectInvitationInterface.senderId } }],
      },
      receiver: {
        where: [{ params: { id: projectInvitationInterface.receiverId } }],
      },
      project: {
        where: [{ params: { id: projectInvitationInterface.projectId } }],
      },
      projectRoles: {
        where: { params: { id: { [Op.in]: projectInvitationInterface.projectRoleIds } } },
      },
    });
    return invitation;
  }

  async getBySender(
    senderId: string,
    status?: ProjectInvitationStatus,
  ): Promise<ProjectInvitation[]> {
    const whereParams = {};
    if (status !== undefined) {
      whereParams["status"] = status;
    }
    const invitations = await this.projectInvitationModel.findByRelatedEntity({
      relationshipAlias: "sender",
      where: whereParams,
      whereRelated: {
        id: senderId,
      },
    });
    return invitations;
  }

  async getByReceiver(
    receiverId: string,
    status?: ProjectInvitationStatus,
  ): Promise<ProjectInvitation[]> {
    const whereParams = {};
    if (status !== undefined) {
      whereParams["status"] = status;
    }
    const invitations = await this.projectInvitationModel.findByRelatedEntity({
      relationshipAlias: "receiver",
      where: whereParams,
      whereRelated: { id: receiverId },
    });

    return invitations;
  }

  async setStatus(id: string, status: ProjectInvitationStatus): Promise<boolean> {
    const updated = await this.projectInvitationModel.updateOneOrThrow(
      { status: status },
      { where: { id: id } },
    );

    return !!updated;
  }

  async getById(id: string): Promise<ProjectInvitation | null> {
    const invitation = await this.projectInvitationModel.findOneWithRelations({
      where: { id: id },
    });
    return invitation;
  }
}
