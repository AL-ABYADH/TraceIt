import { NeogmaModel } from "neogma";

/**
 * Singleton registry to manage Neogma models and resolve circular dependencies.
 *
 * This registry stores models by name and holds pending relationship resolvers
 * that can be retried when new models are registered.
 */
export class ModelRegistry {
  // Singleton instance
  private static instance: ModelRegistry;

  // Map of model names to NeogmaModel instances
  private models = new Map<string, NeogmaModel<any, any, any, any>>();

  // Map of model names to deferred resolver functions for circular relationships
  private pendingRelationships = new Map<string, () => void>();

  /**
   * Get the singleton instance of the registry.
   */
  static getInstance(): ModelRegistry {
    if (!ModelRegistry.instance) {
      ModelRegistry.instance = new ModelRegistry();
    }
    return ModelRegistry.instance;
  }

  /**
   * Register a model by name.
   * Attempts to resolve any pending relationships after registration.
   * @param name - The unique model name
   * @param model - The NeogmaModel instance
   */
  register(name: string, model: NeogmaModel<any, any, any, any>): void {
    this.models.set(name, model);
    this.processPendingRelationships();
  }

  /**
   * Retrieve a registered model by name.
   * Returns null if the model is not found.
   * @param name - The model name
   */
  get(name: string): NeogmaModel<any, any, any, any> | null {
    return this.models.get(name) || null;
  }

  /**
   * Add a resolver function for a pending relationship.
   * This is used to defer relationship setup in cases of circular dependencies.
   * @param modelName - The name of the model with a pending relationship
   * @param resolver - A function to resolve the relationship
   */
  addPendingRelationship(modelName: string, resolver: () => void): void {
    this.pendingRelationships.set(modelName, resolver);
  }

  /**
   * Try to resolve all pending relationships.
   * Removes successfully resolved relationships from the pending map.
   */
  private processPendingRelationships(): void {
    const resolved: string[] = [];

    for (const [modelName, resolver] of this.pendingRelationships) {
      try {
        resolver();
        resolved.push(modelName);
      } catch {
        // Resolver failed, will retry when more models get registered
      }
    }

    // Remove resolved entries from pending relationships
    resolved.forEach((name) => this.pendingRelationships.delete(name));
  }
}
