import { ModuleNode } from "./module.types";
import { Visitor } from "./module.visitor";

export class TreeWalker {
  constructor(private readonly visitor: Visitor) {}

  public walk(nodes: ModuleNode[]): void {
    for (const node of nodes) {
      this.visitor.visitModule(node, "");
    }
  }
}
