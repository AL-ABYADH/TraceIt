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
    throw new NotImplementedException();
  }

  @Get(":id")
  async find(@Param("id") id: string): Promise<ProjectRole> {
    throw new NotImplementedException();
  }

  @Get()
  async list(): Promise<ProjectRole[]> {
    throw new NotImplementedException();
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateProjectRoleDto): Promise<ProjectRole> {
    throw new NotImplementedException();
  }

  @Delete(":id")
  async delete(@Param("id") id: string): Promise<{ success: boolean }> {
    throw new NotImplementedException();
  }
}
