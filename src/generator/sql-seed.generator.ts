import * as fs from "fs";
import { GeneratorStrategy } from "./generator.strategy";
import { ModuleEntry, PermissionEntry } from "./permission.types";

/**
 * Generates a SQL seed file that upserts auth_modules and auth_permissions.
 * Uses ON CONFLICT (label) DO UPDATE for idempotent re-runs.
 *
 * Usage:
 *   const gen = new SqlSeedGenerator(modules);
 *   gen.generate(permissions, "./seed.sql");
 */
export class SqlSeedGenerator implements GeneratorStrategy {
  constructor(private readonly modules: ModuleEntry[]) {}

  public generate(permissions: PermissionEntry[], outputPath: string): void {
    const sql = this.buildSql(permissions);
    fs.writeFileSync(outputPath, sql);
  }

  /** Builds the full SQL seed string (exposed for testing without file I/O). */
  public buildSql(permissions: PermissionEntry[]): string {
    const lines: string[] = [];

    lines.push(this.header());
    lines.push("BEGIN;\n");

    lines.push("-- ============================================================");
    lines.push("-- 1. Upsert auth_modules");
    lines.push("-- ============================================================");
    for (const mod of this.modules) {
      lines.push(this.upsertModule(mod));
    }

    lines.push("");
    lines.push("-- ============================================================");
    lines.push("-- 2. Upsert auth_permissions");
    lines.push("-- ============================================================");
    for (const perm of permissions) {
      lines.push(this.upsertPermission(perm));
    }

    lines.push("\nCOMMIT;\n");
    return lines.join("\n");
  }

  private header(): string {
    const now = new Date().toISOString().slice(0, 10);
    return [
      "-- AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.",
      `-- Generated on ${now} from MODULES.jsonc + ACTIONS_MAP`,
      "",
    ].join("\n");
  }

  private upsertModule(mod: ModuleEntry): string {
    const parentExpr = mod.parentLabel
      ? `(SELECT id FROM auth_modules WHERE label = '${this.esc(mod.parentLabel)}')`
      : "NULL";

    return [
      `INSERT INTO auth_modules (id, name, label, parent_id, is_active, version, created_at, updated_at)`,
      `VALUES (gen_random_uuid(), '${this.esc(mod.name)}', '${this.esc(mod.label)}', ${parentExpr}, TRUE, 1, NOW(), NOW())`,
      `ON CONFLICT (label) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id, updated_at = NOW();`,
    ].join("\n");
  }

  private upsertPermission(perm: PermissionEntry): string {
    return [
      `INSERT INTO auth_permissions (id, name, label, module_id, is_active, version, created_at, updated_at)`,
      `VALUES (gen_random_uuid(), '${this.esc(perm.actionName)}', '${this.esc(perm.label)}',`,
      `  (SELECT id FROM auth_modules WHERE label = '${this.esc(perm.moduleLabel)}'), TRUE, 1, NOW(), NOW())`,
      `ON CONFLICT (label) DO UPDATE SET name = EXCLUDED.name, module_id = EXCLUDED.module_id, updated_at = NOW();`,
    ].join("\n");
  }

  /** Escape single quotes for SQL string literals. */
  private esc(value: string): string {
    return value.replace(/'/g, "''");
  }
}
