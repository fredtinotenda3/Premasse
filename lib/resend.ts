// lib/resend.ts
// Resend client singleton — import from here, never instantiate directly.
// Used server-side only (API routes, server actions).

import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error(
    "RESEND_API_KEY is not set. Add it to .env.local before sending emails."
  );
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// ── Sender addresses ──────────────────────────────────────────────────────────
// Update FROM_ADDRESS once you've verified your domain in Resend.
// Until then, use the Resend sandbox address for testing.

export const EMAIL_FROM    = process.env.EMAIL_FROM    ?? "Premasse <onboarding@resend.dev>";
export const EMAIL_ADMIN   = process.env.EMAIL_ADMIN   ?? "admin@premasse.co.zw";
export const SITE_URL      = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";