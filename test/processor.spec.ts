import { describe, expect, it, jest } from "@jest/globals";
import { ACTIONS_MAP } from "../src/actions.mapper";
import { GeneratorStrategy } from "../src/generator/generator.strategy";
import { Processor } from "../src/generator/module.processor";
import { PermissionEntry } from "../src/generator/permission.types";

describe("Processor", () => {
  it("should traverse and generate via strategy", () => {
    const mockStrategy: GeneratorStrategy = {
      generate: jest.fn(),
    };

    const processor = new Processor(mockStrategy);

    processor.process(
      {
        modules: [
          {
            name: "Test",
            label: "test",
          },
        ],
      },
      "dummy.ts",
    );

    const actionKeys = Object.keys(ACTIONS_MAP);
    const generateCall = (mockStrategy.generate as jest.Mock).mock.calls[0];
    const permissions = generateCall[0] as PermissionEntry[];

    expect(permissions).toHaveLength(actionKeys.length);
    expect(permissions.map((p) => p.label)).toContain("test.read");
    expect(permissions.map((p) => p.label)).toContain("test.create");
    expect(generateCall[1]).toBe("dummy.ts");
  });

  it("should collectPermissions without generating output", () => {
    const mockStrategy: GeneratorStrategy = { generate: jest.fn() };
    const processor = new Processor(mockStrategy);

    const permissions = processor.collectPermissions({
      modules: [{ name: "Supply", label: "supply" }],
    });

    expect(permissions.length).toBeGreaterThan(0);
    expect(permissions[0]).toHaveProperty("label");
    expect(permissions[0]).toHaveProperty("actionName");
    // Should NOT call generate
    expect(mockStrategy.generate).not.toHaveBeenCalled();
  });

  it("should collectModules with parent resolution", () => {
    const mockStrategy: GeneratorStrategy = { generate: jest.fn() };
    const processor = new Processor(mockStrategy);

    const modules = processor.collectModules({
      modules: [
        {
          name: "Insumos",
          label: "supply",
          submodules: [
            { name: "Distribuição", label: "supply.distribute" },
          ],
        },
      ],
    });

    expect(modules).toHaveLength(2);

    const parent = modules.find((m) => m.label === "supply");
    expect(parent?.parentLabel).toBeNull();

    const child = modules.find((m) => m.label === "supply.distribute");
    expect(child?.parentLabel).toBe("supply");
  });
});
