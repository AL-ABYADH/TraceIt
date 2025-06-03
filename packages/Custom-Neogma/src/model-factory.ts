// model-factory.ts
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
import { v4 as uuidv4 } from "uuid";

// =============================================================================
// ENHANCED MODEL FACTORY
// =============================================================================

/**
 * Factory function for creating enhanced Neogma models with:
 * - Relationship resolution (including circular/self-referencing)
 * - Automatic bidirectional relationships detection (even with different names)
 * - Custom statics and methods
 * - Extended query utilities like `findOneWithRelations`
 *
 * @example
 * const User = ModelFactory({
 *   name: 'User',
 *   label: 'User',
 *   schema: {
 *     id: { type: 'string', required: true },
 *     name: { type: 'string', required: true },
 *   },
 *   relationships: {
 *     posts: {
 *       model: 'Post',
 *       direction: 'out',
 *       name: 'AUTHORED',
 *       cardinality: 'many',
 *     }
 *   }
 * }, neogmaInstance);
 *
 * // The Post model can have a different relationship name pointing back to User
 * const Post = ModelFactory({
 *   name: 'Post',
 *   label: 'Post',
 *   schema: {
 *     id: { type: 'string', required: true },
 *     title: { type: 'string', required: true },
 *   },
 *   relationships: {
 *     author: {
 *       model: 'User',
 *       direction: 'in',
 *       name: 'AUTHORED',
 *       cardinality: 'one',
 *     }
 *   }
 * }, neogmaInstance);
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
  const registry = ModelRegistry.getInstance();

  const { name: modelName, relationships: enhancedRelationships, ...restParams } = parameters;

  // Capture relationship metadata (mainly for cardinality support)
  const relationshipDefinitions: Record<string, { cardinality?: "one" | "many" }> = {};
  if (enhancedRelationships) {
    Object.entries(enhancedRelationships).forEach(([alias, rel]) => {
      if (rel) {
        relationshipDefinitions[alias] = { cardinality: rel.cardinality };
      }
    });
  }

  /**
   * Helper function to resolve model references in relationships.
   * Converts string-based model references to actual model instances.
   */
  const resolveRelationships = (): Partial<RelationshipsI<RelatedNodes>> => {
    if (!enhancedRelationships) return {};

    const resolved: Partial<RelationshipsI<RelatedNodes>> = {};

    for (const [alias, rel] of Object.entries(enhancedRelationships)) {
      if (!rel) continue;

      let model: NeogmaModel<any, any, any, any> | "self";

      if (typeof rel.model === "string") {
        if (rel.model === "self") {
          model = "self";
        } else {
          const found = registry.get(rel.model);
          if (!found) throw new Error(`Model "${rel.model}" not found`);
          model = found;
        }
      } else {
        model = rel.model;
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
    // Initial creation with resolved relationships
    const relationships = resolveRelationships();
    model = OriginalModelFactory({ ...restParams, relationships }, neogma) as any;
  } catch {
    // Fallback for circular dependencies: register model first, resolve relationships later
    model = OriginalModelFactory({ ...restParams, relationships: {} }, neogma) as any;

    if (enhancedRelationships) {
      registry.addPendingRelationship(modelName, () => {
        const relationships = resolveRelationships();
        model.addRelationships(relationships);
      });
    }
  }

  const manager = new RelationshipManager(model, neogma, relationshipDefinitions);
  const modelLabels = Array.isArray(parameters.label) ? parameters.label : [parameters.label];

  model.getLabels = () => modelLabels;

  /**
   * Find nodes by a single label with optional filtering and pagination.
   */
  model.findByLabel = async (
    label: string,
    where?: WhereParamsI,
    options?: FindWithRelationsOptions,
  ) => {
    const query = `
    MATCH (n:${label})
    ${
      where
        ? "WHERE " +
          Object.entries(where)
            .map(([key, value]) => `n.${key} = $${key}`)
            .join(" AND ")
        : ""
    }
    RETURN n
    ${options?.limit ? `LIMIT ${options.limit}` : ""}
    ${options?.skip ? `SKIP ${options.skip}` : ""}
  `;

    const result = await neogma.queryRunner.run(query, where || {});
    const entities = result.records.map((record) => record.get("n").properties);

    // Load relations if requested in options
    if (options?.include || options?.exclude) {
      return Promise.all(entities.map((entity) => manager.loadRelations(entity, options)));
    }

    return entities;
  };

  // Add static method to find entities by multiple labels
  model.findByLabels = async (
    labels: string[],
    where?: WhereParamsI,
    options?: FindWithRelationsOptions,
  ) => {
    const labelQuery = labels.map((l) => `:${l}`).join("");
    const query = `
    MATCH (n${labelQuery})
    ${
      where
        ? "WHERE " +
          Object.entries(where)
            .map(([key, value]) => `n.${key} = $${key}`)
            .join(" AND ")
        : ""
    }
    RETURN n
    ${options?.limit ? `LIMIT ${options.limit}` : ""}
    ${options?.skip ? `SKIP ${options.skip}` : ""}
  `;

    const result2 = await neogma.queryRunner.run(query, where || {});
    const entities = result2.records.map((record) => record.get("n").properties);

    if (options?.include || options?.exclude) {
      return Promise.all(entities.map((entity) => manager.loadRelations(entity, options)));
    }

    return entities;
  };

  // Static utilities with relationship-aware querying
  model.findOneWithRelations = (where: WhereParamsI, options?: FindWithRelationsOptions) =>
    manager.findOneWithRelations(where, options);

  model.findManyWithRelations = (where?: WhereParamsI, options?: FindWithRelationsOptions) =>
    manager.findManyWithRelations(where || {}, options);

  model.searchInRelations = (where: WhereParamsI, relationAlias: string, searchOptions?: any) =>
    manager.searchInRelations(where, relationAlias, searchOptions);

  model.createMultipleRelations = (sourceWhere: WhereParamsI, relations: any[], options?: any) =>
    manager.createMultipleRelations(sourceWhere, relations, options);

  // Instance-level utilities for relationship management
  (model as any).prototype.loadRelations = function (options?: FindWithRelationsOptions) {
    return manager.loadRelations(this, options);
  };

  (model as any).prototype.createMultipleRelations = function (relations: any[], options?: any) {
    const primaryKey = model.getPrimaryKeyField();
    if (!primaryKey) throw new Error("Primary key field is required");
    const where = { [primaryKey]: this[primaryKey] };
    return manager.createMultipleRelations(where, relations, options);
  };

  // Override the original createOne method to handle bidirectional relationships
  const originalCreateOne = model.createOne;
  model.createOne = async function (data: any, options?: any) {
    // First, execute the original createOne method
    const entity = await originalCreateOne.call(this, data, options);

    // Then, handle the bidirectional relationships
    if (entity) {
      // Extract the relationship data from the original data object
      const relationData: Record<string, any> = {};

      if (data) {
        Object.keys(data).forEach((key) => {
          // Check if this key is a relationship alias (exists in the model's relationships)
          if (model.relationships && model.relationships[key]) {
            relationData[key] = data[key];
          }
        });
      }

      // Process the relationships to ensure bidirectionality
      await manager.handleCreateOneRelationships(entity, relationData, options);
    }

    return entity;
  };

  // Override the original createMany method to handle bidirectional relationships
  const originalCreateMany = model.createMany;
  model.createMany = async function (dataArray: any[], options?: any) {
    // First, execute the original createMany method
    const entities = await originalCreateMany.call(this, dataArray, options);

    // Then, handle the bidirectional relationships for each entity
    if (entities && entities.length > 0) {
      for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        const data = dataArray[i];

        // Extract the relationship data from the original data object
        const relationData: Record<string, any> = {};

        if (data) {
          Object.keys(data).forEach((key) => {
            // Check if this key is a relationship alias
            if (model.relationships && model.relationships[key]) {
              relationData[key] = data[key];
            }
          });
        }

        // Process the relationships to ensure bidirectionality
        await manager.handleCreateOneRelationships(entity, relationData, options);
      }
    }

    return entities;
  };

  // Override deleteRelationships to use our enhanced manager
  const originalDeleteRelationships = (model as any).prototype.deleteRelationships;
  (model as any).prototype.deleteRelationships = function (options: any) {
    return manager.deleteRelationships(this, options);
  };

  /**
   * Automatically inject `id` and `createdAt` if defined in schema during creation.
   */
  model.beforeCreate = (data: any) => {
    if (restParams.schema.hasOwnProperty("id")) {
      data.id = data.id || uuidv4();
    }
    if (restParams.schema.hasOwnProperty("createdAt")) {
      data.createdAt = new Date().toISOString();
    }
  };

  /**
   * Proxy to auto-assign `updatedAt` field on update (if defined in schema).
   */
  const proxiedModel = new Proxy(model, {
    get(target, prop, receiver) {
      if (prop === "update") {
        return async (data: any, params: any) => {
          if (data && restParams.schema.hasOwnProperty("updatedAt")) {
            data.updatedAt = new Date().toISOString();
          }
          return target.update.call(target, data, params);
        };
      }
      return Reflect.get(target, prop, receiver);
    },
  });

  // Final step: register the model in the shared registry
  registry.register(modelName, proxiedModel);

  return proxiedModel;
}
