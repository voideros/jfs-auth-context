/**
 * A single permission row ready for DB insertion or TS generation.
 *
 * Example:
 *   { label: "supply.distribute.create", actionName: "Criar",
 *     moduleName: "Distribuição de Insumos", moduleLabel: "supply.distribute" }
 */
export interface PermissionEntry {
  /** Fully-qualified permission key, e.g. "supply.distribute.create" */
  label: string;
  /** Human-readable action name from ACTIONS_MAP, e.g. "Criar" */
  actionName: string;
  /** Display name of the owning module, e.g. "Distribuição de Insumos" */
  moduleName: string;
  /** Dot-separated label of the owning module, e.g. "supply.distribute" */
  moduleLabel: string;
}

/**
 * A unique module row extracted from the tree.
 *
 * Example:
 *   { name: "Distribuição de Insumos", label: "supply.distribute", parentLabel: "supply" }
 */
export interface ModuleEntry {
  /** Human-readable module name */
  name: string;
  /** Dot-separated module label (unique) */
  label: string;
  /** Parent module label, or null for top-level modules */
  parentLabel: string | null;
}
