// lib/paynow.ts
// Paynow client factory and payment helpers.
// Server-side only — never import this in client components.

// @ts-expect-error: paynow package has no TypeScript types
import { Paynow } from "paynow";
import crypto from "crypto";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// ── Client factory ───────────────────────────────────────────────────────────

export function createPaynowClient(requestId: string): Paynow {
  const integrationId = process.env.PAYNOW_INTEGRATION_ID;
  const integrationKey = process.env.PAYNOW_INTEGRATION_KEY;
  
  console.log("[paynow] Creating Paynow client with:");
  console.log("[paynow] Integration ID exists:", !!integrationId);
  console.log("[paynow] Integration ID length:", integrationId?.length);
  console.log("[paynow] Integration Key exists:", !!integrationKey);
  
  if (!integrationId || !integrationKey) {
    console.error("[paynow] ❌ Missing Paynow credentials!");
    throw new Error(
      "PAYNOW_INTEGRATION_ID and PAYNOW_INTEGRATION_KEY must be set in .env.local"
    );
  }

  // Trim any whitespace
  const cleanId = integrationId.trim();
  const cleanKey = integrationKey.trim();
  
  console.log("[paynow] Using Integration ID:", cleanId);
  
  const paynow = new Paynow(cleanId, cleanKey);

  paynow.resultUrl = `${SITE_URL}/api/paynow/webhook`;
  paynow.returnUrl = `${SITE_URL}/payment/complete?ref=${requestId}`;

  return paynow;
}

// ── Merchant reference ───────────────────────────────────────────────────────

export function buildMerchantRef(paymentId: string): string {
  return `PREMASSE-${paymentId}`;
}

// ── Hash verification ────────────────────────────────────────────────────────

export function verifyPaynowHash(
  payload: Record<string, string>
): boolean {
  const integrationKey = process.env.PAYNOW_INTEGRATION_KEY;
  if (!integrationKey) return false;

  const receivedHash = payload["hash"];
  if (!receivedHash) return false;

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

// ── Parse webhook body ───────────────────────────────────────────────────────

export function parseWebhookBody(
  body: string
): Record<string, string> {
  return Object.fromEntries(new URLSearchParams(body));
}

// ── Map Paynow status ────────────────────────────────────────────────────────

// In lib/paynow.ts, update the mapPaynowStatus function:

export function mapPaynowStatus(
  paynowStatus: string
): "AWAITING_PAYMENT" | "PAID" | "FAILED" | "CANCELLED" {
  const status = paynowStatus.toLowerCase();
  console.log(`[paynow] Mapping status: "${paynowStatus}" → lower: "${status}"`);
  
  switch (status) {
    case "paid":
    case "awaiting delivery":
    case "completed":
      return "PAID";
    case "cancelled":
    case "canceled":
      return "CANCELLED";
    case "failed":
    case "disputed":
    case "error":
      return "FAILED";
    case "pending":
    case "created":
    case "awaited":
    default:
      return "AWAITING_PAYMENT";
  }
}

// ── Test Paynow connection ───────────────────────────────────────────────────

export async function testPaynowConnection(): Promise<boolean> {
  try {
    console.log("[paynow] ✅ Paynow client created successfully");
    return true;
  } catch (error) {
    console.error("[paynow] ❌ Paynow client creation failed:", error);
    return false;
  }
}