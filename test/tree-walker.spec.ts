import { describe, it, expect, jest } from "@jest/globals";
import { ModuleNode } from "../src/generator/module.types";
import { Visitor } from "../src/generator/module.visitor";
import { TreeWalker } from "../src/generator/tree.walker";

describe("TreeWalker", () => {
  it("should visit all top-level nodes", () => {
    const mockVisitor: Visitor = {
      visitModule: jest.fn(),
    };
    const walker = new TreeWalker(mockVisitor);

    const nodes: ModuleNode[] = [
      { name: "Node A", label: "nodeA", permissions: [] },
      { name: "Node B", label: "nodeB", permissions: [] },
    ];

    walker.walk(nodes);

    expect(mockVisitor.visitModule).toHaveBeenCalledTimes(2);
    expect(mockVisitor.visitModule).toHaveBeenCalledWith(nodes[0], "");
    expect(mockVisitor.visitModule).toHaveBeenCalledWith(nodes[1], "");
  });
});
