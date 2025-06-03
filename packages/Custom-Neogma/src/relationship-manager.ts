// relationship-manager.ts
import { Neogma, WhereParamsI } from "neogma";
import { FetchRelationsOptions, FindWithRelationsOptions } from "./types";

// Define relationship config type to avoid TypeScript errors
interface RelationshipConfig {
  model: any;
  name: string;
  direction: "out" | "in" | "none";
  properties?: any;
}

// =============================================================================
// RELATIONSHIP UTILITIES
// =============================================================================

/**
 * Helper class for managing Neo4j relationships using Neogma models
 */
export class RelationshipManager {
  private bidirectionalRelationships: Map<string, { targetModel: any; reverseAlias: string }> =
    new Map();

  constructor(
    private model: any,
    private neogma: Neogma,
    private relationshipDefinitions: Record<string, { cardinality?: "one" | "many" }>,
  ) {
    // Automatically detect bidirectional relationships when the manager is created
    this.detectBidirectionalRelationships();
  }

  /**
   * Automatically detect bidirectional relationships between models
   * This looks for pairs of relationships that connect the same models in opposite directions,
   * regardless of the relationship name
   */
  private detectBidirectionalRelationships(): void {
    const relationships = this.model.relationships || {};
    const modelName = this.model.getModelName ? this.model.getModelName() : this.model.name;

    // Examine each relationship to find potential bidirectional pairs
    for (const [alias, relConfig] of Object.entries(relationships)) {
      // Ensure relConfig is not null or undefined and has a model property
      if (!relConfig || !relConfig || typeof relConfig !== "object") continue;

      // Cast to the correct type
      const config = relConfig as RelationshipConfig;
      if (!config.model || config.model === "self") continue;

      const targetModel = config.model;
      const direction = config.direction;

      // Look for the reverse relationship in the target model (any relationship that points back)
      const targetRelationships = targetModel.relationships || {};

      for (const [targetAlias, targetRelConfig] of Object.entries(targetRelationships)) {
        if (!targetRelConfig || typeof targetRelConfig !== "object") continue;

        // Cast to the correct type
        const targetConfig = targetRelConfig as RelationshipConfig;

        // Check if this is a reverse relationship:
        // 1. Points back to our model
        // 2. Has the opposite direction
        // Note: We no longer require the same relationship name
        const isReverseModel =
          targetConfig.model === this.model ||
          (typeof targetConfig.model === "string" && targetConfig.model === modelName);

        const isOppositeDirection =
          (direction === "out" && targetConfig.direction === "in") ||
          (direction === "in" && targetConfig.direction === "out");

        if (isReverseModel && isOppositeDirection) {
          // We found a bidirectional relationship!
          this.bidirectionalRelationships.set(alias, {
            targetModel,
            reverseAlias: targetAlias,
          });

          // Log for debugging
          console.debug(
            `Detected bidirectional relationship: ${modelName}.${alias} <-> ${targetModel.getModelName ? targetModel.getModelName() : targetModel.name}.${targetAlias}`,
          );
          break;
        }
      }
    }
  }

  /**
   * Handle the creation of nodes with relationships using createOne/createMany
   * This method is called after a node is created to ensure bidirectional relationships
   * are properly maintained
   */
  async handleCreateOneRelationships(
    entity: any,
    relationData: Record<string, any>,
    options: any = {},
  ): Promise<void> {
    if (!entity || !relationData) return;

    for (const [alias, data] of Object.entries(relationData)) {
      // Check if this is a bidirectional relationship
      const bidirectionalInfo = this.bidirectionalRelationships.get(alias);
      if (!bidirectionalInfo) continue;

      const { targetModel, reverseAlias } = bidirectionalInfo;

      // Handle newly created properties (nodes)
      if (data.properties && Array.isArray(data.properties)) {
        for (const props of data.properties) {
          // Find the created node by its properties
          const targetEntity = await targetModel.findOne({
            where: this.extractIdentifyingProperties(props),
            session: options.session,
          });

          if (targetEntity) {
            // Create the reverse relationship
            await targetEntity.relateTo({
              alias: reverseAlias,
              where: entity,
              properties: props._relationshipProperties || {}, // Use relationship properties if available
              session: options.session,
            });
          }
        }
      }

      // Handle existing nodes matched by where clauses
      if (data.where && Array.isArray(data.where)) {
        for (const whereItem of data.where) {
          if (!whereItem.params) continue;

          // Find matched nodes
          const targetEntities = await targetModel.findMany({
            where: whereItem.params,
            session: options.session,
          });

          for (const targetEntity of targetEntities) {
            // Create the reverse relationship
            await targetEntity.relateTo({
              alias: reverseAlias,
              where: entity,
              properties: whereItem.relationshipProperties || {}, // Use relationship properties if specified
              session: options.session,
            });
          }
        }
      }
    }
  }

