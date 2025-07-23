import { Controller, Get, Post, Put, Delete, Param, Body } from "@nestjs/common";
import { ProjectPermissionService } from "../../services/project-permission/project-permission.service";
import { ProjectPermission } from "../../entities/project-permission.entity";
import { UpdateProjectPermissionDto } from "../../dtos/update-project-permission.dto";
import { CreateProjectPermissionDto } from "../../dtos/create-project-permission.dto";

@Controller("project-permissions")
export class ProjectPermissionController {
  constructor(private readonly projectPermissionService: ProjectPermissionService) {}

  @Post()
  async create(@Body() dto: CreateProjectPermissionDto): Promise<ProjectPermission> {
    return this.projectPermissionService.create(dto);
  }

  @Get(":id")
  async find(@Param("id") id: string): Promise<ProjectPermission> {
    return this.projectPermissionService.find(id);
  }

  @Get()
  async list(): Promise<ProjectPermission[]> {
    return this.projectPermissionService.list();
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateProjectPermissionDto,
  ): Promise<ProjectPermission> {
    return this.projectPermissionService.update(id, dto);
  }

  @Delete(":id")
  async delete(@Param("id") id: string): Promise<{ success: boolean }> {
    const result = await this.projectPermissionService.delete(id);
    return { success: result };
  }
}
