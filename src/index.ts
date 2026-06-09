export {
  MAX_MODULE_LABEL_LENGTH,
  MAX_MODULE_NAME_LENGTH,
  MIN_MODULE_LABEL_LENGTH,
  MIN_MODULE_NAME_LENGTH,
  MIN_PERMISSIONS_LENGTH,
} from "./constants";
export { Processor } from "./generator/module.processor";
export type { ModuleInputData, ModuleNode } from "./generator/module.types";
export { TypeScriptGenerator } from "./generator/typescript.generator";
export {
  PERMISSIONS,
  type Permission,
} from "./output/auto-generated-permissions";
export {
  ModuleInputDataSchema,
  ModuleNodeSchema,
} from "./schemas/module.schema";
