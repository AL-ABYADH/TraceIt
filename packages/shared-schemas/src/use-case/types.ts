import { z } from "../zod-openapi-init";
import {
  createUseCaseSchema,
  projectIdSchema,
  updatePrimaryUseCaseSchema,
  createSecondaryUseCaseSchema,
  updateSecondaryUseCaseSchema,
  createDiagramSchema,
  updateDiagramSchema,
  actorsSchema,
} from "./schemas";

/**
 * Primary and project-related types
 */
export type CreateUseCaseDto = z.infer<typeof createUseCaseSchema>;
export type ProjectIdDto = z.infer<typeof projectIdSchema>;
export type UpdatePrimaryUseCaseDto = z.infer<
  typeof updatePrimaryUseCaseSchema
>;

/**
 * Secondary use case types
 */
export type CreateSecondaryUseCaseDto = z.infer<
  typeof createSecondaryUseCaseSchema
>;
export type UpdateSecondaryUseCaseDto = z.infer<
  typeof updateSecondaryUseCaseSchema
>;

/**
 * Diagram types
 */
export type CreateDiagramDto = z.infer<typeof createDiagramSchema>;
export type UpdateDiagramDto = z.infer<typeof updateDiagramSchema>;

/**
 * Actor management types
 */
export type ActorsDto = z.infer<typeof actorsSchema>;
