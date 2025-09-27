import { DynamicRelation, FetchRelationsOptions } from "./types";
import { BindParam, QueryBuilder, WhereParamsI } from "neogma";
import { NeogmaModel } from "./Neogma/normal-model-types";

/**
 * Helper class for managing Neo4j graph relationships using Neogma ORM models.
 * Provides utilities for loading, querying, and validating graph relationships.
 */
export class NeogmaGraphRelationService {
  /**
   * Creates a new graph relationship service
   *
   * @param model - The Neogma model this service operates on
   * @param relationshipDefinitions - Definitions for relationships including cardinality constraints
   */
  constructor(
    private model: NeogmaModel<any, any>,
    private relationshipDefinitions: Record<string, { cardinality?: "one" | "many" }>,
  ) {}

  /**
   * Load specified relationships for an entity with optional filters and limits
   *
   * @param entity - The entity to load relationships for
   * @param options - Configuration options for relationship loading
   * @returns The entity with loaded relationships
   */
  async loadRelations(entity: any, options: FetchRelationsOptions = {}): Promise<any> {
    const relationships = this.model.relationships || {};
    let relationAliases = Object.keys(relationships);

    // Filter relations based on include/exclude options
    if (options.include?.length) {
      relationAliases = relationAliases.filter((alias) => options.include!.includes(alias));
    }
    if (options.exclude?.length) {
      relationAliases = relationAliases.filter((alias) => !options.exclude!.includes(alias));
    }

    // Get base entity data
    const result = entity.getDataValues ? entity.getDataValues() : { ...entity };

    // Load defined relationships
    const loadPromises = relationAliases.map(async (alias) => {
      try {
        const { isArray } = this.getRelationInfo(alias);
        const relationshipConfig = this.model.relationships[alias];

        // Load relationships with direction support
        const relationships = await this.loadRelationshipWithDirection(
          entity,
          alias,
          options.direction,
          options.limits?.[alias],
          options.session,
        );

        // Check cardinality constraints
        if (!isArray && relationships.length > 1) {
          console.warn(
            `Relationship cardinality exceeded: '${alias}' defined as 'one' but found ${relationships.length} relationships.`,
          );
        }

        const data = relationships.map((rel: any) => {
          const targetData = rel.target.getDataValues ? rel.target.getDataValues() : rel.target;
          // Add relationship properties
          if (rel.relationship && Object.keys(rel.relationship).length > 0) {
            targetData.relationshipProperties = rel.relationship;
          }
          // Add relationship direction info
          targetData.direction = relationshipConfig?.direction;
          // Add relationship name
          targetData.relationshipName = relationshipConfig?.name;
          return targetData;
        });

        return { alias, data: isArray ? data : data[0] || null };
      } catch (error) {
        console.error(`Error loading relationship ${alias}:`, error);
        const { isArray } = this.getRelationInfo(alias);
        return { alias, data: isArray ? [] : null };
      }
    });

    // Handle dynamic relations
    if (options.dynamicRelations?.length) {
      const dynamicPromises = options.dynamicRelations.map(async (dynamicRelation) => {
        try {
          // Use alias from dynamic relation or fall back to name
          const alias = dynamicRelation.alias || dynamicRelation.name;
          const isArray = dynamicRelation.many !== false; // Default to true

          // Load the dynamic relation
          const relationships = await this.loadDynamicRelation(
            entity,
            dynamicRelation,
            options.session,
          );

          return {
            alias,
            data: isArray ? relationships : relationships[0] || null,
          };
        } catch (error) {
          console.error(`Error loading dynamic relationship ${dynamicRelation.name}:`, error);
          const isArray = dynamicRelation.many !== false;
          return {
            alias: dynamicRelation.alias || dynamicRelation.name,
            data: isArray ? [] : null,
          };
        }
      });

      // Combine standard and dynamic relationship promises
      loadPromises.push(...dynamicPromises);
    }

    // Wait for all relationships and add them to the result
    const results = await Promise.all(loadPromises);
    results.forEach(({ alias, data }) => {
      result[alias] = data;
    });

    return result;
  }

