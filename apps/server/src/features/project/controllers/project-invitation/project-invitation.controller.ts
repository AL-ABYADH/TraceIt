import { Body, Controller, Param, Patch, Post } from "@nestjs/common";
import { ProjectInvitation } from "../../entities/project-invitation.entity";
import { ProjectInvitationService } from "../../services/project-invitation/project-invitation.service";
// import { CreateProjectInvitationDto } from "../../dtos/create-project-invitation.dto";
import {
  type CreateProjectInvitationDto,
  createProjectInvitationSchema,
  type UuidParamsDto,
  uuidParamsSchema,
} from "@repo/shared-schemas";
import { zodBody, zodParam } from "src/common/pipes/zod";

@Controller("project-invitations")
export class ProjectInvitationController {
  constructor(private readonly projectInvitationService: ProjectInvitationService) {}

  @Post()
  async invite(
    @Body(zodBody(createProjectInvitationSchema)) dto: CreateProjectInvitationDto,
  ): Promise<ProjectInvitation> {
    return this.projectInvitationService.invite(dto);
  }

  @Patch(":id/accept")
  async accept(
    @Param(zodParam(uuidParamsSchema)) projectId: UuidParamsDto,
  ): Promise<{ success: boolean }> {
    const result = await this.projectInvitationService.accept(projectId.id);
    return { success: result };
  }

  @Patch(":id/deny")
  async deny(
    @Param(zodParam(uuidParamsSchema)) projectId: UuidParamsDto,
  ): Promise<{ success: boolean }> {
    const result = await this.projectInvitationService.deny(projectId.id);
    return { success: result };
  }

  @Patch(":id/cancel")
  async cancel(
    @Param(zodParam(uuidParamsSchema)) projectId: UuidParamsDto,
  ): Promise<{ success: boolean }> {
    const result = await this.projectInvitationService.cancel(projectId.id);
    return { success: result };
  }
}
