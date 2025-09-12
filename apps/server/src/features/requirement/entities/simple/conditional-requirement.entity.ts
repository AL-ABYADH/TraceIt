import {
  ConditionalRequirementAttributes,
  ConditionalRequirementRelationships,
} from "../../models/simple/conditional-requirement.model";

export type ConditionalRequirement = ConditionalRequirementAttributes &
  Partial<ConditionalRequirementRelationships>;
