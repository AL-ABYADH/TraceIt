import { Body, Controller, Delete, Param, Put, Post, Get } from "@nestjs/common";
import { ProjectCollaborationService } from "../../services/project-collaboration/project-collaboration.service";
import { zodBody, zodParam } from "src/common/pipes/zod";
import {
  type UpdateProjectCollaborationDto,
  updateProjectCollaborationSchema,
  type CreateProjectCollaborationDto,
  createProjectCollaborationSchema,
  ProjectCollaborationDto,
  type ProjectIdDto,
  projectIdSchema,
} from "@repo/shared-schemas";

@Controller("project-collaborations")
export class ProjectCollaborationController {
  constructor(private readonly projectCollaborationService: ProjectCollaborationService) {}

  @Post()
  async create(
    @Body(zodBody(createProjectCollaborationSchema)) dto: CreateProjectCollaborationDto,
  ): Promise<ProjectCollaborationDto> {
    return this.projectCollaborationService.create(dto);
  }

  @Get(":projectId")
  async listProjectCollaborations(
    @Param(zodParam(projectIdSchema)) params: ProjectIdDto,
  ): Promise<ProjectCollaborationDto[]> {
    return this.projectCollaborationService.listProjectCollaborations(params.projectId);
  }

  @Put(":projectId")
  async updateProjectCollaborationRoles(
    @Param(zodParam(projectIdSchema)) params: ProjectIdDto,
    @Body(zodBody(updateProjectCollaborationSchema)) dto: UpdateProjectCollaborationDto,
  ): Promise<ProjectCollaborationDto> {
    return this.projectCollaborationService.updateProjectCollaborationRoles(params.projectId, dto);
  }

  @Delete(":projectId")
  async removeProjectCollaboration(
    @Param(zodParam(projectIdSchema)) params: ProjectIdDto,
  ): Promise<boolean> {
    return this.projectCollaborationService.removeProjectCollaboration(params.projectId);
  }
}
