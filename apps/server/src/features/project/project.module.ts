import { Module } from "@nestjs/common";
import { ProjectController } from "./controllers/project/project.controller";
import { ProjectRoleController } from "./controllers/project-role/project-role.controller";
import { ProjectInvitationController } from "./controllers/project-invitation/project-invitation.controller";
import { ProjectPermissionController } from "./controllers/project-permission/project-permission.controller";
import { ProjectService } from "./services/project/project.service";
import { ProjectRoleService } from "./services/project-role/project-role.service";
import { ProjectInvitationService } from "./services/project-invitation/project-invitation.service";
import { ProjectPermissionService } from "./services/project-permission/project-permission.service";
import { ProjectRepository } from "./repositories/project/project.repository";
import { ProjectRoleRepository } from "./repositories/project-role/project-role.repository";
import { ProjectInvitationRepository } from "./repositories/project-invitation/project-invitation.repository";
import { ProjectCollaborationRepository } from "./repositories/project-collaboration/project-collaboration.repository";
import { ProjectPermissionRepository } from "./repositories/project-permission/project-permission.repository";
import { ProjectCollaborationService } from "./services/project-collaboration/project-collaboration.service";
import { ProjectCollaborationController } from "./controllers/project-collaboration/project-collaboration.controller";

@Module({
  providers: [
    ProjectService,
    ProjectRepository,
    ProjectRoleService,
    ProjectRoleRepository,
    ProjectInvitationService,
    ProjectInvitationRepository,
    ProjectCollaborationService,
    ProjectCollaborationRepository,
    ProjectPermissionService,
    ProjectPermissionRepository,
  ],
  controllers: [
    ProjectController,
    ProjectRoleController,
    ProjectCollaborationController,
    ProjectInvitationController,
    ProjectPermissionController,
  ],
})
export class ProjectModule {}
