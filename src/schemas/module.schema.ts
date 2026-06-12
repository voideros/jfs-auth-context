import { z } from "zod";
import {
  MAX_MODULE_LABEL_LENGTH,
  MAX_MODULE_NAME_LENGTH,
  MIN_MODULE_LABEL_LENGTH,
  MIN_MODULE_NAME_LENGTH,
} from "../constants";

// Permissions are no longer declared per-node — they are derived
// dynamically from ACTIONS_MAP for every module/submodule.
const baseModuleNodeSchema = z.object({
  name: z
    .string()
    .min(MIN_MODULE_NAME_LENGTH, "Module name is required")
    .max(
      MAX_MODULE_NAME_LENGTH,
      `Module name cannot exceed ${MAX_MODULE_NAME_LENGTH} characters`,
    ),
  label: z
    .string()
    .min(MIN_MODULE_LABEL_LENGTH, "Module label is required")
    .max(
      MAX_MODULE_LABEL_LENGTH,
      `Module label cannot exceed ${MAX_MODULE_LABEL_LENGTH} characters`,
    ),
});

export type ModuleNode = z.infer<typeof baseModuleNodeSchema> & {
  submodules?: ModuleNode[];
};

export const ModuleNodeSchema: z.ZodType<ModuleNode> =
  baseModuleNodeSchema.extend({
    submodules: z.lazy(() => ModuleNodeSchema.array().optional()),
  });

export const ModuleInputDataSchema = z.object({
  modules: z.array(ModuleNodeSchema),
});

export type ModuleInputData = z.infer<typeof ModuleInputDataSchema>;
