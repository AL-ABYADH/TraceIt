import { actorSchema, eventActorSchema } from "../actor";
import {
  dateISOField,
  projectIdFieldDoc,
  projectSchema,
  requirementIdFieldDoc,
  uuidFieldDoc,
} from "../common";
import { useCaseDetailSchema, useCaseListSchema } from "../use-case";
import { z } from "../zod-openapi-init";
import {
  actorIdsFieldDoc,
  alternativeConditionIdsFieldDoc,
  communicationFacilityFieldDoc,
  communicationInfoFieldDoc,
  conditionalValueFieldDoc,
  conditionFieldDoc,
  depthFieldDoc,
  detailRequirementIdsFieldDoc,
  eventActorIdFieldDoc,
  exceptionalFieldDoc,
  exceptionRequirementIdsFieldDoc,
  fallbackConditionIdFieldDoc,
  mainRequirementIdFieldDoc,
  operationFieldDoc,
  primaryConditionIdFieldDoc,
  referencedUseCaseIdFieldDoc,
  requirementTypeEnumDoc,
  simpleRequirementIdsFieldDoc,
  useCaseIdFieldDoc,
} from "./openapi-fields";

/**
 * =========================
 * QUERY SCHEMAS
 * =========================
 */

/** Request payload containing a `useCaseId` to identify a use case. */
export const useCaseIdSchema = z
  .object({
    useCaseId: useCaseIdFieldDoc,
  })
  .openapi({ title: "UseCaseIdDto" });

/** Request payload that specifies a requirement `type` using the shared enum doc. */
export const requirementTypeSchema = z
  .object({
    type: requirementTypeEnumDoc,
  })
  .openapi({ title: "RequirementTypeDto" });

/**
 * =========================
 * CREATE SCHEMAS - SIMPLE REQUIREMENTS
 * =========================
 */

/** DTO used to create a System Requirement (basic system operation requirement). */
export const createSystemRequirementSchema = z
  .object({
    useCaseId: useCaseIdFieldDoc,
    projectId: projectIdFieldDoc,
    depth: depthFieldDoc,
    operation: operationFieldDoc,
  })
  .openapi({ title: "CreateSystemRequirementDto" });

/** DTO used to create an Event System Requirement (system requirement tied to an event actor). */
export const createEventSystemRequirementSchema = z
  .object({
    useCaseId: useCaseIdFieldDoc,
    projectId: projectIdFieldDoc,
    depth: depthFieldDoc,
    operation: operationFieldDoc,
    eventActorId: eventActorIdFieldDoc,
  })
  .openapi({ title: "CreateEventSystemRequirementDto" });

/** DTO used to create an Actor Requirement (requirement that involves one or more actors). */
export const createActorRequirementSchema = z
  .object({
    useCaseId: useCaseIdFieldDoc,
    projectId: projectIdFieldDoc,
    depth: depthFieldDoc,
    operation: operationFieldDoc,
    actorIds: actorIdsFieldDoc,
  })
  .openapi({ title: "CreateActorRequirementDto" });

/**
 * DTO used to create a System↔Actor Communication Requirement.
 * Describes what information is communicated and via which facility, plus actors involved.
 */
export const createSystemActorCommunicationRequirementSchema = z
  .object({
    useCaseId: useCaseIdFieldDoc,
    projectId: projectIdFieldDoc,
    depth: depthFieldDoc,
    communicationInfo: communicationInfoFieldDoc,
    communicationFacility: communicationFacilityFieldDoc,
    actorIds: actorIdsFieldDoc,
  })
  .openapi({ title: "CreateSystemActorCommunicationRequirementDto" });

/** DTO used to create a Conditional Requirement which references another requirement and a condition. */
export const createConditionalRequirementSchema = z
  .object({
    useCaseId: useCaseIdFieldDoc,
    projectId: projectIdFieldDoc,
    depth: depthFieldDoc,
    condition: conditionFieldDoc,
    requirementId: requirementIdFieldDoc,
  })
  .openapi({ title: "CreateConditionalRequirementDto" });

/** DTO to create a Recursive Requirement (references another requirement recursively). */
export const createRecursiveRequirementSchema = z
  .object({
    useCaseId: useCaseIdFieldDoc,
    projectId: projectIdFieldDoc,
    depth: depthFieldDoc,
    requirementId: requirementIdFieldDoc,
  })
  .openapi({ title: "CreateRecursiveRequirementDto" });

