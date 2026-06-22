import { Permission, PERMISSIONS } from "../src";

console.log(...PERMISSIONS);

function userAuthContext(permissions: Permission[]) {
  return {
    can: (permission: Permission): boolean => permissions.includes(permission),
  };
}

function main() {
  const uac = userAuthContext([
    "farmer_management.farmers.create",
    "technician_management.task_dashboard.create",
    "administrative_structure.agencies.update",
  ]);

  if (
    uac.can("farmer_management.farmers.create") ||
    uac.can("technician_management.task_dashboard.create") ||
    uac.can("administrative_structure.agencies.update")
  ) {
    console.log("User can create farmer");
  } else {
    console.log("User cannot create farmer");
  }
}

main();
