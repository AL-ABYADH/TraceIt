import { EdgeAttributes, EdgeRelationships } from "../models/edge.model";

export type Edge = EdgeAttributes & Partial<EdgeRelationships>;
