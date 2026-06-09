import { ModuleNode } from "./module.types";
import { Visitor } from "./module.visitor";

export class PermissionVisitor implements Visitor {
  private readonly permissions = new Set<string>();

  public visitModule(node: ModuleNode, parentPath: string): void {
    const currentPath = parentPath ? `${parentPath}.${node.label}` : node.label;

    if (node.permissions) {
      for (const perm of node.permissions) {
        this.permissions.add(`${currentPath}.${perm.toLowerCase()}`);
      }
    }

    if (node.submodules && node.submodules.length > 0) {
      for (const sub of node.submodules) {
        this.visitModule(sub, currentPath);
      }
    }
  }

  public getPermissions(): string[] {
    return Array.from(this.permissions).sort();
  }
}
