// lib/paynow.ts
// Paynow client factory and payment helpers.
// Server-side only — never import this in client components.

// @ts-expect-error: paynow package has no TypeScript types
import { Paynow } from "paynow";
import crypto from "crypto";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// ── Client factory ────────────────────────────────────────────────────────────
// Creates a configured Paynow instance for a specific request.
// resultUrl receives webhook POSTs from Paynow when payment status changes.
// returnUrl is where the client lands after paying on Paynow's site.

export function createPaynowClient(requestId: string): Paynow {
  if (!process.env.PAYNOW_INTEGRATION_ID || !process.env.PAYNOW_INTEGRATION_KEY) {
    throw new Error(
      "PAYNOW_INTEGRATION_ID and PAYNOW_INTEGRATION_KEY must be set in .env.local"
    );
  }

  const paynow = new Paynow(
    process.env.PAYNOW_INTEGRATION_ID,
    process.env.PAYNOW_INTEGRATION_KEY
  );

  paynow.resultUrl = `${SITE_URL}/api/paynow/webhook`;
  paynow.returnUrl = `${SITE_URL}/payment/complete?ref=${requestId}`;

  return paynow;
}

// ── Merchant reference ────────────────────────────────────────────────────────
// Paynow requires a unique merchant reference per payment.
// We use the Payment record's id so it's traceable end-to-end.

export function buildMerchantRef(paymentId: string): string {
  return `PREMASSE-${paymentId}`;
}

// ── Hash verification ─────────────────────────────────────────────────────────
// Paynow signs every webhook POST with a SHA512 HMAC of the payload.
// ALWAYS verify this before updating any DB records.
// If verification fails, the request is either a replay or forgery.

export function verifyPaynowHash(
  payload: Record<string, string>
): boolean {
  const integrationKey = process.env.PAYNOW_INTEGRATION_KEY;
  if (!integrationKey) return false;

  // Extract the hash Paynow sent
  const receivedHash = payload["hash"];
  if (!receivedHash) return false;

  // Rebuild the string to hash: all fields except "hash", sorted by key,
  // concatenated as key=value pairs, then append the integration key.
  const hashString =
    Object.keys(payload)
      .filter((k) => k !== "hash")
      .sort()
      .map((k) => `${payload[k]}`)
      .join("") + integrationKey;

  const expectedHash = crypto
    .createHash("sha512")
    .update(hashString)
    .digest("hex")
    .toUpperCase();

  return receivedHash.toUpperCase() === expectedHash;
}

// ── Parse webhook body ────────────────────────────────────────────────────────
// Paynow sends URL-encoded form data to the webhook endpoint.
// Returns a plain object of key-value pairs.

export function parseWebhookBody(
  body: string
): Record<string, string> {
  return Object.fromEntries(new URLSearchParams(body));
}

// ── Map Paynow status ─────────────────────────────────────────────────────────
// Paynow uses its own status strings — map them to our PaymentStatus enum.

export function mapPaynowStatus(
  paynowStatus: string
): "AWAITING_PAYMENT" | "PAID" | "FAILED" | "CANCELLED" {
  switch (paynowStatus.toLowerCase()) {
    case "paid":
    case "awaiting delivery":
      return "PAID";
    case "cancelled":
      return "CANCELLED";
    case "failed":
    case "disputed":
      return "FAILED";
    default:
      return "AWAITING_PAYMENT";
  }
}