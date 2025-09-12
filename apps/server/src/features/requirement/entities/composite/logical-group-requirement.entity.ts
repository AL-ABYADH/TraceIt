import {
  LogicalGroupRequirementAttributes,
  LogicalGroupRequirementRelationships,
} from "../../models/composite/logical-group-requirement.model";

export type LogicalGroupRequirement = LogicalGroupRequirementAttributes &
  Partial<LogicalGroupRequirementRelationships>;
