import { Neo4jSupportedProperties, Neogma, WhereParamsI } from "neogma";

import {
  EnhancedNeogmaModel,
  EnhancedRelationshipsI,
  FindWithRelationsOptions,
  NeogmaSchema,
} from "./types";
import { ModelFactory } from "./model-factory";

// ============================================================================
// Custom Error Class
// ============================================================================

/**
 * Error thrown when a forbidden operation is attempted on a read-only model.
 */
export class ReadOnlyModelError extends Error {
  constructor(operation: string, modelName: string) {
    super(`Operation '${operation}' is not allowed on read-only model '${modelName}'.`);
    this.name = "ReadOnlyModelError";
  }
}

// ============================================================================
// Read-Only Model Interface
// ============================================================================

/**
 * Interface representing a read-only Neo4j model.
 * Allows query operations only; no mutations or lifecycle hooks.
 */
export interface AbstractModel<
  Properties extends Neo4jSupportedProperties,
  RelatedNodes extends Record<string, any> = Record<string, any>,
  Methods extends Record<string, any> = Record<string, any>,
  Statics extends Record<string, any> = Record<string, any>,
> {
  // Core query methods
  findOne(where: WhereParamsI): Promise<Properties | null>;
  findMany(where?: WhereParamsI): Promise<Properties[]>;

  // Query methods involving relationships
  findOneWithRelations(
    where: WhereParamsI,
    options?: FindWithRelationsOptions,
  ): Promise<(Properties & Record<string, any>) | null>;

  findManyWithRelations(
    where?: WhereParamsI,
    options?: FindWithRelationsOptions,
  ): Promise<(Properties & Record<string, any>)[]>;

  searchInRelations(where: WhereParamsI, relationAlias: string, searchOptions?: any): Promise<any>;

  findRelationships(params: any): Promise<any>;

  // Metadata and utility methods
  getLabel(): string | string[];
  getSchema(): NeogmaSchema<Properties>;
  getPrimaryKeyField(): string | null;
  buildFromRecord(record: any): any;
  build(data: any, params?: any): any;
}

// ============================================================================
// Forbidden Mutation Methods
// ============================================================================

/**
 * Set of method names disallowed on a read-only model.
 * These include creation, update, deletion, and lifecycle hooks.
 */
const FORBIDDEN_METHODS = new Set([
  // Mutation methods
  "createOne",
  "createMany",
  "update",
  "updateRelationship",
  "delete",
  "deleteRelationships",
  "save",

  // Relationship mutation methods
  "createRelationship",
  "relateTo",
  "createMultipleRelations",
  "addRelationships",

  // Lifecycle hooks
  "beforeCreate",
  "beforeDelete",

  // Instance mutation methods
  "loadRelations",
]);

// ============================================================================
// Abstract Model Factory
// ============================================================================

/**
 * Factory function to create a read-only model that supports only query operations.
 *
 * @param parameters - Model configuration including name, schema, label, relationships, etc.
 * @param neogma - Neogma instance used to create the underlying model.
 * @returns An AbstractModel instance that exposes read-only methods.
 *
 * @example
 * ```ts
 * const UserQuery = AbstractModelFactory({
 *   name: 'User',
 *   schema: {
 *     id: { type: 'string', required: true },
 *     name: { type: 'string', required: true }
 *   },
 *   label: 'User',
 *   relationships: {
 *     posts: {
 *       model: 'Post',
 *       direction: 'out',
 *       name: 'AUTHORED',
 *       cardinality: 'many'
 *     }
 *   }
 * }, neogmaInstance);
 *
 * const user = await UserQuery.findOneWithRelations({ id: '123' });
 * ```
 */
export function AbstractModelFactory<
  Properties extends Neo4jSupportedProperties,
  RelatedNodes extends Record<string, any> = Record<string, any>,
  Methods extends Record<string, any> = Record<string, any>,
  Statics extends Record<string, any> = Record<string, any>,
