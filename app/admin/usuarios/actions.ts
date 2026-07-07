"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { insertAuditLog } from "@/lib/admin/logging";
import { mvpAssignableRoles } from "@/lib/permissions/roles";
import { formString, normalizeEmail } from "@/lib/security/request";
import { requireSuperAdminAccess } from "@/lib/auth/session";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const createManagedUserSchema = z.object({
  email: z.string().email().max(254),
  fullName: z.string().min(2).max(120),
  password: z
    .string()
    .min(10)
    .max(128)
    .regex(/[a-z]/)
    .regex(/[A-Z]/)
    .regex(/[0-9]/),
  role: z.enum(mvpAssignableRoles),
});

function redirectWithError(code: string): never {
  redirect(`/admin/usuarios?error=${encodeURIComponent(code)}`);
}

export async function createManagedUser(formData: FormData) {
  const { user: actor } = await requireSuperAdminAccess();
  const parsed = createManagedUserSchema.safeParse({
    email: normalizeEmail(formData.get("email")),
    fullName: formString(formData.get("full_name")),
    password: String(formData.get("password") ?? ""),
    role: formString(formData.get("role")),
  });

  if (!parsed.success) {
    redirectWithError("validacao");
  }
  const input = parsed.data;

  let authUserId: string | null = null;
  let errorCode: string | null = null;

  try {
    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true,
      user_metadata: {
        full_name: input.fullName,
      },
    });

    if (error || !data.user) {
      errorCode = error?.status === 422 ? "duplicado" : "auth";
    } else {
      authUserId = data.user.id;

      const { error: profileError } = await adminClient.from("profiles").upsert({
        id: authUserId,
        email: input.email,
        full_name: input.fullName,
        role: input.role,
        status: "active",
      });

      if (profileError) {
        throw profileError;
      }

      const supabase = await createClient();
      await insertAuditLog(supabase, actor.id, "user.created", "profile", authUserId, {
        role: input.role,
        email: input.email,
        created_by: "admin_panel",
      });
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("service role key")) {
      errorCode = "configuracao";
    } else if (error instanceof Error && error.message.includes("Supabase URL")) {
      errorCode = "configuracao";
    } else {
      errorCode = "inesperado";
    }
  }

  if (errorCode) {
    redirectWithError(errorCode);
  }

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios?created=1");
}
