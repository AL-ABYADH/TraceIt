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
  useCaseDiagramDetailSchema,
  primaryUseCaseDetailSchema,
  useCaseDetailSchema,
  primaryUseCaseListSchema,
  secondaryUseCaseDetailSchema,
  secondaryUseCaseListSchema,
  secondaryUseCaseIdSchema,
  usecaseDiagramIdSchema,
  primaryUsecaseIdSchema,
} from "./schemas";

/**
 * Primary and project-related types
 */
export type CreateUseCaseDto = z.infer<typeof createUseCaseSchema>;
export type ProjectIdDto = z.infer<typeof projectIdSchema>;
export type SecondaryUseCaseIdDto = z.infer<typeof secondaryUseCaseIdSchema>;
export type UsecaseDiagramIdDto = z.infer<typeof usecaseDiagramIdSchema>;
export type PrimaryUseCaseIdDto = z.infer<typeof primaryUsecaseIdSchema>;
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
