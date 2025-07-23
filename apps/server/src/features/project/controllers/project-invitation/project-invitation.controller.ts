import { Body, Controller, Param, Patch, Post } from "@nestjs/common";
import { ProjectInvitation } from "../../entities/project-invitation.entity";
import { ProjectInvitationService } from "../../services/project-invitation/project-invitation.service";
import { InviteParamsDto } from "../../dtos/invite-params.dto";

@Controller("project-invitations")
export class ProjectInvitationController {
  constructor(private readonly projectInvitationService: ProjectInvitationService) {}

  @Post()
  async invite(@Body() dto: InviteParamsDto): Promise<ProjectInvitation> {
    return this.projectInvitationService.invite(dto);
  }

  @Patch(":id/accept")
  async accept(@Param("id") id: string): Promise<{ success: boolean }> {
    const result = await this.projectInvitationService.accept(id);
    return { success: result };
  }

  @Patch(":id/deny")
  async deny(@Param("id") id: string): Promise<{ success: boolean }> {
    const result = await this.projectInvitationService.deny(id);
    return { success: result };
  }

  @Patch(":id/cancel")
  async cancel(@Param("id") id: string): Promise<{ success: boolean }> {
    const result = await this.projectInvitationService.cancel(id);
    return { success: result };
  }
}
