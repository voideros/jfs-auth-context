#!/usr/bin/env node
import * as dotenv from "dotenv";
import * as fs from "fs";
import JSON5 from "json5";
import * as path from "path";
import { Client } from "pg";

import { ACTIONS_MAP } from "./actions.mapper";
import { Processor } from "./generator/module.processor";
import { SqlSeedGenerator } from "./generator/sql-seed.generator";
import { TypeScriptGenerator } from "./generator/typescript.generator";
import { ModuleInputDataSchema } from "./schemas/module.schema";

/**
 * Reads MODULES.jsonc, generates permissions, and upserts into PostgreSQL.
 * Seeds auth_module_actions, auth_modules, and auth_permissions.
 *
 * Usage:
 *   ts-node src/seed-db.ts MODULES.jsonc
 *   # reads DATABASE_URL from .env
 */
async function main(): Promise<void> {
  dotenv.config();

  const inputFile = process.argv[2];
  if (!inputFile) {
    console.error("Usage: jfs-seed-db <MODULES.jsonc> [--sql-output <path>]");
    process.exit(1);
  }

  const inputPath = path.resolve(process.cwd(), inputFile);
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: File not found at ${inputPath}`);
    process.exit(1);
  }

  const inputData = parseInputFile(inputPath);

  const processor = new Processor(new TypeScriptGenerator());
  const modules = processor.collectModules(inputData);
  const permissions = processor.collectPermissions(inputData);

  console.log(
    `[✔] Parsed ${modules.length} modules, ${permissions.length} permissions`,
  );

  // Optionally write SQL to file
  const sqlFlagIdx = process.argv.indexOf("--sql-output");
  if (sqlFlagIdx !== -1 && process.argv[sqlFlagIdx + 1]) {
    const sqlPath = path.resolve(process.cwd(), process.argv[sqlFlagIdx + 1]);
    const sqlGen = new SqlSeedGenerator(modules);
    sqlGen.generate(permissions, sqlPath);
    console.log(`[✔] SQL seed written to: ${sqlPath}`);
  }

  // Seed the database
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("Error: DATABASE_URL not set. Add it to .env or export it.");
    process.exit(1);
  }

  await seedDatabase(databaseUrl, modules, permissions);
}

function parseInputFile(
  inputPath: string,
): ReturnType<typeof ModuleInputDataSchema.parse> {
  const rawData = fs.readFileSync(inputPath, "utf-8");
  const parsed = JSON5.parse(rawData);
  return ModuleInputDataSchema.parse(parsed);
}

async function seedDatabase(
  databaseUrl: string,
  modules: Array<{ name: string; label: string; parentLabel: string | null }>,
  permissions: Array<{
    label: string;
    actionName: string;
    moduleLabel: string;
  }>,
): Promise<void> {
  const client = new Client({ connectionString: databaseUrl });

  try {
    await client.connect();
    await client.query("BEGIN");

    // 1. Upsert auth_module_actions from ACTIONS_MAP
    for (const [key, name] of Object.entries(ACTIONS_MAP)) {
      await client.query(
        `INSERT INTO auth_module_actions (id, name, key, is_active, version, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, TRUE, 1, NOW(), NOW())
         ON CONFLICT (key)
         DO UPDATE SET name = EXCLUDED.name, updated_at = NOW()`,
        [name, key],
      );
    }
    console.log(
      `[✔] Upserted ${Object.keys(ACTIONS_MAP).length} auth_module_actions`,
    );

    // 2. Upsert modules (parents first — sorted by label depth)
    for (const mod of modules) {
      await client.query(
        `INSERT INTO auth_modules (id, name, label, parent_id, is_active, version, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2,
           (SELECT id FROM auth_modules WHERE label = $3),
           TRUE, 1, NOW(), NOW())
         ON CONFLICT (label)
         DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id, updated_at = NOW()`,
        [mod.name, mod.label, mod.parentLabel],
      );
    }
    console.log(`[✔] Upserted ${modules.length} auth_modules`);

    // 3. Upsert permissions with action_id FK instead of name
    for (const perm of permissions) {
      await client.query(
        `INSERT INTO auth_permissions (id, action_id, label, module_id, is_active, version, created_at, updated_at)
         VALUES (gen_random_uuid(),
           (SELECT id FROM auth_module_actions WHERE name = $1),
           $2,
           (SELECT id FROM auth_modules WHERE label = $3),
           TRUE, 1, NOW(), NOW())
         ON CONFLICT (label)
         DO UPDATE SET
           action_id = EXCLUDED.action_id,
           module_id = EXCLUDED.module_id,
           updated_at = NOW()`,
        [perm.actionName, perm.label, perm.moduleLabel],
      );
    }
    console.log(`[✔] Upserted ${permissions.length} auth_permissions`);

    await client.query("COMMIT");
    console.log("[✔] Database seeded successfully");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
