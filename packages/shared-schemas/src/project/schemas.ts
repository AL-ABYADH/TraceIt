import { z } from "../zod-openapi-init";
import {
  projectNameField,
  projectDescriptionField,
  projectUserIdField,
  permissionNameFieldDoc,
  permissionCodeFieldDoc,
  roleNameFieldDoc,
  permissionIdsField,
  roleIdsField,
  projectRoleIdsField,
  expirationDateField,
  projectActionFieldDoc,
  projectInvitationStatusFieldDoc,
} from "./openapi-fields";
import { dateISOField, projectListSchema, uuidFieldDoc } from "../common";
import { safeUserListSchema } from "../user";
import { actorSchema } from "../actor";
import { useCaseDetailSchema } from "../use-case";

export const projectPermissionSchema = z
  .object({
    id: uuidFieldDoc,
    permission: permissionNameFieldDoc,
    code: permissionCodeFieldDoc,
    createdAt: z.union([dateISOField, z.date()]),
    updatedAt: z.union([dateISOField, z.date()]),
  })
  .openapi({ title: "ProjectPermissionDto" });

export const projectRoleSchema = z
  .object({
    id: uuidFieldDoc,
    name: z.string(),
    projectPermissions: z.array(projectPermissionSchema).nullable(),
    // createdAt: z.union([dateISOField, z.date()]),
    // updatedAt: z.union([dateISOField, z.date()]),
  })
  .openapi({ title: "ProjectRoleDto" });

export const projectCollaborationSchema = z
  .object({
    id: uuidFieldDoc,
    user: safeUserListSchema,
    project: projectListSchema, // Use reference schema to avoid circular dependency
    projectRoles: z.array(projectRoleSchema).optional(),
    createdAt: z.union([dateISOField, z.date()]),
    updatedAt: z.union([dateISOField, z.date()]).optional(),
  })
  .openapi({ title: "ProjectCollaborationDto" });

export const createProjectCollaborationSchema = z
  .object({
    projectId: projectUserIdField,
    userId: projectUserIdField,
    roleIds: roleIdsField,
  })
  .openapi({ title: "CreateProjectCollaborationDto" });

export const createProjectSchema = z
  .object({
    name: projectNameField,
    description: projectDescriptionField,
  })
  .openapi({ title: "CreateProjectDto" });

export const updateProjectSchema = z
  .object({
    name: projectNameField.optional(),
    description: projectDescriptionField.optional(),
  })
  .openapi({ title: "UpdateProjectDto" });

export const createProjectPermissionSchema = z
  .object({
    permission: permissionNameFieldDoc,
    code: permissionCodeFieldDoc,
  })
  .openapi({ title: "CreateProjectPermissionDto" });

export const updateProjectPermissionSchema = z
  .object({
    permission: permissionNameFieldDoc,
    code: permissionCodeFieldDoc,
  })
  .openapi({ title: "UpdateProjectPermissionDto" });

export const createProjectRoleSchema = z
  .object({
    name: roleNameFieldDoc,
    permissionIds: permissionIdsField,
  })
  .openapi({ title: "CreateProjectRoleDto" });

export const updateProjectRoleSchema = z
  .object({
    name: roleNameFieldDoc,
    permissionIds: permissionIdsField,
  })
  .openapi({ title: "UpdateProjectRoleDto" });

export const updateProjectCollaborationSchema = z
  .object({
    roleIds: roleIdsField,
  })
  .openapi({ title: "UpdateProjectCollaborationDto" });

export const createProjectInvitationSchema = z
  .object({
    senderId: projectUserIdField,
    receiverId: projectUserIdField,
    projectId: projectUserIdField,
    projectRoleIds: projectRoleIdsField,
    expirationDate: expirationDateField,
  })
  .openapi({ title: "CreateProjectInvitationDto" });

export const projectActionSchema = z.object({
  status: projectActionFieldDoc,
});

export const projectRelationshipsSchema = z
  .object({
    owner: safeUserListSchema,
    collaborations: z.array(projectCollaborationSchema).optional(),
    actors: z.array(actorSchema).optional(),
    useCases: z.array(useCaseDetailSchema).optional(),
    classes: z.array(z.any()).optional(),
  })
  .openapi({ title: "ProjectRelationships" });

export const projectDetailSchema = projectListSchema
  .merge(projectRelationshipsSchema)
  .openapi({ title: "ProjectDetailDto" });

export const projectInvitationSchema = z
  .object({
    id: uuidFieldDoc,
    sender: safeUserListSchema,
    receiver: safeUserListSchema,
    project: projectListSchema,
    projectRoles: z.array(projectRoleSchema).nullable(),
    // expirationDate: dateFieldDoc,
    expirationDate: z.union([dateISOField, z.date()]),
    status: projectInvitationStatusFieldDoc,
    createdAt: z.union([dateISOField, z.date()]),
    updatedAt: z.union([dateISOField, z.date()]).optional(),
  })
  .openapi({ title: "ProjectInvitationDto" });
