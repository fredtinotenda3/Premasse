// middleware.ts  (updated — /portal/* routes added)
// Extends the existing middleware to protect client portal routes.
// /dashboard/* still requires ADMIN.
// /portal/*     requires CLIENT (or any authenticated user).

import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req: any) => {
  const { pathname } = req.nextUrl;
  const session      = req.auth;
  const isAuthed     = !!session?.user;
  const role         = session?.user?.role;

  // ── Admin dashboard ────────────────────────────────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthed) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // ── Client portal ──────────────────────────────────────────────────────────
  if (pathname.startsWith("/portal") && !pathname.startsWith("/portal/login") && !pathname.startsWith("/portal/register") && !pathname.startsWith("/portal/verify")) {
    if (!isAuthed) {
      const url = new URL("/portal/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    // Admins can't use the client portal (they have the dashboard)
    if (role !== "CLIENT") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // ── Redirect authenticated users away from auth pages ─────────────────────
  if (pathname === "/login" && isAuthed && role === "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  if (pathname === "/portal/login" && isAuthed && role === "CLIENT") {
    const callbackUrl = req.nextUrl.searchParams.get("callbackUrl") ?? "/portal";
    return NextResponse.redirect(new URL(callbackUrl, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/portal/:path*",
    "/login",
  ],
};