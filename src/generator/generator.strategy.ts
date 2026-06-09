export interface GeneratorStrategy {
  generate(permissions: string[], outputPath: string): void;
}
