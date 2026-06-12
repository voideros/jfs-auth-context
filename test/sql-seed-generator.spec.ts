import { describe, expect, it } from "@jest/globals";
import { ModuleEntry, PermissionEntry } from "../src/generator/permission.types";
import { SqlSeedGenerator } from "../src/generator/sql-seed.generator";

describe("SqlSeedGenerator", () => {
  const sampleModules: ModuleEntry[] = [
    { name: "Insumos", label: "supply", parentLabel: null },
    { name: "Distribuição", label: "supply.distribute", parentLabel: "supply" },
  ];

  const samplePermissions: PermissionEntry[] = [
    {
      label: "supply.create",
      actionName: "Criar",
      moduleName: "Insumos",
      moduleLabel: "supply",
    },
    {
      label: "supply.distribute.read",
      actionName: "Ler",
      moduleName: "Distribuição",
      moduleLabel: "supply.distribute",
    },
  ];

  it("should generate valid SQL with BEGIN/COMMIT", () => {
    const gen = new SqlSeedGenerator(sampleModules);
    const sql = gen.buildSql(samplePermissions);

    expect(sql).toContain("BEGIN;");
    expect(sql).toContain("COMMIT;");
  });

  it("should upsert modules with ON CONFLICT", () => {
    const gen = new SqlSeedGenerator(sampleModules);
    const sql = gen.buildSql(samplePermissions);

    expect(sql).toContain("INSERT INTO auth_modules");
    expect(sql).toContain("ON CONFLICT (label) DO UPDATE");
    expect(sql).toContain("'Insumos'");
    expect(sql).toContain("'supply'");
  });

  it("should resolve parent_id via subquery for child modules", () => {
    const gen = new SqlSeedGenerator(sampleModules);
    const sql = gen.buildSql(samplePermissions);

    expect(sql).toContain(
      "(SELECT id FROM auth_modules WHERE label = 'supply')",
    );
  });

  it("should use NULL for top-level module parent_id", () => {
    const gen = new SqlSeedGenerator(sampleModules);
    const sql = gen.buildSql(samplePermissions);

    // The first module (supply) should have NULL parent
    const supplyInsert = sql
      .split("INSERT INTO auth_modules")[1]
      .split("ON CONFLICT")[0];
    expect(supplyInsert).toContain("NULL");
  });

  it("should upsert permissions with module_id subquery", () => {
    const gen = new SqlSeedGenerator(sampleModules);
    const sql = gen.buildSql(samplePermissions);

    expect(sql).toContain("INSERT INTO auth_permissions");
    expect(sql).toContain("'supply.create'");
    expect(sql).toContain("'Criar'");
    expect(sql).toContain(
      "(SELECT id FROM auth_modules WHERE label = 'supply')",
    );
  });

  it("should escape single quotes in names", () => {
    const modulesWithQuotes: ModuleEntry[] = [
      { name: "Module's Name", label: "test", parentLabel: null },
    ];
    const gen = new SqlSeedGenerator(modulesWithQuotes);
    const sql = gen.buildSql([]);

    expect(sql).toContain("'Module''s Name'");
  });

  it("should include auto-generated header", () => {
    const gen = new SqlSeedGenerator(sampleModules);
    const sql = gen.buildSql(samplePermissions);

    expect(sql).toContain("AUTO-GENERATED FILE");
    expect(sql).toContain("MODULES.jsonc");
  });
});