>(
  parameters: {
    name: string;
    schema: NeogmaSchema<Properties>;
    label: string | string[];
    statics?: Partial<Statics>;
    methods?: Partial<Methods>;
    primaryKeyField?: Extract<keyof Properties, string>;
    relationships?: Partial<EnhancedRelationshipsI<RelatedNodes>>;
  },
  neogma: Neogma,
): AbstractModel<Properties, RelatedNodes, Methods, Statics> {
  // Create the source model using the ModelFactory, which handles model registration
  const sourceModel = ModelFactory<Properties, RelatedNodes, Statics, Methods>(
    {
      name: parameters.name,
      schema: parameters.schema,
      label: parameters.label,
      statics: parameters.statics,
      methods: parameters.methods,
      primaryKeyField: parameters.primaryKeyField,
      relationships: parameters.relationships,
    } as any,
    neogma,
  );

  // Wrap the source model with a read-only proxy interface
  return createReadOnlyModel(sourceModel, parameters.name);
}

// ============================================================================
// Read-Only Model Implementation
// ============================================================================

/**
 * Creates a read-only wrapper around the provided model,
 * delegating read operations and blocking mutations.
 *
 * @param sourceModel - The original model to wrap.
 * @param originalModelName - Name of the original model (used in error messages).
 * @returns A proxy implementing AbstractModel with mutation operations blocked.
 */
function createReadOnlyModel<
  Properties extends Neo4jSupportedProperties,
  RelatedNodes extends Record<string, any>,
  Methods extends Record<string, any>,
  Statics extends Record<string, any>,
>(
  sourceModel: EnhancedNeogmaModel<Properties, RelatedNodes, Methods, Statics>,
  originalModelName: string,
): AbstractModel<Properties, RelatedNodes, Methods, Statics> {
  // Delegate read-only methods directly to the source model
  const readOnlyModel: AbstractModel<Properties, RelatedNodes, Methods, Statics> = {
    findOne: (where: WhereParamsI) => sourceModel.findOne(where),
    findMany: (where?: WhereParamsI) => sourceModel.findMany(where),

    findOneWithRelations: (where: WhereParamsI, options?: FindWithRelationsOptions) =>
      sourceModel.findOneWithRelations(where, options),

    findManyWithRelations: (where?: WhereParamsI, options?: FindWithRelationsOptions) =>
      sourceModel.findManyWithRelations(where, options),

    searchInRelations: (where: WhereParamsI, relationAlias: string, searchOptions?: any) =>
      sourceModel.searchInRelations(where, relationAlias, searchOptions),

    findRelationships: (params: any) => sourceModel.findRelationships(params),

    getLabel: () => sourceModel.getLabel(),
    getSchema: () => ({ ...sourceModel.getSchema() }),
    getPrimaryKeyField: () => sourceModel.getPrimaryKeyField(),
    buildFromRecord: (record: any) => sourceModel.buildFromRecord(record),
    build: (data: any, params?: any) => sourceModel.build(data, params),
  };

  // Return a Proxy that intercepts forbidden mutations and throws errors
  return new Proxy(readOnlyModel, {
    get(target, prop, receiver) {
      // Return existing properties if found on the read-only model
      if (prop in target) {
        return Reflect.get(target, prop, receiver);
      }

      // Block access to forbidden mutation methods
      if (typeof prop === "string" && FORBIDDEN_METHODS.has(prop)) {
        return () => {
          throw new ReadOnlyModelError(prop, originalModelName);
        };
      }

      // For other properties, delegate to the source model
      if (typeof prop === "string") {
        const value = sourceModel[prop];

        // Wrap functions to preserve 'this' context
        if (typeof value === "function") {
          return (...args: any[]) => (sourceModel as any)[prop](...args);
        }

        return value;
      }

      return undefined;
    },

    // Disallow any modifications to the proxy properties
    set() {
      throw new ReadOnlyModelError("modify property", originalModelName);
    },

    // Disallow deleting any properties from the proxy
    deleteProperty() {
      throw new ReadOnlyModelError("delete property", originalModelName);
    },
  });
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Returns a list of all forbidden methods that throw errors
 * when called on a read-only model.
 */
export function getForbiddenMethods(): string[] {
  return Array.from(FORBIDDEN_METHODS);
}
