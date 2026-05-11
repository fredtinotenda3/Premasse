// middleware.ts
// Route protection + rate limiting for public endpoints
// Combines: Auth guards (existing) + Rate limiting (new)

import { auth } from "@/auth";
import { NextResponse } from "next/server";

// ─── Simple in-memory rate limiting ─────────────────────────────────────────
// For production with multiple instances, use Redis or Upstash.
// This works for single-instance Vercel deployment.

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitRecord>();

// Config: 10 requests per minute per IP
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10;

// Endpoints that need rate limiting (public, non-authenticated)
const RATE_LIMITED_PATHS = new Set([
  "/api/requests",
  "/api/contact",
  "/api/portal/register",
  "/api/upload",
]);

function isRateLimited(ip: string, path: string): boolean {
  if (!RATE_LIMITED_PATHS.has(path)) return false;
  
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (!record) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  
  if (now > record.resetAt) {
    // Window expired, reset
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }
  
  record.count++;
  return false;
}

// Clean up expired entries periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetAt) {
      rateLimitStore.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// ─── Main middleware ─────────────────────────────────────────────────────────

export default auth((req: any) => {
  const { pathname } = req.nextUrl;
  const session      = req.auth;
  const isAuthed     = !!session?.user;
  const role         = session?.user?.role;
  
  // Get client IP (works with Vercel, Cloudflare, etc.)
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? 
             req.headers.get("x-real-ip") ?? 
             "unknown";
  
  // DEBUG: Log all requests and session state (only in development)
  if (process.env.NODE_ENV !== "production") {
    console.log(`[Middleware] ${pathname} | IP: ${ip} | isAuthed: ${isAuthed} | role: ${role}`);
  }
  
  // ── Rate limiting (before auth checks) ────────────────────────────────────
  if (isRateLimited(ip, pathname)) {
    console.warn(`[Middleware] Rate limit exceeded for ${pathname} from ${ip}`);
    return new NextResponse(
      JSON.stringify({ success: false, error: "Too many requests. Please try again later." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }
  
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
  if (pathname.startsWith("/portal") && 
      !pathname.startsWith("/portal/login") && 
      !pathname.startsWith("/portal/register") && 
      !pathname.startsWith("/portal/verify")) {
    
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
    "/api/requests",
    "/api/contact",
    "/api/portal/register",
    "/api/upload",
  ],
};