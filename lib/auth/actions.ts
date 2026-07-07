"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { enforceAuthRateLimit, keepMinimumAuthResponseTime } from "@/lib/security/auth-guards";
import { isHoneypotFilled, normalizeEmail } from "@/lib/security/request";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile, hasEditorialAccess } from "@/lib/auth/session";

const signInSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(256),
});

const resetPasswordSchema = z.object({
  email: z.string().email().max(254),
});

export async function signIn(formData: FormData) {
  const startedAt = Date.now();
  if (isHoneypotFilled(formData)) {
    await keepMinimumAuthResponseTime(startedAt);
    redirect("/entrar?error=credenciais");
  }

  const parsed = signInSchema.safeParse({
    email: normalizeEmail(formData.get("email")),
    password: String(formData.get("password") ?? ""),
  });

  if (!parsed.success) {
    await keepMinimumAuthResponseTime(startedAt);
    redirect("/entrar?error=credenciais");
  }

  const rateLimit = await enforceAuthRateLimit("sign-in", parsed.data.email);
  if (!rateLimit.allowed) {
    await keepMinimumAuthResponseTime(startedAt);
    redirect("/entrar?error=limite");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    await keepMinimumAuthResponseTime(startedAt);
    redirect("/entrar?error=credenciais");
  }

  revalidatePath("/", "layout");
  const profile = await getCurrentProfile();
  redirect(hasEditorialAccess(profile) ? "/admin/dashboard" : "/minha-conta");
}

export async function signUp(formData: FormData) {
  const startedAt = Date.now();
  if (isHoneypotFilled(formData)) {
    await keepMinimumAuthResponseTime(startedAt);
  }

  await keepMinimumAuthResponseTime(startedAt);
  redirect("/entrar?cadastro=admin");
}

export async function signOut() {
  const supabase = await createClient();

  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function resetPassword(formData: FormData) {
  const startedAt = Date.now();
  if (isHoneypotFilled(formData)) {
    await keepMinimumAuthResponseTime(startedAt);
    redirect("/entrar?reset=enviado");
  }

  const parsed = resetPasswordSchema.safeParse({
    email: normalizeEmail(formData.get("email")),
  });

  if (!parsed.success) {
    await keepMinimumAuthResponseTime(startedAt);
    redirect("/entrar?reset=enviado");
  }

  const rateLimit = await enforceAuthRateLimit("reset-password", parsed.data.email);
  if (!rateLimit.allowed) {
    await keepMinimumAuthResponseTime(startedAt);
    redirect("/entrar?reset=enviado");
  }

  const supabase = await createClient();

  await supabase.auth.resetPasswordForEmail(parsed.data.email);
  await keepMinimumAuthResponseTime(startedAt);
  redirect("/entrar?reset=enviado");
}