  /**
   * Loads relationships with support for custom direction
   * Allows overriding the direction defined in the model
   *
   * @param entity - The entity to load relationships for
   * @param alias - Alias of the relationship to load
   * @param direction - Optional direction override (out/in/none)
   * @param limit - Optional limit on number of relationships to load
   * @param session - Optional database session
   * @returns Array of relationship objects
   */
  async loadRelationshipWithDirection(
    entity: any,
    alias: string,
    direction?: "out" | "in" | "none",
    limit?: number,
    session?: any,
  ): Promise<any[]> {
    // If no direction specified, use standard method
    if (!direction) {
      return entity.findRelationships({
        alias,
        limit,
        session,
      });
    }

    // Get relationship configuration
    const relationships = this.model.relationships || {};
    const relationshipConfig = relationships[alias];

    if (!relationshipConfig) {
      console.warn(`Relationship '${alias}' not found in model`);
      return [];
    }

    // Get primary key field and entity ID
    const primaryKeyField = this.model.getPrimaryKeyField();

    if (!primaryKeyField) {
      console.warn(`Model does not have a defined primaryKeyField`);
      return [];
    }

    const entityData = entity.getDataValues ? entity.getDataValues() : entity;
    const entityId = entityData[primaryKeyField];

    if (!entityId) {
      console.warn(`Entity does not have a value for primary field '${primaryKeyField}'`);
      return [];
    }

    // Get the related model
    let relatedModel;
    if (relationshipConfig.model === "self") {
      relatedModel = this.model;
    } else if (typeof relationshipConfig.model === "string") {
      // Find model by name in registry
      const registry = require("./model-registry").ModelRegistry.getInstance();
      relatedModel = registry.get(relationshipConfig.model);
      if (!relatedModel) {
        console.error(`Related model '${relationshipConfig.model}' not found`);
        return [];
      }
    } else {
      relatedModel = relationshipConfig.model;
    }

    // Configure query based on specified direction
    if (direction === "out") {
      // Outgoing direction (from current entity to others)
      return entity.findRelationships({
        alias,
        limit,
        session,
      });
    } else if (direction === "in") {
      // Incoming direction (from other entities to current)
      // For this, we need to invert the query
      const relationshipName = relationshipConfig.name;
      const invertedDirection =
        relationshipConfig.direction === "out"
          ? "in"
          : relationshipConfig.direction === "in"
            ? "out"
            : "none";

      // Find relationships from related model to current entity
      const results = await this.model.findRelationships({
        alias,
        where: {
          target: { [primaryKeyField]: entityId },
        },
        limit,
        session,
      });

      // Invert source and target in results for consistency
      return results.map((rel: { target: any; source: any; relationship: any }) => ({
        source: rel.target,
        target: rel.source,
        relationship: rel.relationship,
      }));
    } else {
      // 'none' - bidirectional relationship
      // For bidirectional relationships, we can use the standard query
      return entity.findRelationships({
        alias,
        limit,
        session,
      });
    }
  }

