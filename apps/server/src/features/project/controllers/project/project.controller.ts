import {
  Body,
  Controller,
  Delete,
  Get,
  NotImplementedException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UsePipes,
} from "@nestjs/common";
import { ProjectService } from "../../services/project/project.service";
import { Project } from "../../entities/project.entity";
import { CreateProjectDto } from "../../dtos/create-project.dto";
import { UpdateProjectDto } from "../../dtos/update-project.dto";
import { InjectUserIdPipe } from "../../../../common/pipes/inject-user-id.pipe";
import { ProjectStatus } from "../../enums/project-status.enum";
import { ProjectCollaboration } from "../../entities/project-collaboration.entity";

@Controller("projects")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async listUserProjects(@Query("status") status: ProjectStatus): Promise<Project[]> {
    throw new NotImplementedException();
  }

  @Get(":id")
  async find(@Param("id") id: string): Promise<Project> {
    throw new NotImplementedException();
  }

  @Post()
  @UsePipes(InjectUserIdPipe)
  async create(@Body() dto: CreateProjectDto): Promise<Project> {
    throw new NotImplementedException();
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateProjectDto): Promise<Project> {
    throw new NotImplementedException();
  }

  @Delete(":id")
  async delete(@Param("id") id: string): Promise<{ success: boolean }> {
    throw new NotImplementedException();
  }

  @Patch(":id/activate")
  async activate(@Param("id") id: string): Promise<{ success: boolean }> {
    throw new NotImplementedException();
  }

  @Patch(":id/archive")
  async archive(@Param("id") id: string): Promise<{ success: boolean }> {
    throw new NotImplementedException();
  }

  @Get(":id/project-collaborations")
  async listProjectCollaborations(@Param("id") id: string): Promise<ProjectCollaboration[]> {
    throw new NotImplementedException();
  }
}
