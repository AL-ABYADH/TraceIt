import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotImplementedException,
} from "@nestjs/common";
import { ProjectRoleService } from "../../services/project-role/project-role.service";
import { ProjectRole } from "../../entities/project-role.entity";
import { UpdateProjectRoleDto } from "../../dtos/update-project-role.dto";
import { CreateProjectRoleDto } from "../../dtos/create-project-role.dto";

@Controller("project-roles")
export class ProjectRoleController {
  constructor(private readonly projectRoleService: ProjectRoleService) {}

  @Post()
  async create(@Body() dto: CreateProjectRoleDto): Promise<ProjectRole> {
    return this.projectRoleService.create(dto);
  }

  @Get(":id")
  async find(@Param("id") id: string): Promise<ProjectRole> {
    return this.projectRoleService.find(id);
  }

  @Get()
  async list(): Promise<ProjectRole[]> {
    return this.projectRoleService.list();
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateProjectRoleDto): Promise<ProjectRole> {
    return this.projectRoleService.update(id, dto);
  }

  @Delete(":id")
  async delete(@Param("id") id: string): Promise<{ success: boolean }> {
    const result = await this.projectRoleService.delete(id);
    return { success: result };
  }
}
