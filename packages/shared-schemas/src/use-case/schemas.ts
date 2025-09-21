import { actorSchema } from "../actor";
import {
  dateFieldDoc,
  projectIdFieldDoc,
  projectSchema,
  uuidFieldDoc,
} from "../common";
import { z } from "../zod-openapi-init";
import { finalStateField, initialStateField } from "./fields";
import {
  useCaseNameFieldDoc,
  useCaseDescriptionFieldDoc,
  primaryActorIdsFieldDoc,
  secondaryActorIdsFieldDoc,
  primaryUseCaseIdFieldDoc,
  initialStateFieldDoc,
  finalStateFieldDoc,
  useCaseIdsFieldDoc,
  useCaseImportanceEnumDoc,
  actorsIdsFieldDoc,
} from "./openapi-fields";

/**
 * =========================
 * PROJECT IDENTIFIER SCHEMA
 * =========================
 */
export const projectIdSchema = z
  .object({
    projectId: uuidFieldDoc,
  })
  .openapi({ title: "ProjectIdDto" });

export const secondaryUseCaseIdSchema = z
  .object({
    secondaryUseCaseId: uuidFieldDoc,
  })
  .openapi({ title: "SecondaryUseCaseIdDto" });

export const useCaseDiagramIdSchema = z
  .object({
    useCaseDiagramId: uuidFieldDoc,
  })
  .openapi({ title: "UseCaseDiagramIdDto" });
export const primaryUseCaseIdSchema = z
  .object({
    primaryUseCaseId: uuidFieldDoc,
  })
  .openapi({ title: "PrimaryUseCaseIdDto" });

/**
 * =========================
 * PRIMARY USE CASE SCHEMAS
 * =========================
 */
export const createPrimaryUseCaseSchema = z
  .object({
    name: useCaseNameFieldDoc,
    projectId: projectIdFieldDoc,
    primaryActorIds: primaryActorIdsFieldDoc,
    secondaryActorIds: secondaryActorIdsFieldDoc,
    description: useCaseDescriptionFieldDoc.optional(),
    importanceLevel: useCaseImportanceEnumDoc.optional(),
  })
  .openapi({ title: "CreateUseCaseDto" });

export const updatePrimaryUseCaseSchema = z
  .object({
    name: useCaseNameFieldDoc.optional(),
    description: useCaseDescriptionFieldDoc.optional(),
    primaryActorIds: primaryActorIdsFieldDoc.optional(),
    secondaryActorIds: secondaryActorIdsFieldDoc.optional(),
    importanceLevel: useCaseImportanceEnumDoc.optional(),
  })
  .openapi({ title: "UpdatePrimaryUseCaseDto" });

/**
 * =========================
 * SECONDARY USE CASE SCHEMAS
 * =========================
 */
export const createSecondaryUseCaseSchema = z
  .object({
    name: useCaseNameFieldDoc,
    projectId: projectIdFieldDoc,
    primaryUseCaseId: primaryUseCaseIdFieldDoc,
  })
  .openapi({ title: "CreateSecondaryUseCaseDto" });

export const updateSecondaryUseCaseSchema = z
  .object({
    name: useCaseNameFieldDoc.optional(),
    primaryUseCaseId: primaryUseCaseIdFieldDoc.optional(),
  })
  .openapi({ title: "UpdateSecondaryUseCaseDto" });

/**
 * =========================
 * USE CASE DIAGRAM SCHEMAS
 * =========================
 */
export const createDiagramSchema = z
  .object({
    projectId: projectIdFieldDoc,
    initial: initialStateFieldDoc,
    final: finalStateFieldDoc.optional(),
    useCaseIds: useCaseIdsFieldDoc.optional(),
  })
  .openapi({ title: "CreateDiagramDto" });

export const updateDiagramSchema = z
  .object({
    initial: initialStateFieldDoc.optional(),
    final: finalStateFieldDoc.optional(),
  })
  .openapi({ title: "UpdateDiagramDto" });

/**
 * =========================
 * ACTOR MANAGEMENT SCHEMAS
 * =========================
 */
export const actorsSchema = z.object({
  actorIds: actorsIdsFieldDoc,
});

export const useCaseDiagramAttributesSchema = z
  .object({
    id: uuidFieldDoc,
    initial: initialStateField,
    final: finalStateField.optional(),
    createdAt: dateFieldDoc,
    updatedAt: dateFieldDoc.optional(),
  })
  .openapi({ title: "UseCaseDiagramAttributes" });

