# @jfs/shared-modules-and-auth-context

Shared auth modules and permission generator for the JFS platform.

This package provides a type-safe way to define modules, submodules, and permission structures. It generates a strongly-typed TypeScript `Permission` union from a central JSON configuration.

## Installation

```bash
npm install @jfs/shared-modules-and-auth-context
# or
yarn add @jfs/shared-modules-and-auth-context
```

## CLI Usage

The package exposes a CLI executable that you can run to generate your `Permission` typings dynamically based on a JSON configuration file.

```bash
npx jfs-generate ./MODULES.json
```

By default, the types will be output to an `output/auto-generated-permissions.ts` file relative to the script execution path.
You can specify a custom output path using the `--output` flag:

```bash
npx jfs-generate ./MODULES.json --output ./src/shared/permissions.ts
```

## Programmatic Usage

You can import the generated types and classes directly for building your backend controllers, guards, or frontend access controls.

```typescript
import { Permission } from "@jfs/shared-modules-and-auth-context";

class AuthorizationContext {
  private userPermissions: Set<Permission>;

  constructor(permissions: Permission[]) {
    this.userPermissions = new Set(permissions);
  }

  public hasPermission(permission: Permission): boolean {
    return this.userPermissions.has(permission);
  }
}

// Example usage
const user = new AuthorizationContext([
  "promotion.module",
  "promotion.farmers.manage.read",
]);

if (user.hasPermission("promotion.farmers.manage.read")) {
  console.log("Access Granted!");
}
```

## JSON Configuration Schema

The generator accepts a JSON file conforming to the `ModuleInputData` schema.

```json
{
  "modules": [
    {
      "name": "Promotion",
      "label": "promotion",
      "permissions": ["MODULE"],
      "submodules": [
        {
          "name": "Farmers",
          "label": "farmers",
          "permissions": ["MODULE"],
          "submodules": [
            {
              "name": "Manage",
              "label": "manage",
              "permissions": ["MODULE", "READ", "CREATE", "DELETE"],
              "submodules": []
            }
          ]
        }
      ]
    }
  ]
}
```

## Generator Architecture

The generator is built with clean architecture (OOP). It uses the **Visitor** pattern to traverse the JSON module tree and the **Strategy** pattern to allow custom target language generators. You can use these underlying tools programmatically.

```typescript
import {
  Processor,
  TypeScriptGenerator,
  ModuleInputData,
} from "@jfs/shared-modules-and-auth-context";

const inputData: ModuleInputData = {
  /* ... */
};

const strategy = new TypeScriptGenerator();
const processor = new Processor(strategy);

processor.process(inputData, "./custom-output.ts");
```

## Development & Publishing

- `yarn generate` - Runs the code generator locally
- `yarn build` - Builds the package using tsup
- `yarn test` - Runs the jest unit tests
- `yarn changeset` - Creates an intent for version bump
- `yarn release` - Consumes changesets and publishes
