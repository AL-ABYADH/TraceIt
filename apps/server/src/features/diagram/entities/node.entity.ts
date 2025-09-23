import { NodeAttributes, NodeRelationships } from "../models/node.model";

export type Node = NodeAttributes & Partial<NodeRelationships>;
