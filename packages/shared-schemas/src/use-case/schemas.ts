import { z } from "zod";
import { addUseCaseFieldsDoc, updateUseCaseFieldsDoc } from "./openapi-fields";

// Schema for adding a use case
export const addUseCaseSchema = z.object({
  name: addUseCaseFieldsDoc.name,
  projectId: addUseCaseFieldsDoc.projectId,
  subType: addUseCaseFieldsDoc.subType,
});

// Schema for updating a use case
export const updateUseCaseSchema = z
  .object({
    name: updateUseCaseFieldsDoc.name,
    briefDescription: updateUseCaseFieldsDoc.briefDescription,
  })
  .partial();

// Schema for use case ID parameters (can reuse a common schema if available)
export const useCaseParamsSchema = z.object({
  id: z.string().uuid(),
});