/** DTO to create a Use Case Reference Requirement that points to another use case. */
export const createUseCaseReferenceRequirementSchema = z
  .object({
    useCaseId: useCaseIdFieldDoc,
    projectId: projectIdFieldDoc,
    depth: depthFieldDoc,
    referencedUseCaseId: referencedUseCaseIdFieldDoc,
  })
  .openapi({ title: "CreateUseCaseReferenceRequirementDto" });

/**
 * =========================
 * CREATE SCHEMAS - COMPOSITE REQUIREMENTS
 * =========================
 */

/** DTO to create a Logical Group Requirement (main + detail requirements). */
export const createLogicalGroupRequirementSchema = z
  .object({
    useCaseId: useCaseIdFieldDoc,
    projectId: projectIdFieldDoc,
    depth: depthFieldDoc,
    mainRequirementId: mainRequirementIdFieldDoc,
    detailRequirementIds: detailRequirementIdsFieldDoc,
  })
  .openapi({ title: "CreateLogicalGroupRequirementDto" });

/**
 * DTO to create a Conditional Group Requirement.
 * Contains a human-friendly `conditionalValue` and links to primary/alternative/fallback conditions.
 */
export const createConditionalGroupRequirementSchema = z
  .object({
    useCaseId: useCaseIdFieldDoc,
    projectId: projectIdFieldDoc,
    depth: depthFieldDoc,
    conditionalValue: conditionalValueFieldDoc,
    primaryConditionId: primaryConditionIdFieldDoc,
    alternativeConditionIds: alternativeConditionIdsFieldDoc,
    fallbackConditionId: fallbackConditionIdFieldDoc.optional(),
  })
  .openapi({ title: "CreateConditionalGroupRequirementDto" });

/** DTO to create a Simultaneous Requirement (multiple simple requirements executed together). */
export const createSimultaneousRequirementSchema = z
  .object({
    useCaseId: useCaseIdFieldDoc,
    projectId: projectIdFieldDoc,
    depth: depthFieldDoc,
    simpleRequirementIds: simpleRequirementIdsFieldDoc,
  })
  .openapi({ title: "CreateSimultaneousRequirementDto" });

/** DTO to create an Exceptional Requirement (contains exception details and related requirements). */
export const createExceptionalRequirementSchema = z
  .object({
    useCaseId: useCaseIdFieldDoc,
    projectId: projectIdFieldDoc,
    depth: depthFieldDoc,
    exception: exceptionalFieldDoc,
    requirementIds: exceptionRequirementIdsFieldDoc,
  })
  .openapi({ title: "CreateExceptionalRequirementDto" });

/**
 * =========================
 * UPDATE SCHEMAS - SIMPLE REQUIREMENTS
 * =========================
 */

/** DTO for updating System Requirement fields (partial update). */
export const updateSystemRequirementSchema = z
  .object({
    depth: depthFieldDoc.optional(),
    operation: operationFieldDoc.optional(),
  })
  .openapi({ title: "UpdateSystemRequirementDto" });

/** DTO for updating an Event System Requirement (partial update). */
export const updateEventSystemRequirementSchema = z
  .object({
    depth: depthFieldDoc.optional(),
    operation: operationFieldDoc.optional(),
    eventActorId: eventActorIdFieldDoc.optional(),
  })
  .openapi({ title: "UpdateEventSystemRequirementDto" });

/** DTO for updating an Actor Requirement (partial update). */
export const updateActorRequirementSchema = z
  .object({
    depth: depthFieldDoc.optional(),
    operation: operationFieldDoc.optional(),
    actorIds: actorIdsFieldDoc.optional(),
  })
  .openapi({ title: "UpdateActorRequirementDto" });

/**
 * DTO for updating a System↔Actor Communication Requirement.
 * Fields are optional to allow partial updates.
 */
export const updateSystemActorCommunicationRequirementSchema = z
  .object({
    depth: depthFieldDoc.optional(),
    communicationInfo: communicationInfoFieldDoc.optional(),
    communicationFacility: communicationFacilityFieldDoc.optional(),
    actorIds: actorIdsFieldDoc.optional(),
  })
  .openapi({ title: "UpdateSystemActorCommunicationRequirementDto" });

/** DTO for updating a Conditional Requirement (partial update). */
export const updateConditionalRequirementSchema = z
  .object({
    depth: depthFieldDoc.optional(),
    condition: conditionFieldDoc.optional(),
    requirementId: requirementIdFieldDoc.optional(),
  })
  .openapi({ title: "UpdateConditionalRequirementDto" });

