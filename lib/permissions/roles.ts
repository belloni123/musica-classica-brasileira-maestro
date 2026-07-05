export const appRoles = [
  "user",
  "subscriber_individual",
  "subscriber_professional",
  "institution_user",
  "institution_admin",
  "editor",
  "reviewer",
  "admin",
] as const;

export type AppRole = (typeof appRoles)[number];

export function canAccessAdmin(role?: AppRole | null) {
  return role === "admin" || role === "editor" || role === "reviewer";
}

export function canAccessCompleteCatalog(role?: AppRole | null) {
  return (
    role === "admin" ||
    role === "editor" ||
    role === "reviewer" ||
    role === "subscriber_individual" ||
    role === "subscriber_professional" ||
    role === "institution_user" ||
    role === "institution_admin"
  );
}
