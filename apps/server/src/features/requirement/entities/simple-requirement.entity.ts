import {
  SimpleRequirementAttributes,
  SimpleRequirementRelationships,
} from "../models/simple-requirement.model";

export type SimpleRequirement = SimpleRequirementAttributes &
  Partial<SimpleRequirementRelationships>;
