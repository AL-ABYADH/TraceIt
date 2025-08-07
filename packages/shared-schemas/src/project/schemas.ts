// schemas/project/schemas.ts
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
} from "./openapi-fields";

export const createProjectSchema = z
  .object({
    name: projectNameField,
    description: projectDescriptionField,
    userId: projectUserIdField,
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