  /**
   * Extract properties that can identify a node (id or primary key)
   */
  private extractIdentifyingProperties(props: any): Record<string, any> {
    if (!props) return {};

    // If props has an id field, use that
    if (props.id !== undefined) {
      return { id: props.id };
    }

    // If the model has a primary key field defined, use that
    const primaryKeyField = this.model.getPrimaryKeyField?.();
    if (primaryKeyField && props[primaryKeyField] !== undefined) {
      return { [primaryKeyField]: props[primaryKeyField] };
    }

    // Otherwise return all properties
    return { ...props };
  }

  /**
   * Load specified relationships for an entity with optional filters and limits
   */
  async loadRelations(entity: any, options: FetchRelationsOptions = {}): Promise<any> {
    const relationships = this.model.relationships || {};
    let relationAliases = Object.keys(relationships);

    // Filter relation aliases by include/exclude options
    if (options.include?.length) {
      relationAliases = relationAliases.filter((alias) => options.include!.includes(alias));
    }
    if (options.exclude?.length) {
      relationAliases = relationAliases.filter((alias) => !options.exclude!.includes(alias));
    }

    // Get base data of entity
    const result = entity.getDataValues ? entity.getDataValues() : { ...entity };

    // Load all relationships concurrently
    const loadPromises = relationAliases.map(async (alias) => {
      try {
        const { isArray } = this.getRelationInfo(alias);
        const relationOptions: any = { alias, session: options.session };

        if (options.limits?.[alias]) {
          relationOptions.limit = options.limits[alias];
        }

        const relationships = await entity.findRelationships(relationOptions);

        const data = relationships.map((rel: any) => {
          const targetData = rel.target.getDataValues ? rel.target.getDataValues() : rel.target;
          if (rel.relationship && Object.keys(rel.relationship).length > 0) {
            targetData._relationshipProperties = rel.relationship;
          }
          return targetData;
        });

        return { alias, data: isArray ? data : data[0] || null };
      } catch {
        const { isArray } = this.getRelationInfo(alias);
        return { alias, data: isArray ? [] : null };
      }
    });

    // Await all relationship data and attach to result
    const results = await Promise.all(loadPromises);
    results.forEach(({ alias, data }) => {
      result[alias] = data;
    });

    return result;
  }

  /**
   * Find a single entity by conditions and load its relationships
   */
  async findOneWithRelations(
    where: WhereParamsI,
    options: FindWithRelationsOptions = {},
  ): Promise<any> {
    const entity = await this.model.findOne({
      where,
      session: options.session,
      order: options.order,
      plain: options.plain,
      throwIfNotFound: options.throwIfNotFound || false,
    });

    if (!entity) return null;

    return this.loadRelations(entity, options);
  }

  /**
   * Find multiple entities by conditions and load their relationships
   */
  async findManyWithRelations(
    where: WhereParamsI = {},
    options: FindWithRelationsOptions = {},
  ): Promise<any[]> {
    const entities = await this.model.findMany({
      where,
      limit: options.limit,
      skip: options.skip,
      order: options.order,
      session: options.session,
      plain: options.plain,
      throwIfNoneFound: options.throwIfNoneFound || false,
    });

    if (!entities.length) return [];

    return Promise.all(entities.map((entity: any) => this.loadRelations(entity, options)));
  }

  /**
   * Search for related nodes within relationships matching criteria
   */
  async searchInRelations(
    where: WhereParamsI,
    relationAlias: string,
    searchOptions: any = {},
  ): Promise<any[]> {
    const entities = await this.model.findMany({
      where,
      session: searchOptions.session,
    });
    if (!entities.length) return [];

    const allResults: any[] = [];

    for (const entity of entities) {
      try {
        const relationships = await entity.findRelationships({
          alias: relationAlias,
          where: searchOptions.where,
          limit: searchOptions.limit,
          session: searchOptions.session,
        });

        const results = relationships.map((rel: any) => {
          const targetData = rel.target.getDataValues ? rel.target.getDataValues() : rel.target;
          if (rel.relationship && Object.keys(rel.relationship).length > 0) {
            targetData._relationshipProperties = rel.relationship;
          }
          return targetData;
        });

        allResults.push(...results);
      } catch {
        // Skip errors silently
      }
    }

    return allResults;
  }

