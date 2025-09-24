// schemas/project/openapi-fields.ts
import {
  permissionCodeField,
  permissionNameField,
  ProjectAction,
  ProjectActionField,
  projectDescriptionField,
  ProjectInvitationStatus,
  ProjectInvitationStatusField,
  projectNameField,
  projectRoleIdsField,
  roleNameField,
} from "./fields";
// import { uuidField, dateISOField, createField } from "../common";
import {
  createField,
  dateISOField,
  ProjectStatus,
  ProjectStatusField,
  uuidField,
} from "../common";

export const projectNameFieldDoc = projectNameField.openapi({
  example: "Client Website Revamp",
  description: "Name of the project",
});

export const projectDescriptionFieldDoc = projectDescriptionField.openapi({
  example: "Redesign the client-facing web platform",
  description: "Brief summary of the project",
});

export const projectUserIdField = uuidField.openapi({
  example: "82a4e730-2cc9-4ff1-9a88-45e8a763ef9d",
  description: "ID of the project",
});

export const permissionNameFieldDoc = permissionNameField.openapi({
  example: "Edit Tasks",
  description: "Human-readable name of the permission",
});

export const permissionCodeFieldDoc = permissionCodeField.openapi({
  example: "edit_tasks",
  description: "Machine-readable permission code",
});

export const roleNameFieldDoc = roleNameField.openapi({
  example: "admin",
  description: "Name of the project role",
});

export const permissionIdsField = createField("array", {
  elementType: uuidField,
}).openapi({
  example: ["1fa85f64-5717-4562-b3fc-2c963f66afa6"],
  description: "List of permission UUIDs assigned to the role",
});

export const roleIdsField = createField("array", {
  elementType: uuidField,
  description: "List of role IDs to assign to the user",
}).openapi({
  example: [
    "f6e0b4f6-efbb-41c9-9373-12f72bdfcae7",
    "3c5e4f3c-e3f6-4e88-a86b-e7597b4a8d22",
  ],
});

export const projectRoleIdsFieldDoc = projectRoleIdsField.openapi({
  example: [
    "72c61fcd-c0a4-431e-9b61-f5b8d7c87670",
    "c0f8aa3d-f50d-4e0e-81c7-89de0f06c5c5",
  ],
});

export const expirationDateField = dateISOField.openapi({
  example: "2025-12-31T23:59:59.999Z",
  description: "Expiration date for the invitation",
});

export const ProjectActionFieldDoc = ProjectActionField.openapi({
  example: ProjectAction.ACTIVATE,
  description: "The status of the project",
});

export const projectStatusFieldDoc = ProjectStatusField.openapi({
  example: ProjectStatus.ARCHIVED,
  description: "The status of the project",
});

export const projectInvitationStatusFieldDoc =
  ProjectInvitationStatusField.openapi({
    description: "The current status of the project invitation",
    example: ProjectInvitationStatus.ACCEPTED,
  });
