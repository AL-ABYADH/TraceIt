import { descriptionField, nameField, uuidField } from "../common";
import { createEnumField, createField } from "../common/field-factory";
import { z } from "../zod-openapi-init";

export const permissionNameField = createField("string", {
  min: 3,
  max: 50,
  regex: /^(?! )[A-Za-z0-9 _-]*(?<! )$/,
  message: "Only letters, numbers, spaces, underscores, hyphens.",
});

export const permissionCodeField = createField("string", {
  min: 2,
  max: 50,
  regex: /^[a-zA-Z0-9_]+$/,
  message: "Only letters, numbers, and underscores.",
});

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
export const projectRoleIdsField = createField("array", {
  elementType: uuidField,
  description: "Role IDs to assign to the invited user",
});

export const ProjectActionField = createEnumField(ProjectAction, {
  nullable: false,
  optional: false,
});

// export const projectStatusField = createEnumField(["active", "archived"], {
//   nullable: true,
//   optional: true,
// });

export enum ProjectInvitationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DENIED = "DENIED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
}

export const ProjectInvitationStatusField = createEnumField(ProjectInvitationStatus);

export const projectDescriptionField = z
  .string()
  .min(3, { message: "Description must be at least 3 characters long." })
  .max(1000, { message: "Description must be at most 1000 characters long." })
  .regex(/^(?! )[A-Za-z0-9 _-]*(?<! )$/, {
    message:
      "Description is not valid. It can only contain letters, numbers, spaces, underscores, hyphens, and must not start or end with a space.",
  })
  .optional(); // because description is not required

export const projectNameField = createField("string", {
  max: 50,
  maxMessage: "Project Name should not exceed 50 characters",
});
