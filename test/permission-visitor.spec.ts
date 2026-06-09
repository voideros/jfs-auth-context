import { describe, expect, it } from "@jest/globals";
import { ModuleNode } from "../src/generator/module.types";
import { PermissionVisitor } from "../src/generator/permission.visitor";

describe("PermissionVisitor", () => {
  it("should extract permissions with correct dot-separated paths", () => {
    const visitor = new PermissionVisitor();
    const node: ModuleNode = {
      name: "Dashboard",
      label: "dashboard",
      permissions: ["READ", "WRITE"],
    };

    visitor.visitModule(node, "crm");

    const permissions = visitor.getPermissions();
    expect(permissions).toEqual(["crm.dashboard.read", "crm.dashboard.write"]);
  });

  it("should recursively visit submodules", () => {
    const visitor = new PermissionVisitor();
    const node: ModuleNode = {
      name: "Root",
      label: "root",
      permissions: ["MODULE"],
      submodules: [
        {
          name: "Child",
          label: "child",
          permissions: ["CREATE"],
        },
      ],
    };

    visitor.visitModule(node, "");

    const permissions = visitor.getPermissions();
    expect(permissions).toEqual(["root.child.create", "root.module"]);
  });
});
