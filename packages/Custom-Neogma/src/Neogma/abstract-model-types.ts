import {
  CreateRelationshipParamsI,
  Neo4jSupportedProperties,
  Neo4jSupportedTypes,
  QueryBuilder,
  Runnable,
  UpdateTypes,
  WhereParamsI,
} from "neogma";
import { QueryResult } from "neo4j-driver";

type AnyObject = Record<string, any>;
/** the type of the properties to be added to a relationship */
export type RelationshipPropertiesI = Record<string, Neo4jSupportedTypes | undefined>;
export interface GenericConfiguration {
  session?: Runnable | null;
}

/** to be used in create functions where the related nodes can be passed for creation */
export type RelatedNodesCreationParamI<RelatedNodesToAssociateI extends AnyObject> = {
  [key in keyof Partial<RelatedNodesToAssociateI>]: RelationshipTypePropertyForCreateI<
    RelatedNodesToAssociateI[key]["CreateData"],
    RelatedNodesToAssociateI[key]["CreateRelationshipProperties"]
  >;
};
/** the type to be used in RelationshipTypePropertyForCreateI.where */
type RelationshipTypePropertyForCreateWhereI<
  RelationshipProperties extends RelationshipPropertiesI,
> = {
  /** where for the target nodes */
  params: WhereParamsI;
  /** whether to merge instead of create the relationship */
  merge?: boolean;
  relationshipProperties?: Partial<RelationshipProperties>;
};
/** the type of the relationship along with the properties, so the proper relationship and/or nodes can be created */
type RelationshipTypePropertyForCreateI<
  Properties,
  RelationshipProperties extends RelationshipPropertiesI,
> = {
  /** create new nodes and create a relationship with them */
  properties?: Array<Properties & Partial<RelationshipProperties>>;
  /** configuration for merging instead of creating the properties/relationships */
  propertiesMergeConfig?: {
    /** merge the created nodes instead of creating them */
    nodes?: boolean;
    /** merge the relationship with the created properties instead of creating it */
    relationship?: boolean;
  };
  /** create a relationship with nodes which are matched by the where */
  where?:
    | RelationshipTypePropertyForCreateWhereI<RelationshipProperties>
    | Array<RelationshipTypePropertyForCreateWhereI<RelationshipProperties>>;
};
type IValidationSchema<T = AnyObject> = Revalidator.ISchema<T> & {
  required: boolean;
};
/** the type for the Relationship configuration of a Model */
export type RelationshipsI<RelatedNodesToAssociateI extends AnyObject> = {
  [alias in keyof RelatedNodesToAssociateI]: {
    /** the related model. It could be the object of the model, or "self" for this model */
    model: NeogmaModel<any, any, any, any> | "self";
    /** the name of the relationship */
    name: CreateRelationshipParamsI["relationship"]["name"];
    /** the direction of the relationship */
    direction: "out" | "in" | "none";
    /** relationship properties */
    properties?: {
      [relationshipPropertyAlias in keyof RelatedNodesToAssociateI[alias]["CreateRelationshipProperties"]]: {
        /** the actual property to be used on the relationship */
        property: keyof RelatedNodesToAssociateI[alias]["RelationshipProperties"];
        /** validation for the property */
        schema: IValidationSchema;
      };
    };
  };
};
/** parameters when creating nodes */
type CreateDataParamsI = GenericConfiguration & {
  /** whether to merge instead of creating */
  merge?: boolean;
  /** validate all parent and children instances. default to true */
  validate?: boolean;
  /** the relationships which were created by a "where" param must equal to this number */
  assertRelationshipsOfWhere?: number;
};
/** type used for creating nodes. It includes their Properties and Related Nodes */
type CreateDataI<Properties, RelatedNodesToAssociateI extends AnyObject> = Properties &
  Partial<RelatedNodesCreationParamI<RelatedNodesToAssociateI>>;
type UpdateDataI<Properties> = {
  [K in keyof Properties]?: undefined extends Properties[K]
    ? Properties[K] | UpdateTypes["Remove"]
    : Properties[K];
};
/** the statics of a Neogma Model */
interface NeogmaModelStaticsI<
  Properties extends Neo4jSupportedProperties,
  RelatedNodesToAssociateI extends AnyObject = object,
  MethodsI extends AnyObject = object,
  CreateData = CreateDataI<
    Omit<Properties, "id" | "createdAt" | "updatedAt" | "needsUpdate" | "needsDelete">,
    RelatedNodesToAssociateI
  >,
  UpdateData = UpdateDataI<Properties>,
  Instance = NeogmaInstance<Properties, RelatedNodesToAssociateI, MethodsI>,
  InstanceWithRelations = NeogmaInstance<
    Properties & RelatedNodesToAssociateI,
    RelatedNodesToAssociateI,
    MethodsI
  >,
