import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from "@nestjs/common";
import { ProjectService } from "../../services/project/project.service";
import { ProjectStatus } from "../../enums/project-status.enum";
import { zodBody, zodParam, zodQuery } from "src/common/pipes/zod";
import {
  type CreateProjectDto,
  createProjectSchema,
  type ProjectActionDto,
  projectActionSchema,
  type ProjectDetailDto,
  type ProjectStatusDto,
  projectStatusSchema,
  type UpdateProjectDto,
  updateProjectSchema,
  ProjectListDto,
  type ProjectIdDto,
  projectIdSchema,
} from "@repo/shared-schemas";
import { CurrentUserId } from "../../../../common/decorators/current-user-id.decorator";

@Controller("projects")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async listUserProjects(
    @CurrentUserId() userId: string,
    @Query(zodQuery(projectStatusSchema))
    status: ProjectStatusDto,
  ): Promise<ProjectListDto[]> {
    // return this.projectService.listUserProjects(userId, status as unknown as ProjectStatus);
    return this.projectService.listUserProjects(userId, status as unknown as ProjectStatus);
  }

  @Get(":projectId")
  async find(@Param(zodParam(projectIdSchema)) params: ProjectIdDto): Promise<ProjectDetailDto> {
    return this.projectService.findById(params.projectId);
  }

  @Post()
  async create(
    @CurrentUserId() userId: string,
    @Body(zodBody(createProjectSchema)) dto: CreateProjectDto,
  ): Promise<ProjectDetailDto> {
    return this.projectService.create({ name: dto.name, description: dto.description, userId });
  }

  @Put(":projectId")
  async update(
    @Param(zodParam(projectIdSchema)) params: ProjectIdDto,
    @Body(zodBody(updateProjectSchema)) dto: UpdateProjectDto,
  ): Promise<ProjectDetailDto> {
    return this.projectService.update(params.projectId, dto);
  }

  @Delete(":projectId")
  async delete(
    @Param(zodParam(projectIdSchema)) params: ProjectIdDto,
  ): Promise<{ success: boolean }> {
    const success = await this.projectService.delete(params.projectId);
    return { success };
  }

  @Patch(":projectId")
  async activate(
    @Param(zodParam(projectIdSchema)) params: ProjectIdDto,
    @Query(zodQuery(projectActionSchema)) projectStatus: ProjectActionDto,
  ): Promise<{ success: boolean }> {
    if (projectStatus.status === "activate") {
      const success = await this.projectService.activate(params.projectId);
      return { success };
    } else if (projectStatus.status === "archive") {
      const success = await this.projectService.archive(params.projectId);
      return { success };
    } else {
      return { success: false };
    }
  }
}
