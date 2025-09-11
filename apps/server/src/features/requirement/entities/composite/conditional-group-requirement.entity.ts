import {
  ConditionalGroupRequirementAttributes,
  ConditionalGroupRequirementRelationships,
} from "../../models/composite/conditional-group-requirement.model";

export type ConditionalGroupRequirement = ConditionalGroupRequirementAttributes &
  Partial<ConditionalGroupRequirementRelationships>;