/** DTO for updating a Recursive Requirement (partial update). */
export const updateRecursiveRequirementSchema = z
  .object({
    depth: depthFieldDoc.optional(),
    requirementId: requirementIdFieldDoc.optional(),
  })
  .openapi({ title: "UpdateRecursiveRequirementDto" });

/** DTO for updating a Use Case Reference Requirement (partial update). */
export const updateUseCaseReferenceRequirementSchema = z
  .object({
    depth: depthFieldDoc.optional(),
    referencedUseCaseId: referencedUseCaseIdFieldDoc.optional(),
  })
  .openapi({ title: "UpdateUseCaseReferenceRequirementDto" });

/**
 * =========================
 * UPDATE SCHEMAS - COMPOSITE REQUIREMENTS
 * =========================
 */

/** DTO to update a Logical Group Requirement (partial update). */
export const updateLogicalGroupRequirementSchema = z
  .object({
    depth: depthFieldDoc.optional(),
    mainRequirementId: mainRequirementIdFieldDoc.optional(),
    detailRequirementIds: detailRequirementIdsFieldDoc.optional(),
  })
  .openapi({ title: "UpdateLogicalGroupRequirementDto" });

/** DTO to update a Conditional Group Requirement (partial update). */
export const updateConditionalGroupRequirementSchema = z
  .object({
    depth: depthFieldDoc.optional(),
    conditionalValue: conditionalValueFieldDoc.optional(),
    primaryConditionId: primaryConditionIdFieldDoc.optional(),
    alternativeConditionIds: alternativeConditionIdsFieldDoc.optional(),
    fallbackConditionId: fallbackConditionIdFieldDoc.optional(),
  })
  .openapi({ title: "UpdateConditionalGroupRequirementDto" });

/** DTO to update a Simultaneous Requirement (partial update). */
export const updateSimultaneousRequirementSchema = z
  .object({
    depth: depthFieldDoc.optional(),
    simpleRequirementIds: simpleRequirementIdsFieldDoc.optional(),
  })
  .openapi({ title: "UpdateSimultaneousRequirementDto" });

/** DTO to update an Exceptional Requirement (partial update). */
export const updateExceptionalRequirementSchema = z
  .object({
    depth: depthFieldDoc.optional(),
    exception: exceptionalFieldDoc.optional(),
    requirementIds: exceptionRequirementIdsFieldDoc.optional(),
  })
  .openapi({ title: "UpdateExceptionalRequirementDto" });

/** Request payload containing a `requirementId` to identify a requirement. */
export const requirementIdSchema = z.object({
  requirementId: requirementIdFieldDoc,
});

/**
 * Basic attributes for a requirement (List / Attributes)
 */

/** Base attributes common to all requirements (id, depth, timestamps). */
export const requirementListSchema = z
  .object({
    id: uuidFieldDoc,
    depth: depthFieldDoc,
    createdAt: dateISOField,
    updatedAt: dateISOField.optional(),
  })
  .openapi({ title: "RequirementAttributes" });

/** Lightweight alias for simple requirement attributes (keeps shape consistent). */
export const simpleRequirementListSchema = requirementListSchema
  .omit({})
  .extend({})
  .openapi({
    title: "SimpleRequirementAttributes",
  });

/**
 * Relationships for a requirement (reference minimal attribute schemas to avoid circular deps)
 */

/** Minimal relationship block for requirements (references to useCase and project). */
export const requirementRelationshipsSchema = z
  .object({
    useCase: useCaseListSchema.optional(),
    project: projectSchema.optional(),
  })
  .openapi({ title: "RequirementRelationships" });

/** Lightweight alias for simple requirement relationships (keeps shape consistent). */
export const simpleRequirementRelationshipsSchema =
  requirementRelationshipsSchema.omit({}).extend({}).openapi({
    title: "SimpleRequirementRelationships",
  });

/** Full requirement detail merges base attributes and minimal relationships. */
export const requirementDetailSchema = requirementListSchema
  .merge(requirementRelationshipsSchema)
  .openapi({ title: "RequirementDetailDto" });

/**
 * SystemRequirement attributes (List / Attributes)
 * extends the general requirement attributes with `operation`
 */

/** System-specific attributes (adds `operation` to the base requirement attributes). */
export const systemRequirementListSchema = simpleRequirementListSchema
  .omit({})
  .extend({
    operation: operationFieldDoc,
    // createdAt/updatedAt are already present in requirementListSchema
  })
  .openapi({ title: "SystemRequirementAttributes" });

