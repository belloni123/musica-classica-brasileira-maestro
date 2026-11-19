import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AppRole } from "@/lib/permissions/roles";
import {
  canAccessAdmin,
  canAccessCompleteCatalog,
  canManageUsers,
  canWriteEditorial,
} from "@/lib/permissions/roles";

export type CurrentProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: AppRole;
  status: string;
};

export const getCurrentUser = cache(async () => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
});

const getProfileForUser = cache(async (userId: string): Promise<CurrentProfile | null> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("id,email,full_name,role,status")
      .eq("id", userId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data as CurrentProfile;
  } catch {
    return null;
  }
});

export async function getCurrentProfile(): Promise<CurrentProfile | null> {
  const user = await getCurrentUser();
  return user ? getProfileForUser(user.id) : null;
}

export function isAdmin(profile: CurrentProfile | null) {
  return profile?.role === "admin";
}

export function hasUserManagementAccess(profile: CurrentProfile | null) {
  return canManageUsers(profile?.role);
}

export function hasEditorialAccess(profile: CurrentProfile | null) {
  return canAccessAdmin(profile?.role);
}

export function hasEditorialWriteAccess(profile: CurrentProfile | null) {
  return canWriteEditorial(profile?.role);
}

export function hasCompleteCatalogAccess(profile: CurrentProfile | null) {
  return canAccessCompleteCatalog(profile?.role);
}

export async function requireAdminAccess() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/entrar");
  }

  const profile = await getProfileForUser(user.id);

  if (!profile || !hasEditorialAccess(profile)) {
    redirect("/acesso-negado");
  }

  return { user, profile };
}

export async function requireSuperAdminAccess() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/entrar");
  }

  const profile = await getProfileForUser(user.id);

  if (!profile || !hasUserManagementAccess(profile)) {
    redirect("/acesso-negado");
  }

  return { user, profile };
}

export async function requireAuthenticatedUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/entrar");
  }

  return user;
}

export async function requireEditorialWriteAccess() {
  const { user, profile } = await requireAdminAccess();

  if (!hasEditorialWriteAccess(profile)) {
    redirect("/acesso-negado");
  }

  return { user, profile };
}
