import {
  ModelFactory as OriginalModelFactory,
  Neo4jSupportedProperties,
  Neogma,
  NeogmaModel,
  RelationshipsI,
  WhereParamsI,
} from "neogma";

import {
  EnhancedNeogmaModel,
  EnhancedRelationshipsI,
  FindWithRelationsOptions,
  NeogmaSchema,
} from "./types";
import { ModelRegistry } from "./model-registry";
import { RelationshipManager } from "./relationship-manager";
import { v4 as uuidv4 } from "uuid"; // Added: UUID import for automatic ID generation

// =============================================================================
// ENHANCED MODEL FACTORY
// =============================================================================

/**
 * Factory function for creating enhanced Neogma models with the following features:
 * - Support for complex relationships, including self-referencing and circular dependencies
 * - Ability to define custom static and instance methods
 * - Extended query utilities like `findOneWithRelations`
 * - Automatic generation of unique identifiers and timestamp fields
 *
 * @example
 * const User = ModelFactory({
 *   name: 'User',
 *   label: 'User',
 *   schema: {
 *     id: { type: 'string', required: true },
 *     name: { type: 'string', required: true }
 *   },
 *   relationships: {
 *     profile: {
 *       model: 'Profile',
 *       direction: 'out',
 *       name: 'HAS_PROFILE',
 *       cardinality: 'one'  // Single related entity
 *     },
 *     posts: {
 *       model: 'Post',
 *       direction: 'out',
 *       name: 'AUTHORED',
 *       cardinality: 'many' // Multiple related entities
 *     }
 *   }
 * }, neogmaInstance);
 *
 * // Usage example: Fetching a user with related profile and posts (limited to 5 posts)
 * const userWithRelations = await User.findOneWithRelations(
 *   { id: '123' },
 *   { include: ['profile', 'posts'], limits: { posts: 5 } }
 * );
 */
