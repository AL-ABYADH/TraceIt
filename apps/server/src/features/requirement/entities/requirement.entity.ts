import { RequirementAttributes, RequirementRelationships } from "../models/requirement.model";

export type Requirement = RequirementAttributes & Partial<RequirementRelationships>;
