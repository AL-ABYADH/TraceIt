import { Body, Controller, Delete, Param, Put } from "@nestjs/common";
import { ProjectCollaborationService } from "../../services/project-collaboration/project-collaboration.service";
import { ProjectCollaboration } from "../../entities/project-collaboration.entity";
import { UpdateProjectCollaborationDto } from "../../dtos/update-project-collaboration.dto";

@Controller("project-collaborations")
export class ProjectCollaborationController {
  constructor(private readonly projectCollaborationService: ProjectCollaborationService) {}

  @Put(":id")
  async updateProjectCollaborationRoles(
    @Param("id") id: string,
    @Body() dto: UpdateProjectCollaborationDto,
  ): Promise<ProjectCollaboration> {
    return this.projectCollaborationService.updateProjectCollaborationRoles(id, dto);
  }

  @Delete(":id")
  async removeProjectCollaboration(@Param("id") id: string): Promise<boolean> {
    return this.projectCollaborationService.removeProjectCollaboration(id);
  }
}
