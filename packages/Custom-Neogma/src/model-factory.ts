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

// =============================================================================
// ENHANCED MODEL FACTORY
// =============================================================================

/**
 * Creates an enhanced Neogma model with support for relationships and
 * additional utility methods for handling complex queries with relations.
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
 *       cardinality: 'one'  // Returns single related entity
 *     },
 *     posts: {
 *       model: 'Post',
 *       direction: 'out',
 *       name: 'AUTHORED',
 *       cardinality: 'many' // Returns multiple related entities
 *     }
 *   }
 * }, neogmaInstance);
 *
 * // Query example with relations included
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
  // Get the singleton model registry instance
  const registry = ModelRegistry.getInstance();

  // Destructure parameters, separating relationships from others
  const { name: modelName, relationships: enhancedRelationships, ...restParams } = parameters;

  // Store relationship definitions for cardinality reference (one/many)
  const relationshipDefinitions: Record<string, { cardinality?: "one" | "many" }> = {};
  if (enhancedRelationships) {
    Object.entries(enhancedRelationships).forEach(([alias, rel]) => {
      if (rel) {
        relationshipDefinitions[alias] = { cardinality: rel.cardinality };
      }
    });
  }

  /**
   * Resolve and map the relationships by replacing model names
   * with actual NeogmaModel instances or "self" reference.
   */
  const resolveRelationships = (): Partial<RelationshipsI<RelatedNodes>> => {
    if (!enhancedRelationships) return {};

    const resolved: Partial<RelationshipsI<RelatedNodes>> = {};

    for (const [alias, rel] of Object.entries(enhancedRelationships)) {
      if (!rel) continue;

      let model: NeogmaModel<any, any, any, any> | "self";

      if (typeof rel.model === "string") {
        if (rel.model === "self") {
          model = "self"; // Self-reference for recursive relations
        } else {
          // Lookup model instance from the registry
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
    // Try creating the model with relationships resolved
    const relationships = resolveRelationships();
    model = OriginalModelFactory(
      {
        ...restParams,
        relationships,
      },
      neogma,
    ) as any;
  } catch {
    // If circular dependency detected, create model without relationships first
    model = OriginalModelFactory(
      {
        ...restParams,
        relationships: {},
      },
      neogma,
    ) as any;

    // Schedule relationship resolution later
    if (enhancedRelationships) {
      registry.addPendingRelationship(modelName, () => {
        const relationships = resolveRelationships();
        model.addRelationships(relationships);
      });
    }
  }

  // Instantiate relationship manager for enhanced relation methods
  const manager = new RelationshipManager(model, neogma, relationshipDefinitions);

  // Store labels as an array (support multiple labels)
  const modelLabels = Array.isArray(parameters.label) ? parameters.label : [parameters.label];

  // Expose labels on the model
  model.getLabels = () => modelLabels;

  // Add static method to find entities by a single label with optional filtering and pagination
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

  // Enhanced static methods using the relationship manager
  model.findOneWithRelations = (where: WhereParamsI, options?: FindWithRelationsOptions) =>
    manager.findOneWithRelations(where, options);

  model.findManyWithRelations = (where?: WhereParamsI, options?: FindWithRelationsOptions) =>
    manager.findManyWithRelations(where || {}, options);

  model.searchInRelations = (where: WhereParamsI, relationAlias: string, searchOptions?: any) =>
    manager.searchInRelations(where, relationAlias, searchOptions);

  model.createMultipleRelations = (sourceWhere: WhereParamsI, relations: any[], options?: any) =>
    manager.createMultipleRelations(sourceWhere, relations, options);

  // Instance method to load related entities for a given model instance
  (model as any).prototype.loadRelations = function (options?: FindWithRelationsOptions) {
    return manager.loadRelations(this, options);
  };

  // Instance method to create multiple relationships from this entity to others
  (model as any).prototype.createMultipleRelations = function (relations: any[], options?: any) {
    const primaryKey = model.getPrimaryKeyField();
    if (!primaryKey) {
      throw new Error("Primary key field is required");
    }
    const where = { [primaryKey]: this[primaryKey] };
    return manager.createMultipleRelations(where, relations, options);
  };

  // Register the model in the registry for future lookup
  registry.register(modelName, model);

  return model;
}
