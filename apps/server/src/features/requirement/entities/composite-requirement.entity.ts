import {
  CompositeRequirementAttributes,
  CompositeRequirementRelationships,
} from "../models/composite-requirement.model";

export type CompositeRequirement = CompositeRequirementAttributes &
  Partial<CompositeRequirementRelationships>;
