import { describe, expect, it } from "@jest/globals";
import { ModuleCollectorVisitor } from "../src/generator/module-collector.visitor";
import { ModuleNode } from "../src/generator/module.types";

describe("ModuleCollectorVisitor", () => {
  it("should collect a single root module with null parentLabel", () => {
    const visitor = new ModuleCollectorVisitor();
    const node: ModuleNode = { name: "Insumos", label: "supply" };

    visitor.visitModule(node, "");

    const modules = visitor.getModules();
    expect(modules).toHaveLength(1);
    expect(modules[0]).toEqual({
      name: "Insumos",
      label: "supply",
      parentLabel: null,
    });
  });

  it("should collect parent and child with correct parentLabel", () => {
    const visitor = new ModuleCollectorVisitor();
    const node: ModuleNode = {
      name: "Insumos",
      label: "supply",
      submodules: [
        { name: "Distribuição", label: "supply.distribute" },
      ],
    };

    visitor.visitModule(node, "");

    const modules = visitor.getModules();
    expect(modules).toHaveLength(2);

    const parent = modules.find((m) => m.label === "supply");
    expect(parent?.parentLabel).toBeNull();

    const child = modules.find((m) => m.label === "supply.distribute");
    expect(child?.parentLabel).toBe("supply");
  });

  it("should deduplicate modules with the same label", () => {
    const visitor = new ModuleCollectorVisitor();

    // Simulate duplicate labels (like "report" appearing twice in MODULES.jsonc)
    visitor.visitModule({ name: "Relatorios", label: "report" }, "");
    visitor.visitModule({ name: "Relatorios", label: "report" }, "");

    const modules = visitor.getModules();
    expect(modules).toHaveLength(1);
  });

  it("should handle deeply nested modules", () => {
    const visitor = new ModuleCollectorVisitor();
    const node: ModuleNode = {
      name: "Produtores",
      label: "farmer",
      submodules: [
        {
          name: "Questionários",
          label: "questionnaire",
          submodules: [
            {
              name: "Análise",
              label: "questionnaire.analysis",
            },
          ],
        },
      ],
    };

    visitor.visitModule(node, "");

    const modules = visitor.getModules();
    expect(modules).toHaveLength(3);

    const analysis = modules.find((m) => m.label === "questionnaire.analysis");
    expect(analysis?.parentLabel).toBe("questionnaire");
  });

  it("should return modules sorted by label", () => {
    const visitor = new ModuleCollectorVisitor();
    visitor.visitModule({ name: "Z", label: "z_mod" }, "");
    visitor.visitModule({ name: "A", label: "a_mod" }, "");

    const modules = visitor.getModules();
    expect(modules[0].label).toBe("a_mod");
    expect(modules[1].label).toBe("z_mod");
  });
});
