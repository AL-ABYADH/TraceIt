import { z } from "../zod-openapi-init";
import {
  actorsSchema,
  createSecondaryUseCaseSchema,
  createUseCaseSchema,
  primaryUseCaseDetailSchema,
  primaryUseCaseListSchema,
  projectIdSchema,
  secondaryUseCaseDetailSchema,
  secondaryUseCaseListSchema,
  updatePrimaryUseCaseSchema,
  updateSecondaryUseCaseSchema,
  useCaseDetailSchema,
  useCaseDiagramDetailSchema,
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
// export type UpdateDiagramDto = z.infer<typeof updateDiagramSchema>;

/**
 * Actor management types
 */
export type ActorsDto = z.infer<typeof actorsSchema>;
export type UseCaseDetailDto = z.infer<typeof useCaseDetailSchema>;
export type UseCaseDiagramDetailDto = z.infer<
  typeof useCaseDiagramDetailSchema
>;
export type PrimaryUseCaseDetailDto = z.infer<
  typeof primaryUseCaseDetailSchema
>;
export type PrimaryUseCaseListDto = z.infer<typeof primaryUseCaseListSchema>;
export type SecondaryUseCaseDetailDto = z.infer<
  typeof secondaryUseCaseDetailSchema
>;
export type SecondaryUseCaseListDto = z.infer<
  typeof secondaryUseCaseListSchema
>;
