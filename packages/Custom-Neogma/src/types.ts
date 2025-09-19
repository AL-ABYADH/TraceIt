import { Neo4jSupportedProperties, Neogma, RelationshipsI, WhereParamsI } from "neogma";
import { NeogmaModel } from "./Neogma/normal-model-types";
import { NeogmaModel as AbstractNeogmaModel } from "./Neogma/abstract-model-types";
// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface ModelParams<
  Properties extends Neo4jSupportedProperties,
  RelatedNodes extends AnyObject,
  Methods extends AnyObject,
  Statics extends AnyObject,
> {
  name: string;
  inTraceability?: boolean;
  schema: NeogmaSchema<
    Omit<Properties, "id" | "createdAt" | "updatedAt" | "needsUpdate" | "needsDelete">
  >;
  /** the label of the nodes */
  label: string[];
  /** statics of the Model */
  statics?: Partial<Statics> | undefined;
  /** method of the Instance */
  methods?: Partial<Methods> | undefined;
  /** the id key of this model. Is required in order to perform specific instance methods */
  primaryKeyField?: Extract<keyof Properties, string> | undefined;
  /** relationships with other models or itself. Alternatively, relationships can be added using Model.addRelationships */
  relationships?: Partial<EnhancedRelationshipsI<RelatedNodes>> | undefined;
}

export interface ModelFactoryDefinition<
  Properties extends Neo4jSupportedProperties,
  RelatedNodes extends AnyObject = AnyObject,
  Methods extends AnyObject = AnyObject,
  Statics extends AnyObject = AnyObject,
> {
  (neogma: Neogma): NeogmaModel<Properties, RelatedNodes, Methods, Statics>;
  parameters: ModelParams<Properties, RelatedNodes, Methods, Statics>;
}

export interface AbstractModelFactoryDefinition<
  Properties extends Neo4jSupportedProperties,
  RelatedNodes extends AnyObject = AnyObject,
  Methods extends AnyObject = AnyObject,
  Statics extends AnyObject = AnyObject,
> {
  (neogma: Neogma): AbstractNeogmaModel<Properties, RelatedNodes, Methods, Statics>;
  parameters: ModelParams<Properties, RelatedNodes, Methods, Statics>;
}

export type NeogmaSchema<Properties> = {
  [K in keyof Properties]: any;
};

export type AnyObject = Record<string, any>;

/**
 * Enhanced relationship definition with cardinality info
 */
export type EnhancedRelationshipsI<RelatedNodes extends AnyObject> = {
  [alias in keyof RelatedNodes]: {
    model: string | NeogmaModel<any, any, any, any> | "self";
    name: string;
    direction: "out" | "in" | "none";
    properties?: RelationshipsI<RelatedNodes>[alias]["properties"];
    cardinality?: "one" | "many"; // Explicit cardinality definition
  };
};

// إضافة نوع للمعلومات المرتبطة بالعلاقة
export interface RelationshipInfo {
  direction: "out" | "in" | "none";
  name: string;
  properties?: Record<string, any>;
}

/**
 * Options for fetching relationships
 */
export interface FetchRelationsOptions {
  include?: string[];
  exclude?: string[];
  limits?: Record<string, number>;
  session?: any;
  direction?: "out" | "in" | "none";
  includeRelationshipInfo?: boolean; // إضافة خيار لتضمين معلومات العلاقة
}

/**
 * Options for finding entities with relationships
 */
export interface FindWithRelationsOptions extends FetchRelationsOptions {
  where?: WhereParamsI;
  limit?: number;
  skip?: number;
  order?: Array<[string, "ASC" | "DESC"]>;
  throwIfNotFound?: boolean;
  throwIfNoneFound?: boolean;
  plain?: boolean;
}