export function ModelFactory<
  Properties extends Neo4jSupportedProperties,
  RelatedNodes extends Record<string, any> = Record<string, any>,
  Statics extends Record<string, any> = Record<string, any>,
  Methods extends Record<string, any> = Record<string, any>,
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
): EnhancedNeogmaModel<Properties, RelatedNodes, Methods, Statics> {
  // Retrieve a singleton instance of the model registry
  const registry = ModelRegistry.getInstance();

  // Destructure parameters and separate relationship definitions
  const { name: modelName, relationships: enhancedRelationships, ...restParams } = parameters;

  // Enhance schema with required fields if they don't exist
  const enhancedSchema: any = { ...restParams.schema };

  // Add id field if it doesn't exist
  if (!enhancedSchema.hasOwnProperty("id")) {
    enhancedSchema["id"] = {
      type: "string",
      required: true,
      pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$",
      message: "is not a valid UUID v4",
    };
  }

  // Add createdAt field if it doesn't exist
  if (!enhancedSchema.hasOwnProperty("createdAt")) {
    enhancedSchema["createdAt"] = {
      type: "string",
      format: "date-time",
    };
  }

  // Add updatedAt field if it doesn't exist
  if (!enhancedSchema.hasOwnProperty("updatedAt")) {
    enhancedSchema["updatedAt"] = {
      type: "string",
      format: "date-time",
      required: false,
    };
  }

  const enhancedSchemaWithDataType: NeogmaSchema<Properties> = enhancedSchema;

  // Create updated parameters with enhanced schema
  const enhancedParams = {
    ...restParams,
    schema: enhancedSchemaWithDataType,
  };

  // Map relationship definitions to retain cardinality info (e.g., 'one' or 'many')
  const relationshipDefinitions: Record<string, { cardinality?: "one" | "many" }> = {};
  if (enhancedRelationships) {
    Object.entries(enhancedRelationships).forEach(([alias, rel]) => {
      if (rel) {
        relationshipDefinitions[alias] = { cardinality: rel.cardinality };
      }
    });
  }

  /**
   * Resolves the relationship configurations by converting model names
   * to actual NeogmaModel instances or a self-reference string for recursive models.
   */
  const resolveRelationships = (): Partial<RelationshipsI<RelatedNodes>> => {
    if (!enhancedRelationships) return {};

    const resolved: Partial<RelationshipsI<RelatedNodes>> = {};

    for (const [alias, rel] of Object.entries(enhancedRelationships)) {
      if (!rel) continue;

      let model: NeogmaModel<any, any, any, any> | "self";

      if (typeof rel.model === "string") {
        if (rel.model === "self") {
          model = "self"; // Self-reference for models with recursive relationships
        } else {
          // Attempt to retrieve the corresponding model from the global registry
          const found = registry.get(rel.model);
          if (!found) {
            throw new Error(`Model "${rel.model}" not found`);
          }
          model = found;
        }
      } else {
        model = rel.model; // Model provided directly
      }

      resolved[alias as keyof RelatedNodes] = {
        model,
        name: rel.name,
        direction: rel.direction,
        properties: rel.properties,
      } as any;
    }

    return resolved;
  };

  let model: EnhancedNeogmaModel<Properties, RelatedNodes, Methods, Statics>;

  try {
    // Try to create the model with resolved relationships
    const relationships = resolveRelationships();
    model = OriginalModelFactory(
      {
        ...enhancedParams, // Use enhanced parameters with updated schema
        relationships,
      },
      neogma,
    ) as any;
  } catch {
    // Fallback: In case of circular dependencies, initialize the model without relationships
    model = OriginalModelFactory(
      {
        ...enhancedParams, // Use enhanced parameters with updated schema
        relationships: {},
      },
      neogma,
    ) as any;

    // Schedule the relationship injection after model instantiation
    if (enhancedRelationships) {
      registry.addPendingRelationship(modelName, () => {
        const relationships = resolveRelationships();
        model.addRelationships(relationships);
      });
    }
  }

  // Create a relationship manager instance to handle advanced relationship features
  const manager = new RelationshipManager(model, neogma, relationshipDefinitions);

  // Relationship-aware query: fetch a single entity and load its relations
  model.findOneWithRelations = (where: WhereParamsI, options?: FindWithRelationsOptions) =>
    manager.findOneWithRelations(where, options);

  // Fetch multiple entities along with their associated relationships
  model.findManyWithRelations = (where?: WhereParamsI, options?: FindWithRelationsOptions) =>
    manager.findManyWithRelations(where || {}, options);

  // Search within a specific relationship connected to a node
  model.searchInRelations = (where: WhereParamsI, relationAlias: string, searchOptions?: any) =>
    manager.searchInRelations(where, relationAlias, searchOptions);

  // Create multiple relationships from a source node to several target nodes
  model.createMultipleRelations = (sourceWhere: WhereParamsI, relations: any[], options?: any) =>
    manager.createMultipleRelations(sourceWhere, relations, options);

  /**
   * Loads relationships for a given instance.
   * Can be used within instance methods to load linked nodes.
   */
  (model as any).prototype.loadRelations = function (options?: FindWithRelationsOptions) {
    return manager.loadRelations(this, options);
  };

  /**
   * Instance method for creating multiple relationships from this node to others.
   * Requires the existence of a primary key field.
   */
  (model as any).prototype.createMultipleRelations = function (relations: any[], options?: any) {
    const primaryKey = model.getPrimaryKeyField();
    if (!primaryKey) {
      throw new Error("Primary key field is required");
    }
    const where = { [primaryKey]: this[primaryKey] };
    return manager.createMultipleRelations(where, relations, options);
  };

  // Updated: Always generate UUID and timestamps during model creation
  /**
   * Automatically populates `id` and `createdAt` fields during entity creation,
   * regardless of whether they were provided.
   */
  model.beforeCreate = (data: any) => {
    // Always set id if not provided
    data.id = data.id || uuidv4();

    // Always set createdAt if not provided
    data.createdAt = data.createdAt || new Date().toISOString();
  };

  // Proxy wrapper to auto-update `updatedAt` field during updates
  /**
   * Wraps the update method using a proxy to ensure the `updatedAt` timestamp
   * is automatically refreshed when updating the entity.
   */
  const proxiedModel = new Proxy(model, {
    get(target, prop, receiver) {
      if (prop === "update") {
        return async (data: any, params: any) => {
          if (data) {
            // Always update the updatedAt field
            data.updatedAt = new Date().toISOString();
          }
          return target.update.call(target, data, params);
        };
      }
      return Reflect.get(target, prop, receiver);
    },
  });

  // Register the model instance into the global registry for reuse
  registry.register(modelName, proxiedModel);

  // Return the proxied model with enhanced features
  return proxiedModel;
}
