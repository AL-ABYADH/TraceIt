import {
  UseCaseDiagramAttributes,
  UseCaseDiagramRelationships,
} from "../models/use-case-diagram.model";

export type UseCaseDiagram = UseCaseDiagramAttributes & Partial<UseCaseDiagramRelationships>;
