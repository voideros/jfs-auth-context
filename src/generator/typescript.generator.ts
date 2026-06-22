import * as fs from "fs";
import { GeneratorStrategy } from "./generator.strategy";
import { PermissionEntry } from "./permission.types";

export class TypeScriptGenerator implements GeneratorStrategy {
  public generate(permissions: PermissionEntry[], outputPath: string): void {
    const labels = permissions.map((p) => p.label).sort();

    const typeDefinitionString = `// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.\n
export type Permission =
${labels.length > 0 ? labels.map((label) => `  | "${label}"`).join("\n") : "  never"};

export const PERMISSIONS = [
${labels.length > 0 ? labels.map((label) => `  "${label}",`).join("\n") : ""}
] as const;
`;

    fs.writeFileSync(outputPath, typeDefinitionString);
  }
}
