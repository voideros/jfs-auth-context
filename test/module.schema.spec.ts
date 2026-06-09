import { ZodError } from "zod";
import { ModuleInputDataSchema } from "../src/schemas/module.schema";

describe("ModuleInputDataSchema", () => {
  describe("Success Scenarios", () => {
    it("should pass validation for a valid simple module", () => {
      const validData = {
        modules: [
          {
            name: "ValidName",
            label: "valid_label",
            permissions: ["MODULE", "READ"],
          },
        ],
      };

      expect(() => ModuleInputDataSchema.parse(validData)).not.toThrow();
    });

    it("should pass validation for modules with nested submodules", () => {
      const validData = {
        modules: [
          {
            name: "ParentModule",
            label: "parent",
            permissions: ["MODULE"],
            submodules: [
              {
                name: "ChildModule",
                label: "child",
                permissions: ["READ", "WRITE"],
              },
            ],
          },
        ],
      };

      expect(() => ModuleInputDataSchema.parse(validData)).not.toThrow();
    });
  });

  describe("Error Scenarios", () => {
    it("should fail when module name is too short", () => {
      const invalidData = {
        modules: [
          {
            name: "", // Too short
            label: "valid_label",
            permissions: ["MODULE"],
          },
        ],
      };

      expect(() => ModuleInputDataSchema.parse(invalidData)).toThrow(ZodError);
    });

    it("should fail when module name is too long", () => {
      const invalidData = {
        modules: [
          {
            name: "a".repeat(51), // Too long
            label: "valid_label",
            permissions: ["MODULE"],
          },
        ],
      };

      expect(() => ModuleInputDataSchema.parse(invalidData)).toThrow(ZodError);
    });

    it("should fail when module label is too short", () => {
      const invalidData = {
        modules: [
          {
            name: "ValidName",
            label: "", // Too short
            permissions: ["MODULE"],
          },
        ],
      };

      expect(() => ModuleInputDataSchema.parse(invalidData)).toThrow(ZodError);
    });

    it("should fail when module label is too long", () => {
      const invalidData = {
        modules: [
          {
            name: "ValidName",
            label: "a".repeat(51), // Too long
            permissions: ["MODULE"],
          },
        ],
      };

      expect(() => ModuleInputDataSchema.parse(invalidData)).toThrow(ZodError);
    });

    it("should fail when permissions array is empty", () => {
      const invalidData = {
        modules: [
          {
            name: "ValidName",
            label: "valid_label",
            permissions: [], // Empty permissions
          },
        ],
      };

      expect(() => ModuleInputDataSchema.parse(invalidData)).toThrow(ZodError);
    });

    it("should fail when required fields are missing", () => {
      const invalidData = {
        modules: [
          {
            name: "ValidName",
            // missing label
            permissions: ["MODULE"],
          },
        ],
      };

      expect(() => ModuleInputDataSchema.parse(invalidData)).toThrow(ZodError);
    });

    it("should fail when submodule fails validation", () => {
      const invalidData = {
        modules: [
          {
            name: "ParentModule",
            label: "parent",
            permissions: ["MODULE"],
            submodules: [
              {
                name: "ChildModule",
                label: "child",
                permissions: [], // Invalid permissions array
              },
            ],
          },
        ],
      };

      expect(() => ModuleInputDataSchema.parse(invalidData)).toThrow(ZodError);
    });
  });
});
