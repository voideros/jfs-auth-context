import { ModuleNode } from "./module.types";
import { Visitor } from "./module.visitor";
import { ModuleEntry } from "./permission.types";

/**
 * Collects unique ModuleEntry rows from the module tree.
 * Each node emits one entry with its parentLabel resolved.
 *
 * Example: { name: "Distribuição de Insumos", label: "supply.distribute", parentLabel: "supply" }
 */
export class ModuleCollectorVisitor implements Visitor {
  private readonly seen = new Map<string, ModuleEntry>();

  public visitModule(node: ModuleNode, parentLabel: string): void {
    if (!this.seen.has(node.label)) {
      this.seen.set(node.label, {
        name: node.name,
        label: node.label,
        parentLabel: parentLabel || null,
      });
    }

    for (const sub of node.submodules ?? []) {
      this.visitModule(sub, node.label);
    }
  }

  /** Returns unique modules sorted by label for deterministic ordering. */
  public getModules(): ModuleEntry[] {
    return Array.from(this.seen.values()).sort((a, b) =>
      a.label.localeCompare(b.label),
    );
  }
}
