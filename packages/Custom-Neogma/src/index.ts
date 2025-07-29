// Import the original ModelFactory from the neogma package and rename it locally
import { ModelFactory as OriginalModelFactory } from "neogma";
import { NeogmaModel as OriginalNeogmaModel } from "neogma";

// Re-export the original ModelFactory under its original name
export { OriginalModelFactory };
export type { OriginalNeogmaModel };

// Re-export everything else from the neogma package
export * from "neogma";

// Export your custom ModelFactory from a local file
export { defineModelFactory } from "./model-factory";

export * from "./types";

export type { NeogmaModel } from "./Neogma/normal-model-types";
export type { NeogmaModel as AbstractNeogmaModel } from "./Neogma/abstract-model-types";
export { AbstractModelFactory, defineAbstractModelFactory } from "./abstract-factory";
