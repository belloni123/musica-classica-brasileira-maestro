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

export const roleLabels: Record<AppRole, string> = {
  user: "Usuário",
  subscriber_individual: "Assinante individual",
  subscriber_professional: "Assinante profissional",
  institution_user: "Usuário institucional",
  institution_admin: "Administrador institucional",
  editor: "Editor",
  reviewer: "Revisor",
  admin: "Super admin",
};

export const mvpAssignableRoles = [
  "subscriber_individual",
  "admin",
  "editor",
  "reviewer",
] as const satisfies readonly AppRole[];

export type MvpAssignableRole = (typeof mvpAssignableRoles)[number];

export function canAccessAdmin(role?: AppRole | null) {
  return role === "admin" || role === "editor" || role === "reviewer";
}

export function canManageUsers(role?: AppRole | null) {
  return role === "admin";
}

export function canWriteEditorial(role?: AppRole | null) {
  return role === "admin" || role === "editor";
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
