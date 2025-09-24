import { z } from "../zod-openapi-init";
import {
  actorsSchema,
  createDiagramSchema,
  createSecondaryUseCaseSchema,
  createPrimaryUseCaseSchema,
  primaryUseCaseDetailSchema,
  primaryUseCaseListSchema,
  projectIdSchema,
  secondaryUseCaseDetailSchema,
  secondaryUseCaseListSchema,
  updateDiagramSchema,
  updatePrimaryUseCaseSchema,
  updateSecondaryUseCaseSchema,
  useCaseDetailSchema,
  useCaseDiagramDetailSchema,
  primaryUseCaseIdSchema,
  secondaryUseCaseIdSchema,
  useCaseListSchema,
} from "./schemas";

/**
 * Primary and project-related types
 */
export type CreatePrimaryUseCaseDto = z.infer<
  typeof createPrimaryUseCaseSchema
>;
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
export type UseCaseListDto = z.infer<typeof useCaseListSchema>;
export type SecondaryUseCaseDetailDto = z.infer<
  typeof secondaryUseCaseDetailSchema
>;
export type SecondaryUseCaseListDto = z.infer<
  typeof secondaryUseCaseListSchema
>;

export type CreateDiagramDto = z.infer<typeof createDiagramSchema>;
export type UpdateDiagramDto = z.infer<typeof updateDiagramSchema>;
export type PrimaryUseCaseIdDto = z.infer<typeof primaryUseCaseIdSchema>;
export type SecondaryUseCaseIdDto = z.infer<typeof secondaryUseCaseIdSchema>;