/** SystemRequirement relationships reuse the general simple requirement relationships. */
export const systemRequirementRelationshipsSchema =
  simpleRequirementRelationshipsSchema.openapi({
    title: "SystemRequirementRelationships",
  });

/** SystemRequirement detail = attributes + relationships */
export const systemRequirementDetailSchema = systemRequirementListSchema
  .merge(systemRequirementRelationshipsSchema)
  .openapi({ title: "SystemRequirementDetailDto" });

/**
 * EventSystemRequirement attributes (List / Attributes)
 * extends SimpleRequirementAttributes with `operation`
 */

/** Event-system attributes add `operation` to the base simple requirement attributes. */
export const eventSystemRequirementListSchema = simpleRequirementListSchema
  .omit({})
  .extend({
    operation: operationFieldDoc,
  })
  .openapi({ title: "EventSystemRequirementAttributes" });

/**
 * EventSystemRequirement relationships
 * extends SimpleRequirementRelationships with `event`
 *
 * NOTE: the `event` field references an actor/event actor depending on your model.
 * The line for `eventActorSchema` is left commented in case you prefer a specialized actor type:
 *   // event: eventActorSchema.optional(),
 * Current implemented line uses `actorSchema`.
 */
export const eventSystemRequirementRelationshipsSchema =
  simpleRequirementRelationshipsSchema
    .omit({})
    .extend({
      event: eventActorSchema.optional(),
      // event: actorSchema.optional(),
    })
    .openapi({ title: "EventSystemRequirementRelationships" });

/** EventSystemRequirement detail = attributes + relationships */
export const eventSystemRequirementDetailSchema =
  eventSystemRequirementListSchema
    .merge(eventSystemRequirementRelationshipsSchema)
    .openapi({ title: "EventSystemRequirementDetailDto" });

/**
 * ActorRequirement attributes (List / Attributes)
 * extends SimpleRequirementAttributes with `operation`
 */

/** Actor requirement attributes — adds `operation` on top of simple attributes. */
export const actorRequirementListSchema = simpleRequirementListSchema
  .omit({})
  .extend({
    operation: operationFieldDoc,
  })
  .openapi({ title: "ActorRequirementAttributes" });

/**
 * ActorRequirement relationships
 * extends SimpleRequirementRelationships with `actors` (non-event)
 */

/** Actor requirement relationships include an optional array of actor objects. */
export const actorRequirementRelationshipsSchema =
  simpleRequirementRelationshipsSchema
    .omit({})
    .extend({
      actors: z.array(actorSchema).optional(),
    })
    .openapi({ title: "ActorRequirementRelationships" });

/** ActorRequirement detail = attributes + relationships */
export const actorRequirementDetailSchema = actorRequirementListSchema
  .merge(actorRequirementRelationshipsSchema)
  .openapi({ title: "ActorRequirementDetailDto" });

/**
 * SystemActorCommunicationRequirement
 */

/**
 * Attributes for SystemActorCommunicationRequirement:
 * - communicationInfo: what is communicated
 * - communicationFacility: medium used
 */
export const systemActorCommunicationRequirementListSchema =
  simpleRequirementListSchema
    .omit({})
    .extend({
      communicationInfo: communicationInfoFieldDoc.openapi({
        description: "Information being communicated to the actor",
        example: "user authentication status",
      }),
      communicationFacility: communicationFacilityFieldDoc.openapi({
        description:
          "Facility used for communication (email, notification, etc.)",
        example: "notification",
      }),
    })
    .openapi({ title: "SystemActorCommunicationRequirementAttributesDto" });

/** Relationships for the communication requirement: list of actor objects involved. */
export const systemActorCommunicationRequirementRelationshipsSchema =
  simpleRequirementRelationshipsSchema
    .omit({})
    .extend({
      actors: z
        .array(actorSchema)
        .optional()
        .describe("Array of actors involved in the communication"),
    })
    .openapi({ title: "SystemActorCommunicationRequirementRelationships" });

/** Full schema combining attributes + relationships */
export const systemActorCommunicationRequirementDetailSchema =
  systemActorCommunicationRequirementListSchema
    .merge(systemActorCommunicationRequirementRelationshipsSchema)
    .openapi({ title: "SystemActorCommunicationRequirementDetailDto" });

/**
 * ConditionalRequirement
 */

