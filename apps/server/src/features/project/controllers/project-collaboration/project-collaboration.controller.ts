import { Controller, Delete, NotImplementedException, Param, Put } from "@nestjs/common";
import { ProjectCollaborationService } from "../../services/project-collaboration/project-collaboration.service";

@Controller("project-collaborations")
export class ProjectCollaborationController {
  constructor(private readonly projectCollaborationService: ProjectCollaborationService) {}

  @Put(":id")
  async updateProjectCollaborationRoles() {
    throw new NotImplementedException();
  }

  @Delete(":id")
  async removeProjectCollaboration(@Param("id") id: string): Promise<boolean> {
    throw new NotImplementedException();
  }
}
