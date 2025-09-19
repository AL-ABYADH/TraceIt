import { Controller, Get, Post, Put, Delete, Param, Body } from "@nestjs/common";
import { ProjectRoleService } from "../../services/project-role/project-role.service";
import { zodBody, zodParam } from "src/common/pipes/zod";
import {
  type CreateProjectRoleDto,
  createProjectRoleSchema,
  ProjectRoleDto,
  type UpdateProjectRoleDto,
  updateProjectRoleSchema,
  type UuidParamsDto,
  uuidParamsSchema,
} from "@repo/shared-schemas";

@Controller("project-roles")
export class ProjectRoleController {
  constructor(private readonly projectRoleService: ProjectRoleService) {}

  @Post()
  async create(
    @Body(zodBody(createProjectRoleSchema)) dto: CreateProjectRoleDto,
  ): Promise<ProjectRoleDto> {
    return this.projectRoleService.create(dto);
  }

  @Get(":id")
  async find(@Param(zodParam(uuidParamsSchema)) projectId: UuidParamsDto): Promise<ProjectRoleDto> {
    return this.projectRoleService.find(projectId.id);
  }

  @Get()
  async list(): Promise<ProjectRoleDto[]> {
    return this.projectRoleService.list();
  }

  @Put(":id")
  async update(
    @Param(zodParam(uuidParamsSchema)) projectId: UuidParamsDto,
    @Body(zodBody(updateProjectRoleSchema)) dto: UpdateProjectRoleDto,
  ): Promise<ProjectRoleDto> {
    return this.projectRoleService.update(projectId.id, dto);
  }

  @Delete(":id")
  async delete(
    @Param(zodParam(uuidParamsSchema)) projectId: UuidParamsDto,
  ): Promise<{ success: boolean }> {
    const result = await this.projectRoleService.delete(projectId.id);
    return { success: result };
  }
}
