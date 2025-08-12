import { Controller, Get, Post, Put, Delete, Param, Body } from "@nestjs/common";
import { ProjectRoleService } from "../../services/project-role/project-role.service";
import { ProjectRole } from "../../entities/project-role.entity";
// import { UpdateProjectRoleDto } from "../../dtos/update-project-role.dto";
// import { CreateProjectRoleDto } from "../../dtos/create-project-role.dto";
import { zodBody, zodParam } from "src/common/pipes/zod";
import {
  type CreateProjectRoleDto,
  createProjectRoleSchema,
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
  ): Promise<ProjectRole> {
    return this.projectRoleService.create(dto);
  }

  @Get(":id")
  async find(@Param(zodParam(uuidParamsSchema)) projectId: UuidParamsDto): Promise<ProjectRole> {
    return this.projectRoleService.find(projectId.id);
  }

  @Get()
  async list(): Promise<ProjectRole[]> {
    return this.projectRoleService.list();
  }

  @Put(":id")
  async update(
    @Param(zodParam(uuidParamsSchema)) projectId: UuidParamsDto,
    @Body(zodBody(updateProjectRoleSchema)) dto: UpdateProjectRoleDto,
  ): Promise<ProjectRole> {
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
