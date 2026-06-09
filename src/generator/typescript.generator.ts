import * as fs from "fs";
import { GeneratorStrategy } from "./generator.strategy";

export class TypeScriptGenerator implements GeneratorStrategy {
  public generate(permissions: string[], outputPath: string): void {
    const sortedPermissions = [...permissions].sort();

    const typeDefinitionString = `// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.\n
export type Permission =
${sortedPermissions.length > 0 ? sortedPermissions.map((perm) => `  | "${perm}"`).join("\n") : "  never"};

export const PERMISSIONS = [
${sortedPermissions.length > 0 ? sortedPermissions.map((perm) => `  "${perm}",`).join("\n") : ""}
] as const;
`;

    fs.writeFileSync(outputPath, typeDefinitionString);
  }
}
