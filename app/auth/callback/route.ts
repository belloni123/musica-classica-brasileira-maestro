import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { publicEnv } from "@/lib/env";

export async function GET(request: NextRequest) {
  const origin = publicEnv.NEXT_PUBLIC_SITE_URL ?? "https://obras.maestrothiagosantos.com.br";
  const code = request.nextUrl.searchParams.get("code");
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL("/nova-senha", origin));
  }
  return NextResponse.redirect(new URL("/recuperar-senha?error=link", origin));
}
