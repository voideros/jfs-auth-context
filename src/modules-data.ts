import * as fs from "fs";
import JSON5 from "json5";
import * as path from "path";

import { ModuleInputData } from "./generator/module.types";
import { ModuleInputDataSchema } from "./schemas/module.schema";

/**
 * Resolves the absolute path to the bundled MODULES.jsonc file.
 * Works whether the consumer imports from source or from the published dist/.
 *
 * Example:
 *   import { MODULES_JSONC_PATH } from "@voideros/jfs-shared-modules-and-auth-context";
 *   // → "/path/to/node_modules/@voideros/.../MODULES.jsonc"
 */
export const MODULES_JSONC_PATH: string = path.resolve(
  __dirname,
  "..",
  "MODULES.jsonc",
);

/**
 * Pre-parsed and Zod-validated module tree from MODULES.jsonc.
 * Consumers can use this directly without file I/O or parsing.
 *
 * Example:
 *   import { MODULES_DATA } from "@voideros/jfs-shared-modules-and-auth-context";
 *   console.log(MODULES_DATA.modules[0].label); // "farmer"
 */
export const MODULES_DATA: ModuleInputData = (() => {
  const raw = fs.readFileSync(MODULES_JSONC_PATH, "utf-8");
  return ModuleInputDataSchema.parse(JSON5.parse(raw));
})();