> {
  prototype: MethodsI;
  relationships: Partial<RelationshipsI<RelatedNodesToAssociateI>>;
  addRelationships: (relationships: Partial<RelationshipsI<RelatedNodesToAssociateI>>) => void;
  getLabel: (operation?: Parameters<typeof QueryBuilder.getNormalizedLabels>[1]) => string;
  getRawLabels: () => string[];
  getPrimaryKeyField: () => string | null;
  getModelName: () => string;
  beforeDelete: (instance: Instance) => void;
  checkIsTraceability: () => boolean;
  skipNeedUpdateOrSkipNeedDelete: (project_Id: string) => Promise<void>;
  deleteDynamicRelationship: (firstID: string, socndID: string) => Promise<boolean>;
  makeRelationship: (sourceID: string, targetID: string) => Promise<any>;
  getProject: (id: string) => void;
  getNeogma: any;
  getRelationshipByAlias: <Alias extends keyof RelatedNodesToAssociateI>(
    alias: Alias,
  ) => Pick<RelatedNodesToAssociateI[Alias], "name" | "direction" | "model">;
  reverseRelationshipConfiguration: <Alias extends keyof RelatedNodesToAssociateI>(
    alias: Alias,
  ) => RelationshipsI<RelatedNodesToAssociateI>[Alias];
  update: (
    data: UpdateData,
    params?: GenericConfiguration & {
      where?: WhereParamsI;
      /** defaults to false. Whether to return the properties of the nodes after the update. If it's false, the first entry of the return value of this function will be an empty array */
      return?: boolean;
    },
  ) => Promise<Properties[]>;
  updateRelationship: (
    data: AnyObject,
    params: {
      alias: keyof RelatedNodesToAssociateI;
      where?: {
        source?: WhereParamsI;
        target?: WhereParamsI;
        relationship?: WhereParamsI;
      };
      session?: GenericConfiguration["session"];
    },
  ) => Promise<QueryResult>;
  delete: (
    configuration?: GenericConfiguration & {
      detach?: boolean;
      where: WhereParamsI;
    },
  ) => Promise<number>;
  findMany: <Plain extends boolean = false>(
    params?: GenericConfiguration & {
      /** where params for the nodes of this Model */
      where?: WhereParamsI;
      limit?: number;
      skip?: number;
      order?: Array<[Extract<keyof Properties, string>, "ASC" | "DESC"]>;
      /** returns an array of the plain properties, instead of Instances */
      plain?: Plain;
      /** throws an error if no nodes are found (results length 0) */
      throwIfNoneFound?: boolean;
    },
  ) => Promise<Properties[]>;
  findOne: <Plain extends boolean = false>(
    params?: GenericConfiguration & {
      /** where params for the nodes of this Model */
      where?: WhereParamsI;
      order?: Array<[Extract<keyof Properties, string>, "ASC" | "DESC"]>;
      /** returns the plain properties, instead of Instance */
      plain?: Plain;
      /** throws an error if the node is not found */
      throwIfNotFound?: boolean;
    },
  ) => Promise<Properties | null>;
  getLabelFromRelationshipModel: (
    relationshipModel: NeogmaModel<any, any, object, object> | "self",
  ) => string;
  getRelationshipModel: (
    relationshipModel: NeogmaModel<any, any, object, object> | "self",
  ) => NeogmaModel<any, any, object, object>;
  /** asserts that the given primaryKeyField exists. Also returns it for typescript purposes */
  assertPrimaryKeyField: (primaryKeyField: string | undefined, operation: string) => string;
  findRelationships: <Alias extends keyof RelatedNodesToAssociateI>(params: {
    alias: Alias;
    where?: {
      source?: WhereParamsI;
      target?: WhereParamsI;
      relationship?: WhereParamsI;
    };
    /** a limit to apply to the fetched relationships */
    limit?: number;
    /** variable length relationship: minimum hops */
    minHops?: number;
    /** variable length relationship: maximum hops. The value Infinity can be used for no limit on the max hops */
    maxHops?: number;
    session?: GenericConfiguration["session"];
  }) => Promise<
    Array<{
      source: Instance;
      target: RelatedNodesToAssociateI[Alias]["Instance"];
      relationship: RelatedNodesToAssociateI[Alias]["RelationshipProperties"];
    }>
  >;
  /**
   * returns the count of the deleted relationships
   */
  deleteRelationships: <Alias extends keyof RelatedNodesToAssociateI>(params: {
    alias: Alias;
    where: {
      source?: WhereParamsI;
      target?: WhereParamsI;
      relationship?: WhereParamsI;
    };
    session?: GenericConfiguration["session"];
  }) => Promise<number>;

  findOneWithRelations: <Plain extends boolean = false>(
    params?: GenericConfiguration & {
      /** where params for the nodes of this Model */
      where?: WhereParamsI;
      order?: Array<[Extract<keyof Properties, string>, "ASC" | "DESC"]>;
      /** returns the plain properties, instead of Instance */
      plain?: Plain;
      /** throws an error if the node is not found */
      throwIfNotFound?: boolean;
      // Special additions for relations
      include?: Array<keyof RelatedNodesToAssociateI>;
      exclude?: Array<keyof RelatedNodesToAssociateI>;
      limits?: Record<string, number>;
      direction?: "out" | "in" | "none";
    },
  ) => Promise<(Properties & RelatedNodesToAssociateI) | null>;

  findManyWithRelations: <Plain extends boolean = false>(
    params?: GenericConfiguration & {
      /** where params for the nodes of this Model */
      where?: WhereParamsI;
      limit?: number;
      skip?: number;
      order?: Array<[Extract<keyof Properties, string>, "ASC" | "DESC"]>;
      /** returns an array of the plain properties, instead of Instances */
      plain?: Plain;
      /** throws an error if no nodes are found (results length 0) */
      throwIfNoneFound?: boolean;
      // Special additions for relations
      include?: Array<keyof RelatedNodesToAssociateI>;
      exclude?: Array<keyof RelatedNodesToAssociateI>;
      limits?: Record<string, number>;
      direction?: "out" | "in" | "none";
    },
  ) => Promise<Array<Properties & RelatedNodesToAssociateI>>;

  findByRelatedEntity: <Plain extends boolean = false>(
    params: GenericConfiguration & {
      /** where params for the related entities to match against */
      whereRelated: WhereParamsI;
      /** the alias of the relationship to traverse (predefined relationship) */
      relationshipAlias?: keyof RelatedNodesToAssociateI;
      /** dynamic relationship configuration (for relationships not defined in model) */
      dynamicRelationship?: {
        name: string;
        direction?: "out" | "in" | "none";
        targetLabel?: string;
        relationshipWhere?: WhereParamsI; // Filter by relationship properties
      };
      /** additional where params for the nodes of this Model */
      where?: WhereParamsI;
      limit?: number;
      skip?: number;
      order?: Array<[Extract<keyof Properties, string>, "ASC" | "DESC"]>;
      /** returns an array of the plain properties, instead of Instances */
      plain?: Plain;
      /** throws an error if no nodes are found (results length 0) */
      throwIfNoneFound?: boolean;
      // Special additions for relations
      include?: Array<keyof RelatedNodesToAssociateI>;
      exclude?: Array<keyof RelatedNodesToAssociateI>;
      limits?: Record<string, number>;
      direction?: "out" | "in" | "none";
    },
  ) => Promise<Array<Properties & RelatedNodesToAssociateI>>;

  findByRelationshipProperties: <Plain extends boolean = false>(
    relationshipAlias: keyof RelatedNodesToAssociateI,
    whereRelationship: WhereParamsI,
    options?: GenericConfiguration & {
      where?: WhereParamsI; // Optional filters for the source entity
      whereTarget?: WhereParamsI; // Optional filters for the target entity
      limit?: number; // Limit the number of results
      skip?: number; // Skip results (for pagination)
      order?: Array<[string, "ASC" | "DESC"]>; // Ordering
      plain?: Plain; // Return plain objects instead of instances
      include?: Array<keyof RelatedNodesToAssociateI>; // Additional relationships to include for target
      exclude?: Array<keyof RelatedNodesToAssociateI>; // Relationships to exclude for target
      limits?: Record<string, number>; // Limits for included relationships
      direction?: "out" | "in" | "none";
    },
  ) => Promise<
    Array<{
      source: Plain extends true ? Properties : Instance;
      relationship: RelatedNodesToAssociateI[typeof relationshipAlias]["RelationshipProperties"];
      target: Plain extends true
        ? RelatedNodesToAssociateI[typeof relationshipAlias]["Instance"] & RelatedNodesToAssociateI
        : RelatedNodesToAssociateI[typeof relationshipAlias]["Instance"];
    }>
  >;

  /**
   * Updates a single entity and returns it, or throws an exception if no entity was found.
   * This is a convenience method that combines update with error handling.
   *
   * @param data - The properties to update
   * @param params - Optional parameters including where conditions
   * @returns The updated entity
   * @throws Error if no entity matches the where conditions
   */
  updateOneOrThrow: (
    data: UpdateData,
    params?: GenericConfiguration & {
      where?: WhereParamsI;
      /** Always true for this method */
      return?: boolean;
      session?: GenericConfiguration["session"];
    },
  ) => Promise<Properties>;
}

/** the type of instance of the Model */
export type NeogmaInstance<
  /** the properties used in the Model */
  Properties extends Neo4jSupportedProperties,
  RelatedNodesToAssociateI extends AnyObject,
  /** the Methods used in the Model */
  MethodsI extends AnyObject = object,
> = Properties & RelatedNodesToAssociateI;
/** the type of a Neogma Model */
export type NeogmaModel<
  Properties extends Neo4jSupportedProperties,
  RelatedNodesToAssociateI extends AnyObject,
  MethodsI extends AnyObject = object,
  StaticsI extends AnyObject = object,
> = NeogmaModelStaticsI<Properties, RelatedNodesToAssociateI>;
