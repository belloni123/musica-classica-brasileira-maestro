"use client";

import { createBrowserClient } from "@supabase/ssr";
import { assertSupabasePublicEnv, publicEnv } from "@/lib/env";

export function createClient() {
  assertSupabasePublicEnv();
  const supabaseUrl = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase public environment variables are not configured.");
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
