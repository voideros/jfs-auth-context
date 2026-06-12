import { GeneratorStrategy } from "./generator.strategy";
import { ModuleCollectorVisitor } from "./module-collector.visitor";
import { ModuleInputData } from "./module.types";
import { ModuleEntry, PermissionEntry } from "./permission.types";
import { PermissionVisitor } from "./permission.visitor";
import { TreeWalker } from "./tree.walker";

/**
 * Orchestrates tree walking and code/sql generation.
 *
 * Usage:
 *   const processor = new Processor(new TypeScriptGenerator());
 *   processor.process(inputData, "./output.ts");
 */
export class Processor {
  constructor(private readonly generator: GeneratorStrategy) {}

  /** Walk the tree and emit output via the injected strategy. */
  public process(data: ModuleInputData, outputPath: string): void {
    const permissions = this.collectPermissions(data);
    this.generator.generate(permissions, outputPath);
  }

  /** Collect structured permission entries without generating output. */
  public collectPermissions(data: ModuleInputData): PermissionEntry[] {
    const visitor = new PermissionVisitor();
    const walker = new TreeWalker(visitor);
    walker.walk(data.modules);
    return visitor.getPermissions();
  }

  /** Collect unique module entries for DB seeding. */
  public collectModules(data: ModuleInputData): ModuleEntry[] {
    const visitor = new ModuleCollectorVisitor();
    const walker = new TreeWalker(visitor);
    walker.walk(data.modules);
    return visitor.getModules();
  }
}
