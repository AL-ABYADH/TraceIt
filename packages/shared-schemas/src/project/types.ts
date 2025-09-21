// schemas/project/types.ts
import { projectSchema } from "../common";
import { z } from "../zod-openapi-init";
import {
  createProjectSchema,
  updateProjectSchema,
  createProjectPermissionSchema,
  updateProjectPermissionSchema,
  createProjectRoleSchema,
  updateProjectRoleSchema,
  updateProjectCollaborationSchema,
  createProjectInvitationSchema,
  createProjectCollaborationSchema,
  projectActionSchema,
  projectCollaborationSchema,
  projectRoleSchema,
  projectPermissionSchema,
  projectInvitationSchema,
} from "./schemas";

export type CreateProjectDto = z.infer<typeof createProjectSchema>;
export type UpdateProjectDto = z.infer<typeof updateProjectSchema>;
export type CreateProjectPermissionDto = z.infer<
  typeof createProjectPermissionSchema
>;
export type UpdateProjectPermissionDto = z.infer<
  typeof updateProjectPermissionSchema
>;
export type CreateProjectRoleDto = z.infer<typeof createProjectRoleSchema>;
export type UpdateProjectRoleDto = z.infer<typeof updateProjectRoleSchema>;
export type UpdateProjectCollaborationDto = z.infer<
  typeof updateProjectCollaborationSchema
>;
export type CreateProjectInvitationDto = z.infer<
  typeof createProjectInvitationSchema
>;
export type CreateProjectCollaborationDto = z.infer<
  typeof createProjectCollaborationSchema
>;

export type ProjectRoleDto = z.infer<typeof projectRoleSchema>;
export type ProjectPermissionDto = z.infer<typeof projectPermissionSchema>;
export type ProjectActionDto = z.infer<typeof projectActionSchema>;
export type ProjectDto = z.infer<typeof projectSchema>;
export type ProjectCollaborationDto = z.infer<
  typeof projectCollaborationSchema
>;
export type ProjectInvitationDto = z.infer<typeof projectInvitationSchema>;
