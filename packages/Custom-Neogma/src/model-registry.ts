import { NeogmaModel } from "neogma";

// =============================================================================
// MODEL REGISTRY
// =============================================================================

/**
 * Simple registry for managing models and resolving circular dependencies
 */
export class ModelRegistry {
  private static instance: ModelRegistry;
  private models = new Map<string, NeogmaModel<any, any, any, any>>();
  private pendingRelationships = new Map<string, () => void>();

  static getInstance(): ModelRegistry {
    if (!ModelRegistry.instance) {
      ModelRegistry.instance = new ModelRegistry();
    }
    return ModelRegistry.instance;
  }

  register(name: string, model: NeogmaModel<any, any, any, any>): void {
    this.models.set(name, model);
    this.processPendingRelationships();
  }

  get(name: string): NeogmaModel<any, any, any, any> | null {
    return this.models.get(name) || null;
  }

  addPendingRelationship(modelName: string, resolver: () => void): void {
    this.pendingRelationships.set(modelName, resolver);
  }

  private processPendingRelationships(): void {
    const resolved: string[] = [];

    for (const [modelName, resolver] of this.pendingRelationships) {
      try {
        resolver();
        resolved.push(modelName);
      } catch {
        // Will retry when more models are registered
      }
    }

    resolved.forEach((name) => this.pendingRelationships.delete(name));
  }
}
