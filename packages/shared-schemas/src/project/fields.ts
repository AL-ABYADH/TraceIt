import { createEnumField, createField } from "../common/field-factory";

// Permissions
export const permissionNameField = createField("string", {
  min: 3,
  max: 50,
  regex: /^(?! )[A-Za-z0-9 _-]*(?<! )$/,
  message:
    "Only letters, numbers, spaces, underscores, hyphens; no leading/trailing spaces.",
});

export const permissionCodeField = createField("string", {
  min: 2,
  max: 50,
  regex: /^[a-zA-Z0-9_]+$/,
  message: "Only letters, numbers, and underscores.",
});

// Roles
export const roleNameField = createField("string", {
  min: 1,
  max: 50,
  regex: /^[a-zA-Z0-9_]+$/,
  message: "Only letters, numbers, and underscores.",
});

export enum ProjectAction {
  ACTIVATE = "ACTIVATE",
  ARCHIVE = "ARCHIVE",
}

export const ProjectActionField = createEnumField(ProjectAction, {
  nullable: false,
  optional: false,
});
export enum ProjectInvitationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DENIED = "DENIED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
}

// Base field (no OpenAPI yet)
export const ProjectInvitationStatusField = createEnumField(
  ProjectInvitationStatus,
);
