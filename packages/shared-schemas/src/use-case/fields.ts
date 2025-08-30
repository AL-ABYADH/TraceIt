import { z } from "zod";

// Fields for adding a use case
export const addUseCaseFields = {
  name: z.string().min(1).max(100).describe("Use case name"),
  projectId: z
    .string()
    .uuid()
    .describe("The ID of the project to which the use case belongs"),
  subType: z
    .enum(["primary", "secondary", "actor", "diagram", "relationship"])
    .describe("Type of the use case"),
};

// Fields for updating a use case
export const updateUseCaseFields = {
  name: z.string().min(1).max(100).optional().describe("Use case name"),
  briefDescription: z
    .string()
    .max(200)
    .optional()
    .describe("Brief description of the use case"),
};
