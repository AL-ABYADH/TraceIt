import { ConditionAttributes, ConditionRelationships } from "../models/Condition.model";

export type Condition = ConditionAttributes & Partial<ConditionRelationships>;
