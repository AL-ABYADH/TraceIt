// schemas/project/types.ts
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
  projectStatusSchema,
  projectActionSchema,
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

export type projectStatusDto = z.infer<typeof projectStatusSchema>;
export type projectActionDto = z.infer<typeof projectActionSchema>;
