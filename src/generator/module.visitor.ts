import { ModuleNode } from "./module.types";

export interface Visitor {
  visitModule(node: ModuleNode, parentPath: string): void;
}
