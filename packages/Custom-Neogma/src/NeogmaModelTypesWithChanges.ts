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
interface GenericConfiguration {
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
  CreateData = CreateDataI<Omit<Properties, "id">, RelatedNodesToAssociateI>,
  UpdateData = UpdateDataI<Properties>,
  Instance = NeogmaInstance<Properties, RelatedNodesToAssociateI, MethodsI>,
> {
  prototype: MethodsI;
  relationships: Partial<RelationshipsI<RelatedNodesToAssociateI>>;
  addRelationships: (relationships: Partial<RelationshipsI<RelatedNodesToAssociateI>>) => void;
  getLabel: (operation?: Parameters<typeof QueryBuilder.getNormalizedLabels>[1]) => string;
  getRawLabels: () => string[];
  getPrimaryKeyField: () => string | null;
  getModelName: () => string;
  beforeCreate: (instance: Instance) => void;
  beforeDelete: (instance: Instance) => void;
  /**
   * builds data Instance by data, setting information fields appropriately
   * status 'new' can be called publicly (hence the .build wrapper), but 'existing' should be used only internally when building instances after finding nodes from the database
   */
  build: (
    data: CreateData,
    params?: {
      status?: "new" | "existing";
    },
  ) => Instance;
  /** builds an instance from a database record. It needs to correspond to a node, by having a "properties" and "labels" field */
  buildFromRecord: (record: { properties: Properties; labels: string[] }) => Instance;
  createOne: (data: CreateData, configuration?: CreateDataParamsI) => Promise<Instance>;
  createMany: (data: CreateData[], configuration?: CreateDataParamsI) => Promise<Instance[]>;
  getRelationshipConfiguration: <Alias extends keyof RelatedNodesToAssociateI>(
    alias: Alias,
  ) => Required<RelationshipsI<RelatedNodesToAssociateI>[Alias]>;
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
  ) => Promise<[Instance[], QueryResult]>;
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
  /** returns the relationship properties to be created, from the data in dataToUse (with the alias as a key) */
  getRelationshipProperties: (
    relationship: RelationshipsI<any>[0],
    dataToUse: Neo4jSupportedProperties,
  ) => Neo4jSupportedProperties;
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
  ) => Promise<Plain extends true ? Properties[] : Instance[]>;
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
  ) => Promise<(Plain extends true ? Properties : Instance) | null>;
  createRelationship: (
    params: CreateRelationshipParamsI & {
      /** throws an error if the number of created relationships don't equal to this number */
      assertCreatedRelationships?: number;
    },
  ) => Promise<number>;
  getLabelFromRelationshipModel: (
    relationshipModel: NeogmaModel<any, any, object, object> | "self",
  ) => string;
  getRelationshipModel: (
    relationshipModel: NeogmaModel<any, any, object, object> | "self",
  ) => NeogmaModel<any, any, object, object>;
  /** asserts that the given primaryKeyField exists. Also returns it for typescript purposes */
  assertPrimaryKeyField: (primaryKeyField: string | undefined, operation: string) => string;
  relateTo: <Alias extends keyof RelatedNodesToAssociateI>(params: {
    alias: Alias;
    where: {
      source: WhereParamsI;
      target: WhereParamsI;
    };
    properties?: RelatedNodesToAssociateI[Alias]["CreateRelationshipProperties"];
    /** throws an error if the number of created relationships don't equal to this number */
    assertCreatedRelationships?: number;
    session?: GenericConfiguration["session"];
  }) => Promise<number>;
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
}
/** the methods of a Neogma Instance */
interface NeogmaInstanceMethodsI<
  Properties extends Neo4jSupportedProperties,
  RelatedNodesToAssociateI extends AnyObject,
  MethodsI extends AnyObject,
  Instance = NeogmaInstance<Properties, RelatedNodesToAssociateI, MethodsI>,
> {
  __existsInDatabase: boolean;
  dataValues: Properties;
  changed: Record<keyof Properties, boolean>;
  labels: string[];
  getDataValues: () => Properties;
  save: (configuration?: CreateDataParamsI) => Promise<Instance>;
  validate: () => Promise<void>;
  updateRelationship: (
    data: AnyObject,
    params: {
      alias: keyof RelatedNodesToAssociateI;
      where?: {
        target?: WhereParamsI;
        relationship?: WhereParamsI;
      };
      session?: GenericConfiguration["session"];
    },
  ) => Promise<QueryResult>;
  delete: (
    configuration?: GenericConfiguration & {
      detach?: boolean;
    },
  ) => Promise<number>;
  relateTo: <Alias extends keyof RelatedNodesToAssociateI>(params: {
    alias: Alias;
    where: WhereParamsI;
    properties?: RelatedNodesToAssociateI[Alias]["CreateRelationshipProperties"];
    /** throws an error if the number of created relationships don't equal to this number */
    assertCreatedRelationships?: number;
    session?: GenericConfiguration["session"];
  }) => Promise<number>;
  findRelationships: <Alias extends keyof RelatedNodesToAssociateI>(params: {
    alias: Alias;
    where?: {
      relationship: WhereParamsI;
      target: WhereParamsI;
    };
    /** a limit to apply to the fetched relationships */
    limit?: number;
    session?: GenericConfiguration["session"];
  }) => Promise<
    Array<{
      source: Instance;
      target: RelatedNodesToAssociateI[Alias]["Instance"];
      relationship: RelatedNodesToAssociateI[Alias]["RelationshipProperties"];
    }>
  >;
}
/** the type of instance of the Model */
export type NeogmaInstance<
  /** the properties used in the Model */
  Properties extends Neo4jSupportedProperties,
  RelatedNodesToAssociateI extends AnyObject,
  /** the Methods used in the Model */
  MethodsI extends AnyObject = object,
> = Properties & NeogmaInstanceMethodsI<Properties, RelatedNodesToAssociateI, MethodsI> & MethodsI;
/** the type of a Neogma Model */
export type NeogmaModel<
  Properties extends Neo4jSupportedProperties,
  RelatedNodesToAssociateI extends AnyObject,
  MethodsI extends AnyObject = object,
  StaticsI extends AnyObject = object,
> = NeogmaModelStaticsI<Properties, RelatedNodesToAssociateI, MethodsI> & StaticsI;
