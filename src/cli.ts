#!/usr/bin/env node
import * as fs from "fs";
import JSON5 from "json5";
import * as path from "path";

import { Processor } from "./generator/module.processor";
import { ModuleInputData } from "./generator/module.types";
import { TypeScriptGenerator } from "./generator/typescript.generator";
import { ModuleInputDataSchema } from "./schemas/module.schema";

function main() {
  const inputFile = process.argv[2];

  if (!inputFile) {
    console.error("Error: Please provide a JSON file path as an argument.");
    console.error(
      "Example: jfs-generate ./path/to/input.json [--output ./path/to/output.ts]",
    );
    process.exit(1);
  }

  let outputPathOverride = "";
  const outputFlagIndex = process.argv.indexOf("--output");
  if (outputFlagIndex !== -1 && process.argv[outputFlagIndex + 1]) {
    outputPathOverride = path.resolve(
      process.cwd(),
      process.argv[outputFlagIndex + 1],
    );
  }

  const inputPath = path.resolve(process.cwd(), inputFile);

  if (!fs.existsSync(inputPath)) {
    console.error(`Error: File not found at ${inputPath}`);
    process.exit(1);
  }

  let inputData: ModuleInputData;

  try {
    const rawData = fs.readFileSync(inputPath, "utf-8");
    const parsedData = JSON5.parse(rawData);
    inputData = ModuleInputDataSchema.parse(parsedData);
  } catch (error) {
    console.error("Error parsing or validating JSON file:", error);
    process.exit(1);
  }

  console.log(`Starting permission code generation using ${inputFile}...`);

  let outputPath = "";
  if (outputPathOverride) {
    outputPath = outputPathOverride;
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } else {
    const outputDir = path.join(__dirname, "output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    outputPath = path.join(outputDir, "auto-generated-permissions.ts");
  }

  const strategy = new TypeScriptGenerator();
  const processor = new Processor(strategy);

  processor.process(inputData, outputPath);

  const modulesDataPath = path.join(
    path.dirname(outputPath),
    "auto-generated-modules-data.ts",
  );
  const modulesDataContent = `// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
export const MODULES_DATA = ${JSON.stringify(inputData, null, 2)};
`;
  fs.writeFileSync(modulesDataPath, modulesDataContent);

  console.log(`[✔] Generated Type definitions: ${outputPath}`);
  console.log(`[✔] Generated Module data: ${modulesDataPath}`);
}

main();
