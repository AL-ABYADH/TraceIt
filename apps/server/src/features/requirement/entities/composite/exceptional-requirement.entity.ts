import {
  ExceptionalRequirementAttributes,
  ExceptionalRequirementRelationships,
} from "../../models/composite/exceptional-requirement.model";

export type ExceptionalRequirement = ExceptionalRequirementAttributes &
  Partial<ExceptionalRequirementRelationships>;
