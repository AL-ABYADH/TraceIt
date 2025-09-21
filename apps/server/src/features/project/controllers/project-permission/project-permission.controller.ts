import { Controller, Get, Post, Put, Delete, Param, Body } from "@nestjs/common";
import { ProjectPermissionService } from "../../services/project-permission/project-permission.service";
import {
  type CreateProjectPermissionDto,
  createProjectPermissionSchema,
  type ProjectIdDto,
  projectIdSchema,
  ProjectPermissionDto,
  type UpdateProjectPermissionDto,
  updateProjectPermissionSchema,
} from "@repo/shared-schemas";
import { zodBody, zodParam } from "src/common/pipes/zod";

@Controller("project-permissions")
export class ProjectPermissionController {
  constructor(private readonly projectPermissionService: ProjectPermissionService) {}

  @Post()
  async create(
    @Body(zodBody(createProjectPermissionSchema)) dto: CreateProjectPermissionDto,
  ): Promise<ProjectPermissionDto> {
    return this.projectPermissionService.create(dto);
  }

  @Get(":projectId")
  async find(
    @Param(zodParam(projectIdSchema)) params: ProjectIdDto,
  ): Promise<ProjectPermissionDto> {
    return this.projectPermissionService.find(params.projectId);
  }

  @Get()
  async list(): Promise<ProjectPermissionDto[]> {
    return this.projectPermissionService.list();
  }

  @Put(":projectId")
  async update(
    @Param(zodParam(projectIdSchema)) params: ProjectIdDto,
    @Body(zodBody(updateProjectPermissionSchema)) dto: UpdateProjectPermissionDto,
  ): Promise<ProjectPermissionDto[]> {
    return this.projectPermissionService.update(params.projectId, dto);
  }

  @Delete(":projectId")
  async delete(
    @Param(zodParam(projectIdSchema)) params: ProjectIdDto,
  ): Promise<{ success: boolean }> {
    const result = await this.projectPermissionService.delete(params.projectId);
    return { success: result };
  }
}
