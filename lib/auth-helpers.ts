// lib/auth-helpers.ts
// Reusable server-side utilities for reading the session.
// Import these in Server Components and API routes instead of
// calling auth() directly — keeps auth logic in one place.

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { Session } from "next-auth";

// ── requireAdmin ──────────────────────────────────────────────────────────────
// Use at the top of any Server Component or server action that needs an admin.
// Redirects to /login if unauthenticated, throws if role is wrong.
//
// Usage:
//   const session = await requireAdmin();
//   console.log(session.user.id); // fully typed

export async function requireAdmin(): Promise<Session> {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return session;
}

// ── getSessionUser ─────────────────────────────────────────────────────────────
// Returns the current user without redirecting.
// Use in layouts or components that render differently for auth vs unauth.

export async function getSessionUser() {
  const session = await auth();
  return session?.user ?? null;
}

// ── isAdminSession ─────────────────────────────────────────────────────────────
// Boolean check — useful for conditional rendering.

export async function isAdminSession(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === "ADMIN";
}