import { Body, Controller, NotImplementedException, Param, Patch, Post } from "@nestjs/common";
import { ProjectInvitation } from "../../entities/project-invitation.entity";
import { ProjectInvitationService } from "../../services/project-invitation/project-invitation.service";
import { InviteParamsDto } from "../../dtos/invite-params.dto";

@Controller("project-invitation")
export class ProjectInvitationController {
  constructor(private readonly projectInvitationService: ProjectInvitationService) {}

  @Post()
  async invite(@Body() dto: InviteParamsDto): Promise<ProjectInvitation> {
    throw new NotImplementedException();
  }

  @Patch(":id/accept")
  async accept(@Param("id") id: string): Promise<{ success: boolean }> {
    throw new NotImplementedException();
  }

  @Patch(":id/deny")
  async deny(@Param("id") id: string): Promise<{ success: boolean }> {
    throw new NotImplementedException();
  }

  @Patch(":id/cancel")
  async cancel(@Param("id") id: string): Promise<{ success: boolean }> {
    throw new NotImplementedException();
  }
}
