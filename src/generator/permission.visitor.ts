import { ACTIONS_MAP } from "../actions.mapper";
import { ModuleNode } from "./module.types";
import { Visitor } from "./module.visitor";
import { PermissionEntry } from "./permission.types";

/**
 * Walks the module tree and emits one PermissionEntry per (node × action).
 *
 * Example: node { label: "supply.distribute" } produces
 *   "supply.distribute.read", "supply.distribute.create", …
 */
export class PermissionVisitor implements Visitor {
  private readonly permissions: PermissionEntry[] = [];

  public visitModule(node: ModuleNode, _parentPath: string): void {
    for (const [actionKey, actionName] of Object.entries(ACTIONS_MAP)) {
      this.permissions.push({
        label: `${node.label}.${actionKey}`,
        actionName,
        moduleName: node.name,
        moduleLabel: node.label,
      });
    }

    for (const sub of node.submodules ?? []) {
      this.visitModule(sub, node.label);
    }
  }

  /** Returns collected permissions sorted by label for deterministic output. */
  public getPermissions(): PermissionEntry[] {
    return [...this.permissions].sort((a, b) => a.label.localeCompare(b.label));
  }
}
