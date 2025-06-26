// Import the original ModelFactory from the neogma package and rename it locally
import { ModelFactory as OriginalModelFactory } from "neogma";
import { AbstractModelFactory } from "./abstract-factory";

// Re-export the original ModelFactory under its original name
export { OriginalModelFactory };

// Re-export everything else from the neogma package
export * from "neogma";

// Export your custom ModelFactory from a local file
export { ModelFactory } from "./model-factory";

export * from "./types";

export { AbstractModelFactory } from "./abstract-factory";
