import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from "@nestjs/common";
import { ProjectService } from "../../services/project/project.service";
import { Project } from "../../entities/project.entity";
import { ProjectStatus } from "../../enums/project-status.enum";
import { zodBody, zodParam, zodQuery } from "src/common/pipes/zod";
import {
  type CreateProjectDto,
  createProjectSchema,
  type projectActionDto,
  projectActionSchema,
  type projectStatusDto,
  projectStatusSchema,
  type UpdateProjectDto,
  updateProjectSchema,
  type UuidParamsDto,
  uuidParamsSchema,
} from "@repo/shared-schemas";
import { CurrentUserId } from "../../../../common/decorators/current-user-id.decorator";

@Controller("projects")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async listUserProjects(
    @CurrentUserId() userId: string,
    @Query(zodQuery(projectStatusSchema))
    status: projectStatusDto,
  ) {
    return this.projectService.listUserProjects(userId, status as unknown as ProjectStatus);
  }

  @Get(":id")
  async find(@Param(zodParam(uuidParamsSchema)) projectId: UuidParamsDto): Promise<Project> {
    return this.projectService.findById(projectId.id);
  }

  @Post()
  async create(
    @CurrentUserId() userId: string,
    @Body(zodBody(createProjectSchema)) dto: CreateProjectDto,
  ): Promise<Project> {
    return this.projectService.create({ name: dto.name, description: dto.description, userId });
  }

  @Put(":id")
  async update(
    @Param(zodParam(uuidParamsSchema)) projectId: UuidParamsDto,
    @Body(zodBody(updateProjectSchema)) dto: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectService.update(projectId.id, dto);
  }

  @Delete(":id")
  async delete(
    @Param(zodParam(uuidParamsSchema)) projectId: UuidParamsDto,
  ): Promise<{ success: boolean }> {
    const success = await this.projectService.delete(projectId.id);
    return { success };
  }

  @Patch(":id")
  async activate(
    @Param(zodParam(uuidParamsSchema)) projectId: UuidParamsDto,
    @Query(zodQuery(projectActionSchema)) projectStatus: projectActionDto,
  ): Promise<{ success: boolean }> {
    if (projectStatus.status === "activate") {
      const success = await this.projectService.activate(projectId.id);
      return { success };
    } else if (projectStatus.status === "archive") {
      const success = await this.projectService.archive(projectId.id);
      return { success };
    } else {
      return { success: false };
    }
  }
}
