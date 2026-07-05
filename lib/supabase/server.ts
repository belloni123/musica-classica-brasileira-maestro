import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createDemoClient } from "@/lib/demo/supabase";
import { assertSupabasePublicEnv, isDemoMode, publicEnv } from "@/lib/env";

export async function createClient() {
  if (isDemoMode()) {
    return createDemoClient() as unknown as ReturnType<typeof createServerClient>;
  }

  assertSupabasePublicEnv();
  const supabaseUrl = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const cookieStore = await cookies();

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase public environment variables are not configured.");
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server components cannot set cookies; middleware refreshes sessions.
        }
      },
    },
  });
}
