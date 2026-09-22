import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const hostname = (request.headers.get("host") ?? "").split(":")[0];

  // Dedicated media kit for Vinícola Aurora.
  // This preserves the existing application on every other hostname.
  if (
    hostname === "maestro-aurora.vercel.app" ||
    hostname.startsWith("maestro-aurora-")
  ) {
    if (request.nextUrl.pathname === "/" || request.nextUrl.pathname === "/index.html") {
      const url = request.nextUrl.clone();
      url.pathname = "/media.html";
      return NextResponse.rewrite(url);
    }

    if (request.nextUrl.pathname === "/media.html") {
      return NextResponse.next();
    }
  }

  return updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
