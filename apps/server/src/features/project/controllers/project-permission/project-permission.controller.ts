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
import { ProjectPermissionService } from "../../services/project-permission/project-permission.service";
import { ProjectPermission } from "../../entities/project-permission.entity";
import { UpdateProjectPermissionDto } from "../../dtos/update-project-permission.dto";
import { CreateProjectPermissionDto } from "../../dtos/create-project-permission.dto";

@Controller("project-permissions")
export class ProjectPermissionController {
  constructor(private readonly projectPermissionService: ProjectPermissionService) {}

  @Post()
  async create(@Body() dto: CreateProjectPermissionDto): Promise<ProjectPermission> {
    throw new NotImplementedException();
  }

  @Get(":id")
  async find(@Param("id") id: string): Promise<ProjectPermission> {
    throw new NotImplementedException();
  }

  @Get()
  async list(): Promise<ProjectPermission[]> {
    throw new NotImplementedException();
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateProjectPermissionDto,
  ): Promise<ProjectPermission> {
    throw new NotImplementedException();
  }

  @Delete(":id")
  async delete(@Param("id") id: string): Promise<{ success: boolean }> {
    throw new NotImplementedException();
  }
}
