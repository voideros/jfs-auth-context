import { Permission, PERMISSIONS } from "../src";

console.log(PERMISSIONS);

function userAuthContext(permissions: Permission[]) {
  return {
    can: (permission: Permission): boolean => permissions.includes(permission),
  };
}

function main() {
  const uac = userAuthContext([
    "promotion.farmers.manage.create",
    "promotion.module",
    "promotion.farmers.manage.export",
  ]);

  if (uac.can("promotion.farmers.manage.create")) {
    console.log("User can create farmer");
  } else {
    console.log("User cannot create farmer");
  }
}

main();
