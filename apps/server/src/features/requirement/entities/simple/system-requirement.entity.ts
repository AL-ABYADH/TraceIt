import {
  SystemRequirementAttributes,
  SystemRequirementRelationships,
} from "../../models/simple/system-requirement.model";

export type SystemRequirement = SystemRequirementAttributes &
  Partial<SystemRequirementRelationships>;
