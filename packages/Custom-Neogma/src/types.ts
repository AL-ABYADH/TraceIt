import { Neo4jSupportedProperties, Neogma, RelationshipsI, WhereParamsI } from "neogma";
import { NeogmaModel } from "./Neogma/normal-model-types";
import { NeogmaModel as AbstractNeogmaModel } from "./Neogma/abstract-model-types";

// =============================================================================
// BASIC TYPES
// =============================================================================

/**
 * Generic record type for any object with string keys
 */
export type AnyObject = Record<string, any>;

/**
 * Schema definition for Neogma models
 */
export type NeogmaSchema<Properties> = {
  [K in keyof Properties]: any;
};

// =============================================================================
// RELATIONSHIP TYPES
// =============================================================================

/**
 * Enhanced relationship definition with cardinality information
 */
export type EnhancedRelationshipsI<RelatedNodes extends AnyObject> = {
  [alias in keyof RelatedNodes]: {
    model: string | NeogmaModel<any, any, any, any> | "self";
    name: string;
    direction: "out" | "in" | "none";
    properties?: RelationshipsI<RelatedNodes>[alias]["properties"];
    cardinality?: "one" | "many"; // Explicit cardinality definition
    inTraceability?: boolean; // Enable traceability features
  };
};

/**
 * Metadata about a relationship between nodes
 */
export interface RelationshipInfo {
  direction: "out" | "in" | "none";
  name: string;
  properties?: Record<string, any>;
}

/**
 * Configuration for dynamically loading relationships at runtime
 */
export interface DynamicRelation {
  name: string; // Relationship name in the database
  alias?: string; // Name to use in the result (defaults to name)
  direction?: "out" | "in" | "none"; // Direction of relationship (defaults to 'out')
  targetLabel?: string; // Target node label
  limit?: number; // Maximum number of related nodes to return
  many?: boolean; // Is this a one-to-many relationship? (defaults to true)
}

/**
 * Options for fetching node relationships
 */
export interface FetchRelationsOptions {
  include?: string[]; // Relationships to include (if empty, include all)
  exclude?: string[]; // Relationships to exclude
  limits?: Record<string, number>; // Maximum number of related nodes per relationship
  session?: any; // Database session for transaction handling
  direction?: "out" | "in" | "none"; // Override default relationship direction
  includeRelationshipInfo?: boolean; // Include relationship metadata in results
  dynamicRelations?: DynamicRelation[]; // Dynamic relationships to load
}

/**
 * Extended options for finding entities with their relationships
 */
export interface FindWithRelationsOptions extends FetchRelationsOptions {
  where?: WhereParamsI; // Conditions to filter entities
  limit?: number; // Maximum number of entities to return
  skip?: number; // Number of entities to skip
  order?: Array<[string, "ASC" | "DESC"]>; // Ordering criteria
  throwIfNotFound?: boolean; // Throw error if entity not found
  throwIfNoneFound?: boolean; // Throw error if no entities found
  plain?: boolean; // Return plain objects instead of model instances
}

// =============================================================================
// MODEL DEFINITION TYPES
// =============================================================================

/**
 * Parameters for creating a Neogma model
 */
export interface ModelParams<
  Properties extends Neo4jSupportedProperties,
  RelatedNodes extends AnyObject,
  Methods extends AnyObject,
  Statics extends AnyObject,
> {
  name: string; // Model name
  inTraceability?: boolean; // Enable traceability features
  schema: NeogmaSchema<
    Omit<Properties, "id" | "createdAt" | "updatedAt" | "needsUpdate" | "needsDelete">
  >; // Model schema definition
  label: string[]; // Node labels in Neo4j
  statics?: Partial<Statics>; // Static methods for the Model
  methods?: Partial<Methods>; // Instance methods
  primaryKeyField?: Extract<keyof Properties, string>; // Primary key field name
  relationships?: Partial<EnhancedRelationshipsI<RelatedNodes>>; // Relationship definitions
}

/**
 * Factory function definition for creating concrete Neogma models
 */
export interface ModelFactoryDefinition<
  Properties extends Neo4jSupportedProperties,
  RelatedNodes extends AnyObject = AnyObject,
  Methods extends AnyObject = AnyObject,
  Statics extends AnyObject = AnyObject,
> {
  (neogma: Neogma): NeogmaModel<Properties, RelatedNodes, Methods, Statics>;
  parameters: ModelParams<Properties, RelatedNodes, Methods, Statics>;
}

/**
 * Factory function definition for creating abstract Neogma models
 */
export interface AbstractModelFactoryDefinition<
  Properties extends Neo4jSupportedProperties,
  RelatedNodes extends AnyObject = AnyObject,
  Methods extends AnyObject = AnyObject,
  Statics extends AnyObject = AnyObject,
> {
  (neogma: Neogma): AbstractNeogmaModel<Properties, RelatedNodes, Methods, Statics>;
  parameters: ModelParams<Properties, RelatedNodes, Methods, Statics>;
}
