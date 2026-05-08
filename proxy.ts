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
  
  // DEBUG: Log all requests and session state
  console.log(`[Middleware] ${pathname} | isAuthed: ${isAuthed} | role: ${role} | hasSession: ${!!session}`);

  // ── Admin dashboard ────────────────────────────────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    console.log(`[Middleware] Dashboard access attempt - isAuthed: ${isAuthed}, role: ${role}`);
    
    if (!isAuthed) {
      console.log(`[Middleware] Not authenticated, redirecting to /login from ${pathname}`);
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    if (role !== "ADMIN") {
      console.log(`[Middleware] Role ${role} is not ADMIN, redirecting to /`);
      return NextResponse.redirect(new URL("/", req.url));
    }
    console.log(`[Middleware] Admin access granted to ${pathname}`);
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
    console.log(`[Middleware] Authenticated admin on /login, redirecting to /dashboard`);
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