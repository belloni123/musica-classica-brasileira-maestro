import type { AppRole } from "@/lib/permissions/roles";
import { canAccessCompleteCatalog } from "@/lib/permissions/roles";

export type CatalogAccessDecision = {
  canAccess: boolean;
  reason: "editorial" | "subscription" | "public";
};

export function getCatalogAccessDecision(role?: AppRole | null): CatalogAccessDecision {
  if (!role || role === "user") {
    return { canAccess: false, reason: "public" };
  }

  if (role === "admin" || role === "editor" || role === "reviewer") {
    return { canAccess: true, reason: "editorial" };
  }

  return {
    canAccess: canAccessCompleteCatalog(role),
    reason: "subscription",
  };
}
