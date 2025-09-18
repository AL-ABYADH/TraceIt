import {
  ModelFactory as OriginalModelFactory,
  Neo4jSupportedProperties,
  Neogma,
  RelationshipsI,
  WhereParamsI,
} from "neogma";

import {
  AnyObject,
  ModelParams,
  FindWithRelationsOptions,
  NeogmaSchema,
  ModelFactoryDefinition,
} from "./types";
import { ModelRegistry } from "./model-registry";
import { RelationshipManager } from "./relationship-manager";
import { v4 as uuidv4 } from "uuid";
import { GenericConfiguration, NeogmaModel } from "./Neogma/normal-model-types";
import { NotFoundException } from "@nestjs/common";

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

function removeUndefined(obj: Record<string, any>) {
  return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== undefined));
}
export function ModelFactory<
  Properties extends Neo4jSupportedProperties,
  RelatedNodes extends AnyObject = object,
  Methods extends AnyObject = object,
  Statics extends AnyObject = object,
>(
  parameters: ModelParams<Properties, RelatedNodes, Methods, Statics>,
  neogma: Neogma,
): NeogmaModel<Properties, RelatedNodes, Methods, Statics> {
  // Retrieve a singleton instance of the model registry
  const registry = ModelRegistry.getInstance();

  const primaryKeyField = parameters.primaryKeyField;
  if (!primaryKeyField) {
    parameters.primaryKeyField = "id" as Extract<keyof Properties, string>;
  }

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
    };
  }

  // Add needsUpdate field if it doesn't exist
  if (!enhancedSchema.hasOwnProperty("needsUpdate")) {
    enhancedSchema["needsUpdate"] = {
      type: "boolean",
      default: false,
    };
  }

  // Add needsDelete field if it doesn't exist
  if (!enhancedSchema.hasOwnProperty("needsDelete")) {
    enhancedSchema["needsDelete"] = {
      type: "boolean",
      default: false,
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

  let model: NeogmaModel<Properties, RelatedNodes, Methods, Statics>;

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
  const manager = new RelationshipManager(model, relationshipDefinitions);

  // Relationship-aware query: fetch a single entity and load its relations
  model.findOneWithRelations = <Plain extends boolean = false>(
    params: GenericConfiguration & {
      where?: WhereParamsI;
      order?: Array<[string, "ASC" | "DESC"]>;
      plain?: Plain;
      throwIfNotFound?: boolean;
      include?: Array<keyof RelatedNodes>;
      exclude?: Array<keyof RelatedNodes>;
      limits?: Record<string, number>;
    } = {},
  ) => manager.findOneWithRelations(params);

  // Fetch multiple entities along with their associated relationships
  model.findManyWithRelations = <Plain extends boolean = false>(
    params: GenericConfiguration & {
      where?: WhereParamsI;
      limit?: number;
      skip?: number;
      order?: Array<[string, "ASC" | "DESC"]>;
      plain?: Plain;
      throwIfNoneFound?: boolean;
      include?: Array<keyof RelatedNodes>;
      exclude?: Array<keyof RelatedNodes>;
      limits?: Record<string, number>;
    } = {},
  ) => manager.findManyWithRelations(params);

  // Add the new findByRelatedEntity method
  model.findByRelatedEntity = <Plain extends boolean = false>(
    params: GenericConfiguration & {
      whereRelated: WhereParamsI;
      relationshipAlias: keyof RelatedNodes;
      where?: WhereParamsI;
      limit?: number;
      skip?: number;
      order?: Array<[string, "ASC" | "DESC"]>;
      plain?: Plain;
      throwIfNoneFound?: boolean;
      include?: Array<keyof RelatedNodes>;
      exclude?: Array<keyof RelatedNodes>;
      limits?: Record<string, number>;
    },
  ) => manager.findByRelatedEntity(params);

  /**
   * Loads relationships for a given instance.
   * Can be used within instance methods to load linked nodes.
   */
  (model as any).prototype.loadRelations = function (options?: FindWithRelationsOptions) {
    return manager.loadRelations(this, options);
  };

  model.findByRelationshipProperties = (
    relationshipAlias: keyof RelatedNodes,
    whereRelationship: WhereParamsI,
    options: any,
  ) => manager.findByRelationshipProperties(relationshipAlias, whereRelationship, options);

  model.updateOneOrThrow = async (data: any, params: any = {}): Promise<Properties> => {
    // Explicitly type the return value

    const modelName: string = parameters.name || "Entity";
    const result: Properties[] = await model.update(data, params);

    // Check if any entity was updated
    const updatedEntity = result.at(0);
    if (!updatedEntity) {
      // Get ID from where clause if available
      const id = params.where?.id || "unknown";
      throw new NotFoundException(`${modelName} with ID ${id} was not found`);
    }

    // Return the first (and should be only) updated entity
    return updatedEntity; // TypeScript now knows this is defined
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
    data.updatedAt = data.updatedAt || new Date().toISOString();
  };

  // Proxy wrapper to auto-update `updatedAt` field during updates
  /**
   * Wraps the update method using a proxy to ensure the `updatedAt` timestamp
   * is automatically refreshed when updating the entity.
   */
  const proxiedModel = new Proxy(model, {
    get(target, prop, receiver) {
      // Always return plain object for createOne
      if (prop === "createOne") {
        return async (data: any, params?: any) => {
          const instance = await target.createOne.call(target, data, params);
          return (instance as any).getDataValues();
        };
      }
      // Always return array of plain objects for createMany
      if (prop === "createMany") {
        return async (data: any[], params?: any) => {
          const instances = await target.createMany.call(target, data, params);
          return instances.map((i: any) => i.getDataValues());
        };
      }
      // Always update updatedAt and return plain array for update
      if (prop === "update") {
        return async function (data: any, params: any) {
          if (data) {
            data = removeUndefined(data);
            data.updatedAt = new Date().toISOString();
          }
          if (params) {
            params.return = params.return || true;
          }
          const result = await (target[prop] as Function).apply(target, [data, params]);
          return result[0].map((i: any) => i.getDataValues());
        };
      }
      // Set plain: true by default for findMany
      if (prop === "findMany") {
        return async (params?: any) => {
          params = params || {};
          if (params.plain === undefined) params.plain = true;
          return target.findMany.call(target, params);
        };
      }
      // Set plain: true by default for findOne
      if (prop === "findOne") {
        return async (params?: any) => {
          params = params || {};
          if (params.plain === undefined) params.plain = true;
          return target.findOne.call(target, params);
        };
      }
      if (prop === "findByRelatedEntity") {
        return async (params?: any) => {
          params = params || {};
          if (params.plain === undefined) params.plain = true;
          return target.findByRelatedEntity.call(target, params);
        };
      }
      if (prop === "relateTo") {
        return async function (this: any, params: any) {
          const primaryKeyField = model.getPrimaryKeyField();

          const currentEntity = this as unknown as Record<string, any>;

          if (
            primaryKeyField &&
            currentEntity &&
            typeof currentEntity === "object" &&
            primaryKeyField in currentEntity &&
            params?.alias
          ) {
            const entityId = currentEntity[primaryKeyField];

            if (entityId) {
              await manager.validateCardinality(entityId, params.alias, params.session);
            }
          }

          return target.relateTo.call(this, params);
        };
      } // Default to standard property/method
      return Reflect.get(target, prop, receiver);
    },
  });

  // Register the model instance into the global registry for reuse
  registry.register(modelName, proxiedModel);

  // Return the proxied model with enhanced features
  return proxiedModel;
}

export function defineModelFactory<
  Properties extends Neo4jSupportedProperties,
  RelatedNodes extends AnyObject = AnyObject,
  Methods extends AnyObject = AnyObject,
  Statics extends AnyObject = AnyObject,
>(
  parameters: ModelParams<Properties, RelatedNodes, Methods, Statics>,
): ModelFactoryDefinition<Properties, RelatedNodes, Methods, Statics> {
  // Create a model function that returns a ModelFactory instance
  const ModelFunction = function (
    neogma: Neogma,
  ): NeogmaModel<Properties, RelatedNodes, Methods, Statics> {
    return ModelFactory<Properties, RelatedNodes, Methods, Statics>(parameters, neogma);
  };

  ModelFunction.parameters = { ...parameters };

  return ModelFunction;
}