export const useCaseListSchema = z
  .object({
    id: uuidFieldDoc,
    name: useCaseNameFieldDoc,
    createdAt: dateFieldDoc,
    updatedAt: dateFieldDoc.optional(),
  })
  .openapi({ title: "UseCaseAttributes" });

// export const useCaseRelationshipsSchema = z
//   .object({
//     project: projectSchema.optional().describe("Project this use case belongs to"),
//     requirements: z.array(requirementListSchema).optional().describe(
//       "Array of requirements associated with this use case"
//     ),
//     includedUseCases: z.array(useCaseListSchema).optional().describe(
//       "Array of included use cases"
//     ),
//     extendedUseCases: z.array(useCaseListSchema).optional().describe(
//       "Array of extended use cases"
//     ),
//   })
//   .openapi({
//     title: "UseCaseRelationships",
//     description: "Relationships of a use case with project, requirements, and other use cases",
//   });

// export const primaryUseCaseAttributesSchema = useCaseAttributesSchema.extend({
//   description: z.string().optional().openapi({
//     description: "Optional description of the primary use case",
//     example: "Allows a user to register for an account"
//   }),
// }).openapi({
//   title: "PrimaryUseCaseAttributes",
//   description: "Represents attributes of a primary use case, including optional description",
// });

export const primaryUseCaseListSchema = useCaseListSchema
  .omit({})
  .extend({
    description: z.string().optional().openapi({
      description: "Optional description of the primary use case",
      example: "Allows a user to register for an account",
    }),
  })
  .openapi({
    title: "PrimaryUseCaseAttributes",
    description:
      "Represents attributes of a primary use case, including optional description",
  });

export const secondaryUseCaseListSchema = useCaseListSchema.openapi({
  title: "SecondaryUseCaseAttributes",
  description: "Represents attributes of a secondary use case",
});

export const primaryUseCaseRelationshipsSchema = z
  .object({
    primaryActors: z.array(actorSchema).optional(),
    secondaryActors: z.array(actorSchema).optional(),
    secondaryUseCases: z.array(secondaryUseCaseListSchema).optional(),
    classes: z.any().optional(),
  })
  .openapi({
    title: "PrimaryUseCaseRelationships",
    description:
      "Relationships of the primary use case with actors and other use cases",
  });

export const primaryUseCaseDetailSchema = primaryUseCaseListSchema
  .merge(primaryUseCaseRelationshipsSchema)
  .openapi({ title: "PrimaryUseCaseDetailDto" });

export const useCaseRelationshipsSchema = z
  .object({
    project: projectSchema.optional(),
    requirements: z.array(z.any()).optional(),
    includedUseCases: z.array(useCaseListSchema).optional(),
    extendedUseCases: z.array(useCaseListSchema).optional(),
  })
  .openapi({ title: "UseCaseRelationships" });

export const useCaseDetailSchema = useCaseListSchema
  .merge(useCaseRelationshipsSchema)
  .openapi({ title: "UseCaseDetailDto" });

export const secondaryUseCaseRelationshipSchema = useCaseRelationshipsSchema
  .omit({})
  .extend({
    primaryUseCase: primaryUseCaseDetailSchema.optional(),
  })
  .openapi({
    title: "SecondaryUseCaseRelationships",
    description:
      "Relationships of a secondary use case, including its primary use case and other dependencies",
  });

export const secondaryUseCaseDetailSchema = secondaryUseCaseListSchema
  .merge(secondaryUseCaseRelationshipSchema)
  .openapi({
    title: "SecondaryUseCaseDetailDto",
    description:
      "Detailed view of a secondary use case including its attributes and relationships",
  });

// export const useCaseDiagramRelationshipsSchema = z
//   .object({
//     useCases: useCaseAttributesSchema, // single object or maybe array? You defined as single, so single here
//     project: projectSchema.optional(),
//     actors: actorSchema, // you need to have this schema similar to useCaseAttributesSchema
//   })
//   .openapi({ title: "UseCaseDiagramRelationships" });

export const useCaseDiagramRelationshipsSchema = z
  .object({
    useCases: useCaseListSchema.optional(), // Keep as single object but make optional
    project: projectSchema.optional(),
    actors: actorSchema.optional(), // Keep as single object but make optional
  })
  .openapi({ title: "UseCaseDiagramRelationships" });

export const useCaseDiagramDetailSchema = useCaseDiagramAttributesSchema
  .merge(useCaseDiagramRelationshipsSchema)
  .openapi({ title: "UseCaseDiagramResponseDto" });
