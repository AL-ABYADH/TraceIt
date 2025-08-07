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

// import { z } from "../zod-openapi-init";
// import {
//   uuidField,
//   nameField,
//   descriptionField,
//   dateField,
// } from "../common/schemas";

// // ========================
// // Project
// // ========================
// export const createProjectSchema = z
//   .object({
//     name: nameField.openapi({
//       example: "Client Website Revamp",
//       description: "Name of the project",
//     }),
//     description: descriptionField.nullable().openapi({
//       example: "Redesign the client-facing web platform",
//       description: "Brief summary of the project",
//     }),
//     userId: uuidField.openapi({
//       example: "82a4e730-2cc9-4ff1-9a88-45e8a763ef9d",
//       description: "ID of the user who owns the project",
//     }),
//   })
//   .openapi({
//     title: "CreateProjectDto",
//     description: "Schema for creating a new project",
//   });

// export const updateProjectSchema = z
//   .object({
//     name: nameField.optional().openapi({
//       example: "New Project Name",
//       description: "Updated project name",
//     }),
//     description: descriptionField.nullable().optional().openapi({
//       example: "Updated project description",
//       description: "Updated description of the project",
//     }),
//   })
//   .openapi({
//     title: "UpdateProjectDto",
//     description: "Schema for updating an existing project",
//   });

// // ========================
// // Project Permission
// // ========================
// const permissionNameField = z
//   .string()
//   .min(3)
//   .max(50)
//   .regex(/^(?! )[A-Za-z0-9 _-]*(?<! )$/, {
//     message:
//       "Only letters, numbers, spaces, underscores, hyphens; no leading/trailing spaces.",
//   });

// const permissionCodeField = z
//   .string()
//   .min(2)
//   .max(50)
//   .regex(/^[a-zA-Z0-9_]+$/, {
//     message: "Only letters, numbers, and underscores.",
//   });

// export const createProjectPermissionSchema = z
//   .object({
//     permission: permissionNameField.openapi({
//       example: "Edit Tasks",
//       description: "Human-readable name of the permission",
//     }),
//     code: permissionCodeField.openapi({
//       example: "edit_tasks",
//       description: "Machine-readable permission code",
//     }),
//   })
//   .openapi({
//     title: "CreateProjectPermissionDto",
//     description: "Schema for creating a project permission",
//   });

// export const updateProjectPermissionSchema = z
//   .object({
//     permission: permissionNameField.openapi({
//       example: "Delete Tasks",
//       description: "Updated name of the permission",
//     }),
//     code: permissionCodeField.openapi({
//       example: "delete_tasks",
//       description: "Updated code of the permission",
//     }),
//   })
//   .openapi({
//     title: "UpdateProjectPermissionDto",
//     description: "Schema for updating a project permission",
//   });

// // ========================
// // Project Role
// // ========================
// const roleNameField = z
//   .string()
//   .min(1)
//   .max(50)
//   .regex(/^[a-zA-Z0-9_]+$/, {
//     message: "Only letters, numbers, and underscores.",
//   });

// export const createProjectRoleSchema = z
//   .object({
//     name: roleNameField.openapi({
//       example: "admin",
//       description: "Name of the project role",
//     }),
//     permissionIds: z
//       .array(uuidField)
//       .openapi({
//         example: ["1fa85f64-5717-4562-b3fc-2c963f66afa6"],
//         description: "List of permission UUIDs assigned to the role",
//       }),
//   })
//   .openapi({
//     title: "CreateProjectRoleDto",
//     description: "Schema for creating a project role",
//   });

// export const updateProjectRoleSchema = z
//   .object({
//     name: roleNameField.openapi({
//       example: "editor",
//       description: "Updated name of the project role",
//     }),
//     permissionIds: z
//       .array(uuidField)
//       .openapi({
//         example: ["2c963f66-afa6-4562-b3fc-1fa85f645717"],
//         description: "Updated list of permission UUIDs",
//       }),
//   })
//   .openapi({
//     title: "UpdateProjectRoleDto",
//     description: "Schema for updating a project role",
//   });

// // ========================
// // Project Collaboration
// // ========================
// export const updateProjectCollaborationSchema = z
//   .object({
//     roleIds: z
//       .array(uuidField)
//       .openapi({
//         example: [
//           "f6e0b4f6-efbb-41c9-9373-12f72bdfcae7",
//           "3c5e4f3c-e3f6-4e88-a86b-e7597b4a8d22",
//         ],
//         description: "List of role IDs to assign to the user",
//       }),
//   })
//   .openapi({
//     title: "UpdateProjectCollaborationDto",
//     description: "Schema for updating roles assigned in a collaboration",
//   });

// // ========================
// // Project Invitation
// // ========================
// export const createProjectInvitationSchema = z
//   .object({
//     senderId: uuidField.openapi({
//       example: "76f6f69a-cb8d-489d-9841-dc4452e907c6",
//       description: "UUID of the user sending the invitation",
//     }),
//     receiverId: uuidField.openapi({
//       example: "c8824c55-0001-4a5b-bd88-beb5e6809e25",
//       description: "UUID of the user receiving the invitation",
//     }),
//     projectId: uuidField.openapi({
//       example: "48e3211d-ec9f-4eeb-8de9-1e7a735c2e9a",
//       description: "UUID of the project being shared",
//     }),
//     projectRoleIds: z
//       .array(uuidField)
//       .openapi({
//         example: [
//           "72c61fcd-c0a4-431e-9b61-f5b8d7c87670",
//           "c0f8aa3d-f50d-4e0e-81c7-89de0f06c5c5",
//         ],
//         description: "Role IDs to assign to the invited user",
//       }),
//     expirationDate: dateField.openapi({
//       example: "2025-12-31T23:59:59.999Z",
//       description: "Expiration date for the invitation",
//     }),
//   })
//   .openapi({
//     title: "CreateProjectInvitationDto",
//     description: "Schema for inviting a user to collaborate on a project",
//   });

// // ========================
// // Type Aliases
// // ========================
// export type CreateProjectDto = z.infer<typeof createProjectSchema>;
// export type UpdateProjectDto = z.infer<typeof updateProjectSchema>;
// export type CreateProjectPermissionDto = z.infer<typeof createProjectPermissionSchema>;
// export type UpdateProjectPermissionDto = z.infer<typeof updateProjectPermissionSchema>;
// export type CreateProjectRoleDto = z.infer<typeof createProjectRoleSchema>;
// export type UpdateProjectRoleDto = z.infer<typeof updateProjectRoleSchema>;
// export type UpdateProjectCollaborationDto = z.infer<typeof updateProjectCollaborationSchema>;
// export type CreateProjectInvitationDto = z.infer<typeof createProjectInvitationSchema>;
