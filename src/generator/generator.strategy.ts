import { PermissionEntry } from "./permission.types";

export interface GeneratorStrategy {
  generate(permissions: PermissionEntry[], outputPath: string): void;
}
