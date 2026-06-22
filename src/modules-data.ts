import { MODULES_DATA as staticData } from "./output/auto-generated-modules-data";
import { ModuleInputData } from "./generator/module.types";

/**
 * Pre-parsed and Zod-validated module tree from MODULES.jsonc.
 * Consumers can use this directly without file I/O or parsing.
 *
 * Example:
 *   import { MODULES_DATA } from "@voideros/jfs-shared-modules-and-auth-context";
 *   console.log(MODULES_DATA.modules[0].label); // "farmer"
 */
export const MODULES_DATA: ModuleInputData = staticData as unknown as ModuleInputData;

