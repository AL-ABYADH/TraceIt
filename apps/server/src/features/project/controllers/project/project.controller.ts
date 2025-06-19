import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UsePipes,
} from "@nestjs/common";
import { ProjectService } from "../../services/project/project.service";
import { Project } from "../../entities/project.entity";
import { CreateProjectDto } from "../../dtos/create-project-params.dto";
import { UpdateProjectDto } from "../../dtos/update-project.dto";
import { InjectUserIdPipe } from "../../../../common/pipes/inject-user-id.pipe";
import { ProjectStatus } from "../../enums/project-status.enum";
import { ProjectCollaboration } from "../../entities/project-collaboration.entity";
import { ProjectCollaborationService } from "../../services/project-collaboration/project-collaboration.service";

@Controller("projects")
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly projectCollaborationService: ProjectCollaborationService,
  ) {}

  @Get()
  async listUserProjects(@Query("status") status: ProjectStatus): Promise<Project[]> {
    return this.projectService.listUserProjects("userId", status);
  }

  @Get(":id")
  async find(@Param("id") id: string): Promise<Project> {
    return this.projectService.find(id);
  }

  @Post()
  @UsePipes(InjectUserIdPipe)
  async create(@Body() dto: CreateProjectDto): Promise<Project> {
    return this.projectService.create(dto);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateProjectDto): Promise<Project> {
    return this.projectService.update(id, dto);
  }

  @Delete(":id")
  async delete(@Param("id") id: string): Promise<{ success: boolean }> {
    const success = await this.projectService.delete(id);
    return { success };
  }

  @Patch(":id/activate")
  async activate(@Param("id") id: string): Promise<{ success: boolean }> {
    const success = await this.projectService.activate(id);
    return { success };
  }

  @Patch(":id/archive")
  async archive(@Param("id") id: string): Promise<{ success: boolean }> {
    const success = await this.projectService.archive(id);
    return { success };
  }

  @Get(":id/project-collaborations")
  async listProjectCollaborations(@Param("id") id: string): Promise<ProjectCollaboration[]> {
    return this.projectCollaborationService.listProjectCollaborations(id);
  }
}
