import { GeneratorStrategy } from "./generator.strategy";
import { ModuleInputData } from "./module.types";
import { PermissionVisitor } from "./permission.visitor";
import { TreeWalker } from "./tree.walker";

export class Processor {
  constructor(private readonly generator: GeneratorStrategy) {}

  public process(data: ModuleInputData, outputPath: string): void {
    const visitor = new PermissionVisitor();
    const walker = new TreeWalker(visitor);

    walker.walk(data.modules);

    const permissions = visitor.getPermissions();
    this.generator.generate(permissions, outputPath);
  }
}