/** Attributes for a conditional requirement — adds a `condition` field describing the trigger. */
export const conditionalRequirementListSchema = simpleRequirementListSchema
  .omit({})
  .extend({
    condition: conditionFieldDoc.openapi({
      description: "Condition that triggers the requirement",
      example: "user is not authenticated",
    }),
  })
  .openapi({ title: "ConditionalRequirementAttributesListDto" });

/** Relationships for a conditional requirement — references the related requirement (minimal shape). */
export const conditionalRequirementRelationshipsSchema =
  simpleRequirementRelationshipsSchema
    .omit({})
    .extend({
      requirement: simpleRequirementListSchema
        .optional()
        .describe("Related requirement"),
    })
    .openapi({ title: "ConditionalRequirementRelationships" });

/** Full conditional requirement detail schema (attributes + relationships). */
export const conditionalRequirementDetailSchema =
  conditionalRequirementListSchema
    .merge(conditionalRequirementRelationshipsSchema)
    .openapi({ title: "ConditionalRequirementDetailDto" });

/**
 * RecursiveRequirement
 */

/** Attributes schema for a recursive requirement (no extra fields beyond base). */
export const recursiveRequirementListSchema = simpleRequirementListSchema
  .omit({})
  .openapi({ title: "RecursiveRequirementAttributesDto" });

/** Relationships for recursive requirement — references the inner requirement (recursive link). */
export const recursiveRequirementRelationshipsSchema =
  simpleRequirementRelationshipsSchema
    .omit({})
    .extend({
      requirement: simpleRequirementListSchema
        .optional()
        .describe("The referenced requirement in a recursive requirement"),
    })
    .openapi({ title: "RecursiveRequirementRelationships" });

/** Full recursive requirement detail schema (attributes + relationships). */
export const recursiveRequirementDetailSchema = recursiveRequirementListSchema
  .merge(recursiveRequirementRelationshipsSchema)
  .openapi({ title: "RecursiveRequirementDetailDto" });

/**
 * UseCaseReferenceRequirement
 */

/** Attributes for a requirement that references another use case (no extra fields). */
export const useCaseReferenceRequirementListSchema = simpleRequirementListSchema
  .omit({})
  .openapi({ title: "UseCaseReferenceRequirementAttributesDto" });

/** Relationships for a use-case-reference requirement — includes the full referenced use case. */
export const useCaseReferenceRequirementRelationshipsSchema =
  simpleRequirementRelationshipsSchema
    .omit({})
    .extend({
      referencedUseCase: useCaseDetailSchema
        .optional()
        .describe("The referenced use case in this requirement"),
    })
    .openapi({ title: "UseCaseReferenceRequirementRelationships" });

/** Full use-case-reference requirement detail schema (attributes + relationships). */
export const useCaseReferenceRequirementDetailSchema =
  useCaseReferenceRequirementListSchema
    .merge(useCaseReferenceRequirementRelationshipsSchema)
    .openapi({ title: "UseCaseReferenceRequirementDetailDto" });

/**
 * CompositeRequirement (base) and Logical Group
 */

/** Composite requirement base attributes (no extra fields beyond composite marker). */
export const compositeRequirementListSchema = simpleRequirementListSchema
  .omit({})
  .openapi({ title: "CompositeRequirementAttributesDto" });

/** Logical group attributes — inherits composite attributes (no additional fields). */
export const logicalGroupRequirementListSchema = compositeRequirementListSchema
  .omit({})
  .openapi({ title: "LogicalGroupRequirementAttributesDto" });

/**
 * Composite relationships include an array of sub-requirements (minimal shape to avoid cycles).
 */
export const compositeRequirementRelationshipsSchema =
  simpleRequirementRelationshipsSchema
    .omit({})
    .extend({
      subRequirements: z
        .array(requirementListSchema)
        .optional()
        .describe("Array of sub-requirements in the composite requirement"),
    })
    .openapi({ title: "CompositeRequirementRelationships" });

/**
 * Logical group relationships:
 * - mainRequirement: the primary/simple requirement for the group
 * - detailRequirements: array of detail/simple requirements composing the group
 */
export const logicalGroupRequirementRelationshipsSchema =
  compositeRequirementRelationshipsSchema
    .omit({})
    .extend({
      mainRequirement: simpleRequirementListSchema
        .optional()
        .openapi({ title: "LogicalGroupRequirementMainRequirement" }),
      detailRequirements: z
        .array(simpleRequirementListSchema)
        .optional()
        .describe("Array of detail requirements in the logical group"),
    })
    .openapi({ title: "LogicalGroupRequirementRelationships" });

