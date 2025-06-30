import { Neo4jSupportedProperties, Neogma } from "neogma";
import { EnhancedNeogmaModel, EnhancedRelationshipsI, NeogmaSchema } from "./types";
import { ModelFactory } from "./model-factory";

/**
 * Custom error for operations disallowed on abstract (read-only) models.
 */
export class ReadOnlyModelError extends Error {
  constructor(operation: string, modelName: string) {
    super(
      `The operation '${operation}' is not allowed on the '${modelName}' model because it is defined as an abstract (read-only) model.`,
    );
    this.name = "ReadOnlyModelError";
  }
}

/**
 * List of write-related methods that are forbidden for abstract models.
 */
const FORBIDDEN_METHODS = [
  "createOne",
  "createMany",
  "delete",
  "update",
  "build",
  "buildFromRecord",
  "createRelationship",
  "relateTo",
  "updateRelationship",
  "deleteRelationships",
  "getRelationshipProperties",
  "createMultipleRelations",
];

/**
 * AbstractModelFactory creates a model that is intended to serve as a base
 * (read-only) model. It blocks write operations and exposes accessors for
 * inspecting the model configuration.
 */
export function AbstractModelFactory<
  Properties extends Neo4jSupportedProperties,
  RelatedNodes extends Record<string, any> = Record<string, any>,
  Methods extends Record<string, any> = Record<string, any>,
  Statics extends Record<string, any> = Record<string, any>,
>(
  parameters: {
    name: string;
    schema: NeogmaSchema<Omit<Properties, "id">>;
    label: string | string[];
    statics?: Partial<Statics>;
    methods?: Partial<Methods>;
    primaryKeyField?: Extract<keyof Properties, string>;
    relationships?: Partial<EnhancedRelationshipsI<RelatedNodes>>;
  },
  neogma: Neogma,
): EnhancedNeogmaModel<Properties, RelatedNodes, Methods, Statics> & {
  getModelName: () => string;
  getModelSchema: () => NeogmaSchema<Omit<Properties, "id">>;
  getModelLabel: () => string | string[];
  getModelStatics: () => Partial<Statics>;
  getModelMethods: () => Partial<Methods>;
  getModelPrimaryKeyField: () => Extract<keyof Properties, string> | undefined;
  getModelRelationships: () => Partial<EnhancedRelationshipsI<RelatedNodes>> | undefined;
  getAllModelParameters: () => {
    name: string;
    schema: NeogmaSchema<Omit<Properties, "id">>;
    label: string | string[];
    statics?: Partial<Statics>;
    methods?: Partial<Methods>;
    primaryKeyField?: Extract<keyof Properties, string>;
    relationships?: Partial<EnhancedRelationshipsI<RelatedNodes>>;
  };
} {
  // Create the base model
  const sourceModel = ModelFactory<Properties, RelatedNodes, Statics, Methods>(parameters, neogma);

  // Define accessor methods for retrieving model metadata
  const paramGetters = {
    getModelName: () => parameters.name,
    getModelSchema: () => parameters.schema,
    getModelLabel: () => parameters.label,
    getModelStatics: () => parameters.statics || {},
    getModelMethods: () => parameters.methods || {},
    getModelPrimaryKeyField: () => parameters.primaryKeyField,
    getModelRelationships: () => parameters.relationships || {},
    getAllModelParameters: () => ({ ...parameters }),
  };

  // Attach the accessor methods to the model instance
  Object.assign(sourceModel, paramGetters);

  // Wrap the model with a proxy that restricts write operations
  return createReadOnlyModel(sourceModel, parameters.name) as EnhancedNeogmaModel<
    Properties,
    RelatedNodes,
    Methods,
    Statics
  > &
    typeof paramGetters;
}

/**
 * Applies a Proxy wrapper to a model instance that intercepts access
 * to forbidden (write-related) methods and throws an error if called.
 */
function createReadOnlyModel<
  Properties extends Neo4jSupportedProperties,
  RelatedNodes extends Record<string, any>,
  Methods extends Record<string, any>,
  Statics extends Record<string, any>,
>(
  sourceModel: EnhancedNeogmaModel<Properties, RelatedNodes, Methods, Statics>,
  modelName: string,
): EnhancedNeogmaModel<Properties, RelatedNodes, Methods, Statics> {
  return new Proxy(sourceModel, {
    get(target, prop: string, receiver) {
      const value = Reflect.get(target, prop, receiver);

      // Intercept forbidden method calls
      if (typeof value === "function" && FORBIDDEN_METHODS.includes(prop)) {
        return function (...args: any[]) {
          throw new ReadOnlyModelError(prop, modelName);
        };
      }

      // Bind context correctly for allowed methods
      if (typeof value === "function") {
        return function (...args: any[]) {
          return value.apply(target, args);
        };
      }

      // Return non-function properties as-is
      return value;
    },

    set(target, prop: string, value, receiver) {
      return Reflect.set(target, prop, value, receiver);
    },

    has(target, prop) {
      return Reflect.has(target, prop);
    },

    ownKeys(target) {
      return Reflect.ownKeys(target);
    },

    getOwnPropertyDescriptor(target, prop) {
      return Reflect.getOwnPropertyDescriptor(target, prop);
    },
  });
}
