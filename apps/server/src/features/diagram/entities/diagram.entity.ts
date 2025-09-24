import { DiagramAttributes, DiagramRelationships } from "../models/diagram.model";

export type Diagram = DiagramAttributes & Partial<DiagramRelationships>;
