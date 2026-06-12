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
            submodules: [
              {
                name: "ChildModule",
                label: "child",
              },
            ],
          },
        ],
      };

      expect(() => ModuleInputDataSchema.parse(validData)).not.toThrow();
    });

    it("should pass validation without submodules field", () => {
      const validData = {
        modules: [
          {
            name: "Simple",
            label: "simple",
          },
        ],
      };

      const result = ModuleInputDataSchema.parse(validData);
      expect(result.modules[0].submodules).toBeUndefined();
    });

    it("should pass validation with empty submodules array", () => {
      const validData = {
        modules: [
          {
            name: "Simple",
            label: "simple",
            submodules: [],
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
            submodules: [
              {
                name: "ChildModule",
                label: "", // Invalid: empty label
              },
            ],
          },
        ],
      };

      expect(() => ModuleInputDataSchema.parse(invalidData)).toThrow(ZodError);
    });
  });
});
