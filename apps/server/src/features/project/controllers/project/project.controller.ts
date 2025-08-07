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
// import { CreateProjectDto } from "../../dtos/create-project.dto";
// import { UpdateProjectDto } from "../../dtos/update-project.dto";
import { InjectUserIdPipe } from "../../../../common/pipes/inject-user-id.pipe";
import { ProjectStatus } from "../../enums/project-status.enum";
import { ProjectCollaboration } from "../../entities/project-collaboration.entity";
import { ProjectCollaborationService } from "../../services/project-collaboration/project-collaboration.service";
import { zodBody, zodParam } from "src/common/pipes/zod";
import {
  type CreateProjectDto,
  createProjectSchema,
  type UpdateProjectDto,
  updateProjectSchema,
  type UuidParamsDto,
  uuidParamsSchema,
} from "@repo/shared-schemas";

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
  async find(@Param(zodParam(uuidParamsSchema)) projectId: UuidParamsDto): Promise<Project> {
    return this.projectService.find(projectId.id);
  }

  @Post()
  @UsePipes(InjectUserIdPipe)
  async create(@Body(zodBody(createProjectSchema)) dto: CreateProjectDto): Promise<Project> {
    return this.projectService.create(dto);
  }

  @Put(":id")
  async update(
    @Param(zodParam(uuidParamsSchema)) projectId: UuidParamsDto,
    @Body(zodBody(updateProjectSchema)) dto: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectService.update(projectId.id, dto);
  }

  @Delete(":id")
  async delete(
    @Param(zodParam(uuidParamsSchema)) projectId: UuidParamsDto,
  ): Promise<{ success: boolean }> {
    const success = await this.projectService.delete(projectId.id);
    return { success };
  }

  @Patch(":id/activate")
  async activate(
    @Param(zodParam(uuidParamsSchema)) projectId: UuidParamsDto,
  ): Promise<{ success: boolean }> {
    const success = await this.projectService.activate(projectId.id);
    return { success };
  }

  @Patch(":id/archive")
  async archive(
    @Param(zodParam(uuidParamsSchema)) projectId: UuidParamsDto,
  ): Promise<{ success: boolean }> {
    const success = await this.projectService.archive(projectId.id);
    return { success };
  }

  @Get(":id/project-collaborations")
  async listProjectCollaborations(
    @Param(zodParam(uuidParamsSchema)) projectId: UuidParamsDto,
  ): Promise<ProjectCollaboration[]> {
    return this.projectCollaborationService.listProjectCollaborations(projectId.id);
  }
}
