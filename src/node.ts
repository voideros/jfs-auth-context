import * as path from "path";

export { Processor } from "./generator/module.processor";
export { SqlSeedGenerator } from "./generator/sql-seed.generator";
export { TypeScriptGenerator } from "./generator/typescript.generator";

/**
 * Resolves the absolute path to the bundled MODULES.jsonc file.
 * Works whether the consumer imports from source or from the published dist/.
 */
export const MODULES_JSONC_PATH: string = path.resolve(
  __dirname,
  "..",
  "MODULES.jsonc",
);
