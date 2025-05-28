import { Neogma, WhereParamsI } from "neogma";
import { FetchRelationsOptions, FindWithRelationsOptions } from "./types";

// =============================================================================
// RELATIONSHIP UTILITIES
// =============================================================================

/**
 * Helper class for managing Neo4j relationships using Neogma models
 */
export class RelationshipManager {
  constructor(
    private model: any,
    private neogma: Neogma,
    private relationshipDefinitions: Record<string, { cardinality?: "one" | "many" }>,
  ) {}

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
    const errors: string[] = [];

    for (const entity of entities) {
      for (const relation of relations) {
        const targetWheres = Array.isArray(relation.targetWhere)
          ? relation.targetWhere
          : [relation.targetWhere];

        for (const targetWhere of targetWheres) {
          try {
            await entity.relateTo({
              alias: relation.alias,
              where: targetWhere,
              properties: relation.properties,
              session: options.session,
            });
            created++;
          } catch (error: any) {
            errors.push(`Failed to create relation ${relation.alias}: ${error.message}`);
          }
        }
      }
    }

    if (options.assertCreatedRelationships && created !== options.assertCreatedRelationships) {
      errors.push(`Expected ${options.assertCreatedRelationships} relations, created ${created}`);
      return { success: false, created, errors };
    }

    return { success: errors.length === 0, created, errors };
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
