import { ModelFactory as OriginalModelFactory } from "neogma";

export { OriginalModelFactory };

// Re-export everything else from Neogma directly
export * from "neogma";

// Export your custom ModelFactory
export { ModelFactory } from "./model-factory";
