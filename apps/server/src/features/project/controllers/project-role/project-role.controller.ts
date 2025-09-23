import { Controller, Get, Post, Put, Delete, Param, Body } from "@nestjs/common";
import { ProjectRoleService } from "../../services/project-role/project-role.service";
import { zodBody, zodParam } from "src/common/pipes/zod";
import {
  type CreateProjectRoleDto,
  createProjectRoleSchema,
  type ProjectIdDto,
  projectIdSchema,
  ProjectRoleDto,
  type UpdateProjectRoleDto,
  updateProjectRoleSchema,
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

  @Get(":projectId")
  async find(@Param(zodParam(projectIdSchema)) params: ProjectIdDto): Promise<ProjectRoleDto> {
    return this.projectRoleService.find(params.projectId);
  }

  @Get()
  async list(): Promise<ProjectRoleDto[]> {
    return this.projectRoleService.list();
  }

  @Put(":projectId")
  async update(
    @Param(zodParam(projectIdSchema)) params: ProjectIdDto,
    @Body(zodBody(updateProjectRoleSchema)) dto: UpdateProjectRoleDto,
  ): Promise<ProjectRoleDto> {
    return this.projectRoleService.update(params.projectId, dto);
  }

  @Delete(":projectId")
  async delete(
    @Param(zodParam(projectIdSchema)) params: ProjectIdDto,
  ): Promise<{ success: boolean }> {
    const result = await this.projectRoleService.delete(params.projectId);
    return { success: result };
  }
}
