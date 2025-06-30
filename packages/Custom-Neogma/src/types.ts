import { Neo4jSupportedProperties, RelationshipsI, WhereParamsI } from "neogma";
import { NeogmaModel } from "./NeogmaModelTypesWithChanges";
// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export type NeogmaSchema<Properties> = {
  [K in keyof Properties]: any;
};

export type AnyObject = Record<string, any>;

/**
 * Enhanced relationship definition with cardinality info
 */
export type EnhancedRelationshipsI<RelatedNodes extends Record<string, any>> = {
  [alias in keyof RelatedNodes]: {
    model: string | EnhancedNeogmaModel<any, any, any, any> | "self";
    name: string;
    direction: "out" | "in" | "none";
    properties?: RelationshipsI<RelatedNodes>[alias]["properties"];
    cardinality?: "one" | "many"; // Explicit cardinality definition
  };
};

/**
 * Options for fetching relationships
 */
export interface FetchRelationsOptions {
  include?: string[];
  exclude?: string[];
  limits?: Record<string, number>;
  session?: any;
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

/**
 * Enhanced model interface - only available when using our ModelFactory
 */
export type EnhancedNeogmaModel<
  Properties extends Neo4jSupportedProperties,
  RelatedNodes extends AnyObject,
  Methods extends AnyObject = object,
  Statics extends AnyObject = object,
> = NeogmaModel<Properties, RelatedNodes, Methods, Statics> & {
  // Static methods

  findOneWithRelations(
    where: WhereParamsI,
    options?: FindWithRelationsOptions,
  ): Promise<Properties & Partial<RelatedNodes>>;

  findManyWithRelations(
    where?: WhereParamsI,
    options?: FindWithRelationsOptions,
  ): Promise<Array<Properties & Partial<RelatedNodes>>>;

  searchInRelations(
    where: WhereParamsI,
    relationAlias: keyof RelatedNodes,
    searchOptions?: {
      where?: {
        source?: WhereParamsI;
        target?: WhereParamsI;
        relationship?: WhereParamsI;
      };
      limit?: number;
      session?: any;
    },
  ): Promise<any[]>;

  createMultipleRelations(
    sourceWhere: WhereParamsI,
    relations: Array<{
      alias: keyof RelatedNodes;
      targetWhere: WhereParamsI | WhereParamsI[];
      properties?: any;
    }>,
    options?: { session?: any; assertCreatedRelationships?: number },
  ): Promise<{ success: boolean; created: number; errors: string[] }>;
};
