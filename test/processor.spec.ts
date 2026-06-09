import { describe, expect, it, jest } from "@jest/globals";
import { GeneratorStrategy } from "../src/generator/generator.strategy";
import { Processor } from "../src/generator/module.processor";

describe("Processor", () => {
  it("should traverse and generate via strategy", () => {
    const mockStrategy: GeneratorStrategy = {
      generate: jest.fn(),
    };

    const processor = new Processor(mockStrategy);

    processor.process(
      {
        modules: [
          {
            name: "Test",
            label: "test",
            permissions: ["READ"],
          },
        ],
      },
      "dummy.ts",
    );

    expect(mockStrategy.generate).toHaveBeenCalledWith(
      ["test.read"],
      "dummy.ts",
    );
  });
});
