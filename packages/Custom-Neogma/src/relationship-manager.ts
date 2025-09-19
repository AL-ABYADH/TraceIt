import { FetchRelationsOptions } from "./types";
import { WhereParamsI } from "neogma";

/**
 * Helper class for managing Neo4j relationships using Neogma models
 */
export class RelationshipManager {
  constructor(
    private model: any,
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
            targetData.relationshipProperties = rel.relationship;
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
   * Parameters mirror the original findOne method for consistency
   */
  async findOneWithRelations(
    params: {
      where?: WhereParamsI;
      order?: Array<[string, "ASC" | "DESC"]>;
      plain?: boolean;
      throwIfNotFound?: boolean;
      session?: any;
      // Special additions for relations
      include?: any[];
      exclude?: any[];
      limits?: Record<string, number>;
    } = {},
  ): Promise<any> {
    const entity = await this.model.findOne({
      where: params?.where,
      order: params?.order,
      session: params?.session,
      plain: params?.plain,
      throwIfNotFound: params?.throwIfNotFound || false,
    });

    if (!entity) return null;

    // Use the same params object as options for loading relations
    return this.loadRelations(entity, params);
  }

  /**
   * Find multiple entities by conditions and load their relationships
   * Parameters mirror the original findMany method for consistency
   */
  async findManyWithRelations(
    params: {
      where?: WhereParamsI;
      limit?: number;
      skip?: number;
      order?: Array<[string, "ASC" | "DESC"]>;
      plain?: boolean;
      throwIfNoneFound?: boolean;
      session?: any;
      // Special additions for relations
      include?: any[];
      exclude?: any[];
      limits?: Record<string, number>;
    } = {},
  ): Promise<any[]> {
    const entities = await this.model.findMany({
      where: params?.where,
      limit: params?.limit,
      skip: params?.skip,
      order: params?.order,
      session: params?.session,
      plain: params?.plain,
      throwIfNoneFound: params?.throwIfNoneFound || false,
    });

    if (!entities.length) return [];

    // Use the same params object as options for loading relations
    return Promise.all(entities.map((entity: any) => this.loadRelations(entity, params)));
  }

  /**
   * Find entities based on their relationship with another entity.
   * This method works through the existing relationship definitions in the current model.
   *
   * @example
   * // Get all projects owned by a specific user (through 'owner' relationship)
   * const projects = await ProjectModel.findByRelatedEntity({
   *   whereRelated: { id: 'user-123' },
   *   relationshipAlias: 'owner'
   * });
   */
  async findByRelatedEntity(params: {
    whereRelated: WhereParamsI;
    relationshipAlias: keyof any;
    where?: WhereParamsI;
    limit?: number;
    skip?: number;
    order?: Array<[string, "ASC" | "DESC"]>;
    session?: any;
    plain?: boolean;
    throwIfNoneFound?: boolean;
    include?: any[];
    exclude?: any[];
    limits?: Record<string, number>;
  }): Promise<any[]> {
    // Check if the relationship alias exists in current model
    const relationships = this.model.relationships || {};
    const relationship = relationships[params.relationshipAlias as string];

    if (!relationship) {
      throw new Error(
        `Relationship alias "${String(params.relationshipAlias)}" not found in model`,
      );
    }

    console.log(params);
    // Use the existing findRelationships method to find connections
    // This will find all entities of current model that are connected to entities matching whereRelated
    const results = await this.model.findRelationships({
      alias: params.relationshipAlias,
      where: {
        target: params.whereRelated, // The related entity conditions
        source: params.where, // Additional filters on current model entities
      },
      limit: params.limit,
      session: params.session,
    });

    if (!results.length) {
      if (params.throwIfNoneFound) {
        throw new Error(`No entities found with the given criteria`);
      }
      return [];
    }

    // Extract source entities (the entities from current model)
    let foundEntities = results.map((rel: any) => rel.source);

    // Remove duplicates
    foundEntities = this.removeDuplicateEntities(foundEntities);

    // Apply ordering if specified
    if (params.order) {
      foundEntities.sort((a: any, b: any) => {
        const dataA = a.getDataValues ? a.getDataValues() : a;
        const dataB = b.getDataValues ? b.getDataValues() : b;

        for (const [field, direction] of params.order!) {
          const valueA = dataA[field];
          const valueB = dataB[field];

          if (valueA < valueB) return direction === "ASC" ? -1 : 1;
          if (valueA > valueB) return direction === "ASC" ? 1 : -1;
        }
        return 0;
      });
    }

    // Apply skip and limit
    if (params.skip) {
      foundEntities = foundEntities.slice(params.skip);
    }
    if (params.limit) {
      foundEntities = foundEntities.slice(0, params.limit);
    }

    // Load additional relationships if requested
    if (params.include || params.exclude || params.limits) {
      const entitiesWithRelations = await Promise.all(
        foundEntities.map((entity: any) =>
          this.loadRelations(entity, {
            include: params.include,
            exclude: params.exclude,
            limits: params.limits,
            session: params.session,
          }),
        ),
      );
      return entitiesWithRelations;
    }

    // Return plain data if requested
    if (params.plain) {
      return foundEntities.map((entity: any) =>
        entity.getDataValues ? entity.getDataValues() : entity,
      );
    }

    return foundEntities;
  }

  /**
   * Find relationships based on their properties and return both relationship data
   * and connected nodes with their relationships
   *
   * @param relationshipAlias The alias of the relationship to search
   * @param whereRelationship Conditions to filter relationships by their properties
   * @param options Additional options for the query
   */
  async findByRelationshipProperties(
    relationshipAlias: keyof any,
    whereRelationship: WhereParamsI,
    options: any = {},
  ): Promise<
    Array<{
      source: any;
      relationship: any;
      target: any;
    }>
  > {
    // Check if the relationship alias exists
    const relationships = this.model.relationships || {};
    const relationship = relationships[relationshipAlias];

    if (!relationship) {
      throw new Error(`Relationship alias "${relationshipAlias as string}" not found in model`);
    }

    // Find relationships matching the criteria
    const results = await this.model.findRelationships({
      alias: relationshipAlias,
      where: {
        source: options.where,
        target: options.whereTarget,
        relationship: whereRelationship,
      },
      limit: options.limit,
      session: options.session,
    });

    if (!results.length) {
      return [];
    }

    // If we need to load additional relationships for target nodes
    if (options.include?.length || options.exclude?.length || options.limits) {
      // Process each result to load additional relationships for target nodes
      const processedResults = await Promise.all(
        results.map(async (result: any) => {
          // Load additional relationships for the target node
          const targetWithRelations = await this.loadRelations(result.target, {
            include: options.include,
            exclude: options.exclude,
            limits: options.limits,
            session: options.session,
          });

          return {
            source: result.source,
            relationship: result.relationship,
            target: targetWithRelations,
          };
        }),
      );

      // Apply ordering, skip and limit after processing
      return this.applyOrderingAndPagination(processedResults, options);
    }

    // Apply ordering, skip and limit
    return this.applyOrderingAndPagination(results, options);
  }

  /**
   * Helper method to apply ordering and pagination to results
   */
  private applyOrderingAndPagination(
    results: any[],
    options: {
      order?: Array<[string, "ASC" | "DESC"]>;
      skip?: number;
      limit?: number;
    },
  ): any[] {
    let processedResults = [...results];

    // Apply ordering if specified
    if (options.order?.length) {
      processedResults.sort((a: any, b: any) => {
        for (const [field, direction] of options.order!) {
          // Try to get the value from the relationship properties
          const valueA = a.relationship[field];
          const valueB = b.relationship[field];

          if (valueA !== undefined && valueB !== undefined) {
            if (valueA < valueB) return direction === "ASC" ? -1 : 1;
            if (valueA > valueB) return direction === "ASC" ? 1 : -1;
          }
        }
        return 0;
      });
    }

    // Apply skip for pagination
    if (options.skip) {
      processedResults = processedResults.slice(options.skip);
    }

    // Apply limit
    if (options.limit) {
      processedResults = processedResults.slice(0, options.limit);
    }

    return processedResults;
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

  /**
   * Remove duplicate entities based on their ID
   */
  private removeDuplicateEntities(entities: any[]): any[] {
    const seen = new Set();
    return entities.filter((entity: any) => {
      const data = entity.getDataValues ? entity.getDataValues() : entity;
      const id = data.id;
      if (seen.has(id)) {
        return false;
      }
      seen.add(id);
      return true;
    });
  }
}
