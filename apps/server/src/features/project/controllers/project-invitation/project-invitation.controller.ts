import { Body, Controller, Get, Param, ParseEnumPipe, Patch, Post, Query } from "@nestjs/common";
import { ProjectInvitationService } from "../../services/project-invitation/project-invitation.service";
import {
  type CreateProjectInvitationDto,
  createProjectInvitationSchema,
  type ProjectIdDto,
  projectIdSchema,
  ProjectInvitationDto,
  type UuidParamsDto,
  uuidParamsSchema,
} from "@repo/shared-schemas";
import { zodBody, zodParam } from "src/common/pipes/zod";
import { CurrentUserId } from "../../../../common/decorators/current-user-id.decorator";
import { ProjectInvitationStatus } from "../../enums/project-invitation-status.enum";

@Controller("project-invitations")
export class ProjectInvitationController {
  constructor(private readonly projectInvitationService: ProjectInvitationService) {}

  @Get()
  async getProjectInvitations(
    @CurrentUserId() userID: string,
    @Query("status", new ParseEnumPipe(ProjectInvitationStatus, { optional: true }))
    status?: ProjectInvitationStatus,
  ): Promise<ProjectInvitationDto[]> {
    return this.projectInvitationService.getProjectInvitations(userID, status);
  }

  @Get("sent")
  async getSentInvitations(
    @CurrentUserId() userID: string,
    @Query("status", new ParseEnumPipe(ProjectInvitationStatus, { optional: true }))
    status?: ProjectInvitationStatus,
  ): Promise<ProjectInvitationDto[]> {
    return this.projectInvitationService.getSentInvitations(userID, status);
  }

  @Post()
  async invite(
    @CurrentUserId() userID: string,
    @Body(zodBody(createProjectInvitationSchema)) dto: CreateProjectInvitationDto,
  ): Promise<ProjectInvitationDto> {
    return this.projectInvitationService.invite(userID, {
      ...dto,
      expirationDate: new Date(dto.expirationDate),
    });
  }

  @Patch(":projectId/accept")
  async accept(
    @Param(zodParam(projectIdSchema)) params: ProjectIdDto,
  ): Promise<{ success: boolean }> {
    const result = await this.projectInvitationService.accept(params.projectId);
    return { success: result };
  }

  @Patch(":projectId/deny")
  async deny(
    @Param(zodParam(projectIdSchema)) params: ProjectIdDto,
  ): Promise<{ success: boolean }> {
    const result = await this.projectInvitationService.deny(params.projectId);
    return { success: result };
  }

  @Patch(":projectId/cancel")
  async cancel(
    @Param(zodParam(projectIdSchema)) params: ProjectIdDto,
  ): Promise<{ success: boolean }> {
    const result = await this.projectInvitationService.cancel(params.projectId);
    return { success: result };
  }
}
