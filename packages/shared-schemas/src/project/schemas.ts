import { z } from "../zod-openapi-init";
import {
  expirationDateField,
  permissionCodeFieldDoc,
  permissionIdsField,
  permissionNameFieldDoc,
  ProjectActionFieldDoc,
  projectDescriptionField,
  projectInvitationStatusFieldDoc,
  projectNameField,
  projectRoleIdsField,
  projectUserIdField,
  roleIdsField,
  roleNameFieldDoc,
} from "./openapi-fields";
import { dateISOField, projectSchema, uuidFieldDoc } from "../common";
import { safeUserListSchema } from "../user";
import { actorSchema } from "../actor";
import { useCaseDetailSchema } from "../use-case";

export const projectPermissionSchema = z
  .object({
    id: uuidFieldDoc,
    permission: permissionNameFieldDoc,
    code: permissionCodeFieldDoc,
    createdAt: dateISOField,
    updatedAt: dateISOField.optional(),
  })
  .openapi({ title: "ProjectPermissionDto" });

export const projectRoleSchema = z
  .object({
    id: uuidFieldDoc,
    name: z.string(),
    projectPermissions: z.array(projectPermissionSchema).optional(),
    // createdAt: z.union([dateISOField, z.date()]),
    // updatedAt: z.union([dateISOField, z.date()]),
  })
  .openapi({ title: "ProjectRoleDto" });

export const projectCollaborationSchema = z
  .object({
    id: uuidFieldDoc,
    createdAt: dateISOField,
    updatedAt: dateISOField,
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

export const ProjectActionSchema = z.object({
  status: ProjectActionFieldDoc,
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

export const projectInvitationSchema = z
  .object({
    id: uuidFieldDoc,
    sender: safeUserListSchema.optional(),
    receiver: safeUserListSchema.optional(),
    project: projectSchema.optional(),
    projectRoles: z.array(projectRoleSchema).optional(),
    expirationDate: dateISOField,
    status: projectInvitationStatusFieldDoc,
    createdAt: dateISOField,
    updatedAt: dateISOField.optional(),
  })
  .openapi({ title: "ProjectInvitationDto" });
