import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * Route protection (Next.js 16 "proxy", formerly middleware).
 * Server-side layout guards remain the authoritative check — this is a fast
 * redirect so unauthenticated users never reach private page code.
 */
export async function proxy(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
