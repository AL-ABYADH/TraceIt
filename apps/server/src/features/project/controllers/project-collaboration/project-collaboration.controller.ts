import { Controller, Delete, NotImplementedException, Param, Put } from "@nestjs/common";
import { ProjectCollaborationService } from "../../services/project-collaboration/project-collaboration.service";
import { ProjectCollaboration } from "../../entities/project-collaboration.entity";

@Controller("project-collaborations")
export class ProjectCollaborationController {
  constructor(private readonly projectCollaborationService: ProjectCollaborationService) {}

  @Put(":id")
  async updateProjectCollaborationRoles(): Promise<ProjectCollaboration> {
    throw new NotImplementedException();
  }

  @Delete(":id")
  async removeProjectCollaboration(@Param("id") id: string): Promise<boolean> {
    throw new NotImplementedException();
  }
}