  /**
   * Find a single entity by conditions and load its relationships
   *
   * @param params - Query parameters and relationship loading options
   * @returns Entity with loaded relationships or null if not found
   */
  async findOneWithRelations(
    params: {
      where?: WhereParamsI;
      order?: Array<[string, "ASC" | "DESC"]>;
      plain?: boolean;
      throwIfNotFound?: boolean;
      session?: any;
      include?: any[];
      exclude?: any[];
      limits?: Record<string, number>;
      direction?: "out" | "in" | "none";
      dynamicRelations?: DynamicRelation[];
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

    if (params.dynamicRelations) {
      params.dynamicRelations.forEach((i) => {
        i.many = false;
      });
    }

    // Use the same params object as options for loading relations
    return this.loadRelations(entity, params);
  }

  /**
   * Find multiple entities by conditions and load their relationships
   *
   * @param params - Query parameters and relationship loading options
   * @returns Array of entities with loaded relationships
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
      include?: any[];
      exclude?: any[];
      limits?: Record<string, number>;
      direction?: "out" | "in" | "none";
      dynamicRelations?: DynamicRelation[];
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

    if (params.dynamicRelations) {
      params.dynamicRelations.forEach((i) => {
        i.many = true;
      });
    }

    // Load relationships for each entity
    return Promise.all(entities.map((entity: any) => this.loadRelations(entity, params)));
  }

  /**
   * Find entities based on their relationship with another entity.
   * Works through existing relationship definitions in the current model.
   *
   * @example
   * // Get all projects owned by a specific user (through 'owner' relationship)
   * const projects = await ProjectModel.findByRelatedEntity({
   *   whereRelated: { id: 'user-123' },
   *   relationshipAlias: 'owner'
   * });
   *
   * @param params - Query parameters for finding related entities
   * @returns Array of entities related to the specified entity
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
    direction?: "out" | "in" | "none";
  }): Promise<any[]> {
    // Verify relationship exists in current model
    const relationships = this.model.relationships || {};
    const relationship = relationships[params.relationshipAlias as string];

    if (!relationship) {
      throw new Error(
        `Relationship "${String(params.relationshipAlias)}" does not exist in the model`,
      );
    }

    // Use existing findRelationships to find connections
    const results = await this.model.findRelationships({
      alias: params.relationshipAlias,
      where: {
        target: params.whereRelated, // Conditions for related entity
        source: params.where, // Additional filters on current model entities
      },
      limit: params.limit,
      session: params.session,
    });

    if (!results.length) {
      if (params.throwIfNoneFound) {
        throw new Error(`No entities found matching the specified criteria`);
      }
      return [];
    }

    // Extract source entities (current model entities)
    // and add direction and relationship name info to each result
    let foundEntities = results.map((rel: any) => {
      const sourceEntity = rel.source;

      // Add relationship info to entity
      if (sourceEntity.getDataValues) {
        const dataValues = sourceEntity.getDataValues();
        dataValues._relationshipInfo = {
          direction: relationship.direction,
          name: relationship.name,
          properties: rel.relationship,
        };
        // Reassign data with additional info
        Object.keys(dataValues).forEach((key) => {
          sourceEntity[key] = dataValues[key];
        });
      } else {
        sourceEntity._relationshipInfo = {
          direction: relationship.direction,
          name: relationship.name,
          properties: rel.relationship,
        };
      }

      return sourceEntity;
    });

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

    // Apply skip and limits
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
   * @param relationshipAlias - The alias of the relationship to search
   * @param whereRelationship - Conditions to filter relationships by their properties
   * @param options - Additional options for the query
   * @returns Array of relationship objects with source and target nodes
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
      direction: "out" | "in" | "none";
      relationshipName: string;
    }>
  > {
    // Verify relationship exists
    const relationships = this.model.relationships || {};
    // @ts-ignore
    const relationship = relationships[relationshipAlias];

    if (!relationship) {
      throw new Error(`Relationship "${relationshipAlias as string}" does not exist in the model`);
    }

    // Find relationships matching criteria
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

    // Add direction and relationship name info to each result
    const enhancedResults = results.map((result: any) => ({
      ...result,
      direction: relationship.direction,
      relationshipName: relationship.name,
    }));

    // If we need to load additional relationships for target nodes
    if (options.include?.length || options.exclude?.length || options.limits) {
      // Process each result to load additional relationships for target nodes
      const processedResults = await Promise.all(
        enhancedResults.map(async (result: any) => {
          // Load additional relationships for target node
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
            direction: result.direction,
            relationshipName: result.relationshipName,
          };
        }),
      );

      // Apply ordering and pagination after processing
      return this.applyOrderingAndPagination(processedResults, options);
    }

    // Apply ordering and pagination
    return this.applyOrderingAndPagination(enhancedResults, options);
  }

  /**
   * Load a dynamic relationship based on custom criteria
   *
   * @param entity - The entity to load dynamic relationship for
   * @param relation - Dynamic relation configuration
   * @param session - Optional database session
   * @returns Array of related entities
   */
  async loadDynamicRelation(entity: any, relation: DynamicRelation, session?: any): Promise<any[]> {
    try {
      const entityData = entity.getDataValues ? entity.getDataValues() : entity;
      const primaryKeyField = this.model.getPrimaryKeyField();

      if (!primaryKeyField || !entityData[primaryKeyField]) {
        console.warn(`Cannot load dynamic relation: missing primary key value`);
        return [];
      }

      const entityId = entityData[primaryKeyField];
      const relationName = relation.name;
      const relationAlias = relation.alias || relationName;
      const direction = relation.direction || "out";
      const targetLabel = relation.targetLabel || "";
      const limit = relation.limit || undefined;

      // Build Cypher query based on parameters
      const bindParam = new BindParam();
      const queryBuilder = new QueryBuilder(bindParam);
      const sourceIdentifier = "source";
      const relationIdentifier = "r";
      const targetIdentifier = "target";

      // Match pattern based on direction
      if (direction === "out") {
        queryBuilder.match({
          related: [
            {
              identifier: sourceIdentifier,
              where: { [primaryKeyField]: entityId },
              label: this.model.getLabel(),
            },
            {
              direction: "out",
              name: relationName,
              identifier: relationIdentifier,
            },
            {
              identifier: targetIdentifier,
              label: targetLabel,
            },
          ],
        });
      } else if (direction === "in") {
        queryBuilder.match({
          related: [
            {
              identifier: targetIdentifier,
              label: targetLabel,
            },
            {
              direction: "in",
              name: relationName,
              identifier: relationIdentifier,
            },
            {
              identifier: sourceIdentifier,
              where: { [primaryKeyField]: entityId },
              label: this.model.getLabel(),
            },
          ],
        });
      } else {
        // 'none' or bidirectional
        queryBuilder.match({
          related: [
            {
              identifier: sourceIdentifier,
              where: { [primaryKeyField]: entityId },
              label: this.model.getLabel(),
            },
            {
              direction: "none",
              name: relationName,
              identifier: relationIdentifier,
            },
            {
              identifier: targetIdentifier,
              label: targetLabel,
            },
          ],
        });
      }

      queryBuilder.return([sourceIdentifier, targetIdentifier, relationIdentifier]);

      if (limit) {
        queryBuilder.limit(limit);
      }

      // Execute query
      const queryRunner = this.model.getNeogma().queryRunner;
      const result = await queryBuilder.run(queryRunner, session);

      // Process results
      return result.records.map((record) => {
        const target = record.get(targetIdentifier);
        const relationship = record.get(relationIdentifier);

        return {
          ...target.properties,
          // Add additional properties if needed
        };
      });
    } catch (error) {
      console.error(`Error loading dynamic relation: ${error.message}`);
      return [];
    }
  }

  /**
   * Validate cardinality constraints for a relationship
   *
   * @param entityId - The ID of the entity to validate
   * @param relationshipAlias - The relationship alias to validate
   * @param session - Optional database session
   * @throws Error when cardinality constraint would be violated
   */
  async validateCardinality(
    entityId: string,
    relationshipAlias: string,
    session?: any,
  ): Promise<void> {
    const definition = this.relationshipDefinitions[relationshipAlias];

    if (!definition?.cardinality || definition.cardinality === "many") {
      return;
    }

    const existingRelationships = await this.model.findRelationships({
      alias: relationshipAlias,
      where: {
        source: { id: entityId },
      },
      session,
    });

    if (existingRelationships.length > 0) {
      throw new Error(
        `Cardinality constraint violation: Cannot create another '${relationshipAlias}' relationship. ` +
          `Entity with ID '${entityId}' already has a relationship of this type and cardinality is defined as 'one'.`,
      );
    }
  }

  /**
   * Helper method to apply ordering and pagination to results
   *
   * @param results - The results to order and paginate
   * @param options - Ordering and pagination options
   * @returns Ordered and paginated results
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
   *
   * @param alias - The relationship alias
   * @returns Information about the relationship cardinality
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
   *
   * @param entities - Array of entities to de-duplicate
   * @returns Array with duplicates removed
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
