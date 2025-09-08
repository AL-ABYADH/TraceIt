import { Body, Controller, Delete, Param, Put, Post, Get } from "@nestjs/common";
import { ProjectCollaborationService } from "../../services/project-collaboration/project-collaboration.service";
import { ProjectCollaboration } from "../../entities/project-collaboration.entity";
import { zodBody, zodParam } from "src/common/pipes/zod";
import {
  type UpdateProjectCollaborationDto,
  updateProjectCollaborationSchema,
  type UuidParamsDto,
  uuidParamsSchema,
  type CreateProjectCollaborationDto,
  createProjectCollaborationSchema,
} from "@repo/shared-schemas";

@Controller("project-collaborations")
export class ProjectCollaborationController {
  constructor(private readonly projectCollaborationService: ProjectCollaborationService) {}

  @Post()
  async create(
    @Body(zodBody(createProjectCollaborationSchema)) dto: CreateProjectCollaborationDto,
  ): Promise<ProjectCollaboration> {
    return this.projectCollaborationService.create(dto);
  }

  @Get(":id")
  async listProjectCollaborations(
    @Param(zodParam(uuidParamsSchema)) projectId: UuidParamsDto,
  ): Promise<ProjectCollaboration[]> {
    return this.projectCollaborationService.listProjectCollaborations(projectId.id);
  }

  @Put(":id")
  async updateProjectCollaborationRoles(
    @Param(zodParam(uuidParamsSchema)) projectId: UuidParamsDto,
    @Body(zodBody(updateProjectCollaborationSchema)) dto: UpdateProjectCollaborationDto,
  ): Promise<ProjectCollaboration> {
    return this.projectCollaborationService.updateProjectCollaborationRoles(projectId.id, dto);
  }

  @Delete(":id")
  async removeProjectCollaboration(
    @Param(zodParam(uuidParamsSchema)) projectId: UuidParamsDto,
  ): Promise<boolean> {
    return this.projectCollaborationService.removeProjectCollaboration(projectId.id);
  }
}
