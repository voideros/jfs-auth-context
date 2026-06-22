import { describe, expect, it } from "@jest/globals";
import { ACTIONS_MAP } from "../src/actions.mapper";
import { ModuleNode } from "../src/generator/module.types";
import { PermissionVisitor } from "../src/generator/permission.visitor";

describe("PermissionVisitor", () => {
  const actionKeys = Object.keys(ACTIONS_MAP);

  it("should generate all actions for a single module", () => {
    const visitor = new PermissionVisitor();
    const node: ModuleNode = {
      name: "Dashboard",
      label: "dashboard",
    };

    visitor.visitModule(node, "");

    const permissions = visitor.getPermissions();
    const labels = permissions.map((p) => p.label);

    for (const action of actionKeys) {
      expect(labels).toContain(`dashboard.${action}`);
    }
    expect(permissions).toHaveLength(actionKeys.length);
  });

  it("should use the node label as prefix, not parentPath", () => {
    const visitor = new PermissionVisitor();
    const node: ModuleNode = {
      name: "Chamadas",
      label: "helpdesk.callsms",
    };

    visitor.visitModule(node, "helpdesk");

    const permissions = visitor.getPermissions();
    const labels = permissions.map((p) => p.label);

    // Label already contains the full path from JSONC
    expect(labels).toContain("helpdesk.callsms.read");
    expect(labels).toContain("helpdesk.callsms.create");
  });

  it("should include actionName from ACTIONS_MAP", () => {
    const visitor = new PermissionVisitor();
    const node: ModuleNode = {
      name: "Supply",
      label: "supply",
    };

    visitor.visitModule(node, "");

    const permissions = visitor.getPermissions();
    const createPerm = permissions.find((p) => p.label === "supply.create");

    expect(createPerm).toBeDefined();
    expect(createPerm?.actionName).toBe("CRIAR");
    expect(createPerm?.moduleName).toBe("Supply");
    expect(createPerm?.moduleLabel).toBe("supply");
  });

  it("should recursively visit submodules", () => {
    const visitor = new PermissionVisitor();
    const node: ModuleNode = {
      name: "Insumos",
      label: "supply",
      submodules: [
        {
          name: "Distribuição de Insumos",
          label: "supply.distribute",
        },
      ],
    };

    visitor.visitModule(node, "");

    const permissions = visitor.getPermissions();
    const labels = permissions.map((p) => p.label);

    // Parent module permissions
    expect(labels).toContain("supply.read");
    // Child module permissions
    expect(labels).toContain("supply.distribute.create");
    expect(permissions).toHaveLength(actionKeys.length * 2);
  });

  it("should return sorted permissions", () => {
    const visitor = new PermissionVisitor();
    visitor.visitModule({ name: "B", label: "b" }, "");
    visitor.visitModule({ name: "A", label: "a" }, "");

    const permissions = visitor.getPermissions();
    const labels = permissions.map((p) => p.label);

    const sorted = [...labels].sort();
    expect(labels).toEqual(sorted);
  });
});
