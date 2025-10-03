import { ActivityAttributes, ActivityRelationships } from "../models/activity.model";

export type Activity = ActivityAttributes & Partial<ActivityRelationships>;
