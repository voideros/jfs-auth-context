export { ACTIONS_MAP } from "./actions.mapper";
export {
  MAX_MODULE_LABEL_LENGTH,
  MAX_MODULE_NAME_LENGTH,
  MIN_MODULE_LABEL_LENGTH,
  MIN_MODULE_NAME_LENGTH,
} from "./constants";
export { ModuleCollectorVisitor } from "./generator/module-collector.visitor";
export type { ModuleInputData, ModuleNode } from "./generator/module.types";
export type {
  ModuleEntry,
  PermissionEntry,
} from "./generator/permission.types";
export { MODULES_DATA } from "./modules-data";
export {
  PERMISSIONS,
  type Permission,
} from "./output/auto-generated-permissions";
export {
  ModuleInputDataSchema,
  ModuleNodeSchema,
} from "./schemas/module.schema";
