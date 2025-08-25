import { Neo4jSupportedProperties, Neogma } from "neogma";
import { ModelParams, AnyObject, AbstractModelFactoryDefinition } from "./types";
import { NeogmaModel as AbstractNeogmaModel } from "./Neogma/abstract-model-types";
import { ModelFactory } from "./model-factory";

/**
 * Error thrown when write operations are attempted on read-only models.
 */
export class ReadOnlyModelError extends Error {
  constructor(operation: string, modelName: string) {
    super(
      `Operation '${operation}' is not allowed on '${modelName}' model because it is defined as abstract (read-only).`,
    );
    this.name = "ReadOnlyModelError";
  }
}

/**
 * List of write operations that are forbidden on abstract models.
 */
const FORBIDDEN_METHODS = [
  "createOne",
  "createMany",
  "build",
  "buildFromRecord",
  "createRelationship",
  "relateTo",
  "updateRelationship",
  "deleteRelationships",
  "getRelationshipProperties",
] as const;

type ForbiddenMethod = (typeof FORBIDDEN_METHODS)[number];

/**
 * Interface for AbstractModelFactory parameters
 */

/**
 * Creates a read-only model that blocks write operations.
 *
 * @param parameters Configuration for the model
 * @param neogma Neogma instance
 * @returns A read-only model that throws errors for write operations
 */
export function AbstractModelFactory<
  Properties extends Neo4jSupportedProperties,
  RelatedNodes extends AnyObject = AnyObject,
  Methods extends AnyObject = AnyObject,
  Statics extends AnyObject = AnyObject,
>(
  parameters: ModelParams<Properties, RelatedNodes, Methods, Statics>,
  neogma: Neogma,
): AbstractNeogmaModel<Properties, RelatedNodes, Methods, Statics> {
  // Create the base model using the standard ModelFactory
  const baseModel: any = ModelFactory<Properties, RelatedNodes, Methods, Statics>(
    parameters,
    neogma,
  );

  // Apply the read-only proxy wrapper
  return createReadOnlyProxy(baseModel, parameters.name);
}

/**
 * Creates a proxy that intercepts and blocks write operations on a model.
 *
 * @param model The original model to make read-only
 * @param modelName Name of the model for error messages
 * @returns Proxied model that blocks write operations
 */
function createReadOnlyProxy<
  Properties extends Neo4jSupportedProperties,
  RelatedNodes extends AnyObject,
  Methods extends AnyObject,
  Statics extends AnyObject,
>(
  model: AbstractNeogmaModel<Properties, RelatedNodes, Methods, Statics>,
  modelName: string,
): AbstractNeogmaModel<Properties, RelatedNodes, Methods, Statics> {
  return new Proxy(model, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      const propName = String(prop);

      // If accessing a forbidden method, return a function that throws an error
      if (typeof value === "function" && FORBIDDEN_METHODS.includes(propName as ForbiddenMethod)) {
        return function (..._args: unknown[]) {
          throw new ReadOnlyModelError(propName, modelName);
        };
      }

      // Preserve method binding for allowed methods
      if (typeof value === "function") {
        // Use type assertion to help TypeScript understand this is a function
        return function (this: unknown, ...args: unknown[]) {
          return (value as Function).apply(target, args);
        };
      }

      // Return non-function properties unchanged
      return value;
    },
  });
}

/**
 * Creates a model factory function with static properties.
 * This helper function returns a function that creates models and has model metadata
 * attached directly to it as static properties.
 *
 * @param parameters Configuration for the model
 * @returns A function that creates a read-only model with static model properties
 */
export function defineAbstractModelFactory<
  Properties extends Neo4jSupportedProperties,
  RelatedNodes extends AnyObject = AnyObject,
  Methods extends AnyObject = AnyObject,
  Statics extends AnyObject = AnyObject,
>(
  parameters: ModelParams<Properties, RelatedNodes, Methods, Statics>,
): AbstractModelFactoryDefinition<Properties, RelatedNodes, Methods, Statics> {
  // Create a model function that returns an AbstractModelFactory instance
  const ModelFunction = function (neogma: Neogma) {
    return AbstractModelFactory<Properties, RelatedNodes, Methods, Statics>(parameters, neogma);
  };

  ModelFunction.parameters = { ...parameters };

  return ModelFunction;
}