  /**
   * Create multiple relationships from source entities to target entities
   * This method handles bidirectional relationship creation automatically
   */
  async createMultipleRelations(
    sourceWhere: WhereParamsI,
    relations: any[],
    options: any = {},
  ): Promise<{ success: boolean; created: number; errors: string[] }> {
    const entities = await this.model.findMany({
      where: sourceWhere,
      session: options.session,
    });

    if (!entities.length) {
      return {
        success: false,
        created: 0,
        errors: ["No source entities found"],
      };
    }

    let created = 0;
    let bidirectionalCreated = 0;
    const errors: string[] = [];
    const processedRelations = new Set<string>(); // Track processed relations to avoid duplicates

    for (const entity of entities) {
      for (const relation of relations) {
        const targetWheres = Array.isArray(relation.targetWhere)
          ? relation.targetWhere
          : [relation.targetWhere];

        for (const targetWhere of targetWheres) {
          try {
            // Create forward relationship
            await entity.relateTo({
              alias: relation.alias,
              where: targetWhere,
              properties: relation.properties,
              session: options.session,
            });
            created++;

            // Check if this is a bidirectional relationship
            const bidirectionalInfo = this.bidirectionalRelationships.get(relation.alias);
            if (bidirectionalInfo) {
              const { targetModel, reverseAlias } = bidirectionalInfo;

              // Find the target entity
              const targetEntity = await targetModel.findOne({
                where: targetWhere,
                session: options.session,
              });

              if (targetEntity) {
                // Create the reverse relationship with the same properties
                const relationKey = `${entity.id || JSON.stringify(entity)}-${targetEntity.id || JSON.stringify(targetEntity)}-${relation.alias}`;

                // Skip if we've already processed this bidirectional pair
                if (!processedRelations.has(relationKey)) {
                  await targetEntity.relateTo({
                    alias: reverseAlias,
                    where: entity,
                    properties: relation.properties, // Use same properties for consistency
                    session: options.session,
                  });
                  bidirectionalCreated++;
                  processedRelations.add(relationKey);
                }
              }
            }
          } catch (error: any) {
            errors.push(`Failed to create relation ${relation.alias}: ${error.message}`);
          }
        }
      }
    }

    // Adjust the expected count if bidirectional relationships were created
    const totalCreated = created + bidirectionalCreated;
    if (options.assertCreatedRelationships && totalCreated !== options.assertCreatedRelationships) {
      errors.push(
        `Expected ${options.assertCreatedRelationships} relations, created ${totalCreated}`,
      );
      return { success: false, created: totalCreated, errors };
    }

    return { success: errors.length === 0, created: totalCreated, errors };
  }

  /**
   * Delete relationships between entities
   * If the relationship is bidirectional, also delete the reverse relationship
   */
  async deleteRelationships(
    source: any,
    options: {
      alias: string;
      where?: WhereParamsI;
      session?: any;
    },
  ): Promise<{ success: boolean; deleted: number; errors: string[] }> {
    let deleted = 0;
    let bidirectionalDeleted = 0;
    const errors: string[] = [];
    const processedRelations = new Set<string>(); // Track processed relations to avoid duplicates

    try {
      // First, find all target entities related to the source
      const relationships = await source.findRelationships({
        alias: options.alias,
        where: options.where,
        session: options.session,
      });

      // Check if this is a bidirectional relationship
      const bidirectionalInfo = this.bidirectionalRelationships.get(options.alias);

      // Store target entities for bidirectional handling
      const targetEntities = bidirectionalInfo ? relationships.map((rel: any) => rel.target) : [];

      // Delete the forward relationships
      const result = await source.deleteRelationships(options);
      deleted = result.deleted || 0;

      // If bidirectional, delete reverse relationships
      if (bidirectionalInfo && targetEntities.length > 0) {
        const { reverseAlias } = bidirectionalInfo;

        for (const targetEntity of targetEntities) {
          // Create a unique key for this relationship pair
          const relationKey = `${source.id || JSON.stringify(source)}-${targetEntity.id || JSON.stringify(targetEntity)}-${options.alias}`;

          // Skip if we've already processed this bidirectional pair
          if (!processedRelations.has(relationKey)) {
            try {
              const reverseResult = await targetEntity.deleteRelationships({
                alias: reverseAlias,
                where: source,
                session: options.session,
              });

              bidirectionalDeleted += reverseResult.deleted || 0;
              processedRelations.add(relationKey);
            } catch (error: any) {
              errors.push(
                `Failed to delete bidirectional relation ${reverseAlias}: ${error.message}`,
              );
            }
          }
        }
      }

      return {
        success: errors.length === 0,
        deleted: deleted + bidirectionalDeleted,
        errors,
      };
    } catch (error: any) {
      return {
        success: false,
        deleted: deleted + bidirectionalDeleted,
        errors: [`Failed to delete relationships: ${error.message}`],
      };
    }
  }

  /**
   * Get relationship cardinality info
   */
  private getRelationInfo(alias: string): { isArray: boolean } {
    const definition = this.relationshipDefinitions[alias];

    if (definition?.cardinality) {
      return { isArray: definition.cardinality === "many" };
    }

    // Default to array if not specified
    return { isArray: true };
  }
}
