import { Controller, Get, Post, Put, Delete, Param, Body } from "@nestjs/common";
import { ProjectPermissionService } from "../../services/project-permission/project-permission.service";
import {
  type CreateProjectPermissionDto,
  createProjectPermissionSchema,
  ProjectPermissionDto,
  type UpdateProjectPermissionDto,
  updateProjectPermissionSchema,
  type UuidParamsDto,
  uuidParamsSchema,
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

  @Get(":id")
  async find(
    @Param(zodParam(uuidParamsSchema)) projectId: UuidParamsDto,
  ): Promise<ProjectPermissionDto> {
    return this.projectPermissionService.find(projectId.id);
  }

  @Get()
  async list(): Promise<ProjectPermissionDto[]> {
    return this.projectPermissionService.list();
  }

  @Put(":id")
  async update(
    @Param(zodParam(uuidParamsSchema)) projectId: UuidParamsDto,
    @Body(zodBody(updateProjectPermissionSchema)) dto: UpdateProjectPermissionDto,
  ): Promise<ProjectPermissionDto[]> {
    return this.projectPermissionService.update(projectId.id, dto);
  }

  @Delete(":id")
  async delete(
    @Param(zodParam(uuidParamsSchema)) projectId: UuidParamsDto,
  ): Promise<{ success: boolean }> {
    const result = await this.projectPermissionService.delete(projectId.id);
    return { success: result };
  }
}
