import {
  RequirementExceptionAttributes,
  RequirementExceptionRelationships,
} from "../models/requirement-exception.model";

export type RequirementException = RequirementExceptionAttributes &
  Partial<RequirementExceptionRelationships>;
