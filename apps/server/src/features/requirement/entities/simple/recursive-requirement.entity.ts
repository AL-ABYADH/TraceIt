import {
  RecursiveRequirementAttributes,
  RecursiveRequirementRelationships,
} from "../../models/simple/recursive-requirement.model";

export type RecursiveRequirement = RecursiveRequirementAttributes &
  Partial<RecursiveRequirementRelationships>;