/** Full logical group detail schema (attributes + relationships). */
export const logicalGroupRequirementDetailSchema =
  logicalGroupRequirementListSchema
    .merge(logicalGroupRequirementRelationshipsSchema)
    .openapi({ title: "LogicalGroupRequirementDetailDto" });

/**
 * ConditionalGroupRequirement
 */

/**
 * Conditional group attributes:
 * - conditionalValue is a short noun/phrase describing what the condition targets.
 */
export const conditionalGroupRequirementListSchema =
  compositeRequirementListSchema
    .omit({})
    .extend({
      conditionalValue: conditionalValueFieldDoc.openapi({
        description:
          "Noun phrase describing the conditional value for this conditional group",
        example: "authentication method",
      }),
    })
    .openapi({ title: "ConditionalGroupRequirementAttributesDto" });

/**
 * Conditional group relationships:
 * - primaryCondition: a ConditionalRequirement (minimal list-level shape)
 * - alternativeConditions: array of ConditionalRequirement objects
 * - fallbackCondition: a simple requirement used if other conditions fail
 *
 * NOTE: All relationship fields are optional to reflect `Partial<...>` model shapes.
 */
export const conditionalGroupRequirementRelationshipsSchema =
  compositeRequirementRelationshipsSchema
    .omit({})
    .extend({
      // primaryCondition is a ConditionalRequirement (use the conditionalRequirementListSchema)
      primaryCondition: conditionalRequirementListSchema
        .optional()
        .describe(
          "Primary conditional requirement (may be omitted in model instances)",
        ),

      // alternativeConditions is an array of ConditionalRequirement objects
      alternativeConditions: z
        .array(conditionalRequirementListSchema)
        .optional()
        .describe("Alternative conditional requirements"),

      // fallbackCondition is a RequirementAttributes object (use simpleRequirementListSchema)
      fallbackCondition: simpleRequirementListSchema
        .optional()
        .describe("Fallback condition requirement (single requirement object)"),
    })
    .openapi({ title: "ConditionalGroupRequirementRelationships" });

/** Full Conditional Group detail = attributes + relationships. */
export const conditionalGroupRequirementDetailSchema =
  conditionalGroupRequirementListSchema
    .merge(conditionalGroupRequirementRelationshipsSchema)
    .openapi({ title: "ConditionalGroupRequirementDetailDto" });

/**
 * SimultaneousRequirement
 */

/** Simultaneous requirements attributes (no extra fields beyond composite base). */
export const simultaneousRequirementListSchema = compositeRequirementListSchema
  .omit({})
  .openapi({ title: "SimultaneousRequirementAttributesDto" });

/**
 * Simultaneous relationships:
 * - simpleRequirements: array of simple requirements that run together
 */
export const simultaneousRequirementRelationshipsSchema =
  compositeRequirementRelationshipsSchema
    .omit({})
    .extend({
      simpleRequirements: z
        .array(simpleRequirementListSchema)
        .optional()
        .describe("Array of simple requirements executed simultaneously"),
    })
    .openapi({ title: "SimultaneousRequirementRelationships" });

/** Full Simultaneous Requirement detail = attributes + relationships. */
export const simultaneousRequirementDetailSchema =
  simultaneousRequirementListSchema
    .merge(simultaneousRequirementRelationshipsSchema)
    .openapi({ title: "SimultaneousRequirementDetailDto" });

/**
 * ExceptionalRequirement
 */

/** Exceptional requirement attributes — includes an `exception` descriptor. */
export const exceptionalRequirementListSchema = compositeRequirementListSchema
  .omit({})
  .extend({
    exception: exceptionalFieldDoc,
  })
  .openapi({ title: "ExceptionalRequirementAttributesDto" });

/**
 * Exceptional relationships:
 * - requirements: array of requirement objects that represent handlers or branches for the exception
 */
export const exceptionalRequirementRelationshipsSchema =
  compositeRequirementRelationshipsSchema
    .omit({})
    .extend({
      requirements: z
        .array(requirementListSchema)
        .optional()
        .describe("Array of requirement objects that handle the exception"),
    })
    .openapi({ title: "ExceptionalRequirementRelationships" });

/** Full Exceptional Requirement detail = attributes + relationships. */
export const exceptionalRequirementDetailSchema =
  exceptionalRequirementListSchema
    .merge(exceptionalRequirementRelationshipsSchema)
    .openapi({ title: "ExceptionalRequirementDetailDto" });
