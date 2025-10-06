import { ConditionAttributes, ConditionRelationships } from "../models/condition.model";

export type Condition = ConditionAttributes & Partial<ConditionRelationships>;
