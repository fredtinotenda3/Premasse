// lib/whatsapp.ts
// WhatsApp notification sender.
// Uses Twilio WhatsApp API — the most reliable option for Zimbabwe.
// Alternative: Africa's Talking (has local Zimbabwe presence, cheaper rates).
//
// Setup:
//   1. Create a Twilio account at twilio.com
//   2. Enable WhatsApp Sandbox (free for testing) or buy a WhatsApp-enabled number
//   3. Add to .env.local:
//      TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//      TWILIO_AUTH_TOKEN=your_auth_token
//      TWILIO_WHATSAPP_FROM=whatsapp:+14155238886  (sandbox) or your number
//
// Cost: ~$0.005 per message sent. For 100 clients/month = ~$0.50.

import twilio from "twilio";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://premasse.co.zw";

// ── Client singleton ──────────────────────────────────────────────────────────

function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error(
      "TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set in .env.local"
    );
  }

  return twilio(accountSid, authToken);
}

// ── Phone normalisation ───────────────────────────────────────────────────────
// Converts Zimbabwean format (0771234567, +263771234567) to E.164 (+263771234567)

export function normaliseZimbabwePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  // Already has 263 prefix
  if (digits.startsWith("263") && digits.length === 12) {
    return `+${digits}`;
  }

  // Local format: 07xxxxxxxx → +2637xxxxxxxx
  if (digits.startsWith("0") && digits.length === 10) {
    return `+263${digits.slice(1)}`;
  }

  // Assume it's already correct
  return phone.startsWith("+") ? phone : `+${digits}`;
}

// ── Message templates ─────────────────────────────────────────────────────────
// WhatsApp requires pre-approved templates for business-initiated messages.
// These plain-text messages work in the sandbox and for session messages
// (within 24h of client contacting you first).
// For production: submit templates at business.whatsapp.com

export type WhatsAppResult =
  | { success: true;  sid: string }
  | { success: false; error: string };

// ── Send a WhatsApp message ───────────────────────────────────────────────────

async function sendWhatsApp(
  to:   string,
  body: string
): Promise<WhatsAppResult> {
  const fromNumber = process.env.TWILIO_WHATSAPP_FROM;
  if (!fromNumber) {
    console.warn("[whatsapp] TWILIO_WHATSAPP_FROM not set — skipping WhatsApp");
    return { success: false, error: "WhatsApp not configured" };
  }

  try {
    const client  = getTwilioClient();
    const message = await client.messages.create({
      from: fromNumber,
      to:   `whatsapp:${normaliseZimbabwePhone(to)}`,
      body,
    });

    console.info(`[whatsapp] Sent to ${to} — SID: ${message.sid}`);
    return { success: true, sid: message.sid };
  } catch (err: any) {
    console.error("[whatsapp] Send failed:", err?.message ?? err);
    return { success: false, error: err?.message ?? "Unknown error" };
  }
}

// ── Notification: request received ───────────────────────────────────────────

export async function sendRequestReceivedWhatsApp(params: {
  clientName:  string;
  clientPhone: string;
  serviceName: string;
  requestId:   string;
}): Promise<WhatsAppResult> {
  const body = [
    `Hello ${params.clientName.split(" ")[0]},`,
    ``,
    `Thank you for contacting *Premasse Business Services*.`,
    ``,
    `We have received your request for *${params.serviceName}* and a registered practitioner will review it shortly.`,
    ``,
    `We will be in touch within *1 business day* via WhatsApp or email.`,
    ``,
    `Reference: ${params.requestId.slice(-8).toUpperCase()}`,
    ``,
    `— Premasse Business Services`,
    `📍 Harare, Zimbabwe`,
    `🌐 ${SITE_URL}`,
  ].join("\n");

  return sendWhatsApp(params.clientPhone, body);
}

// ── Notification: status updated ─────────────────────────────────────────────

const STATUS_MESSAGES: Record<string, string> = {
  IN_REVIEW:        "Our team is currently reviewing your request.",
  IN_PROGRESS:      "Work on your request has begun. We will keep you updated.",
  AWAITING_DOCS:    "We need additional documents from you to continue. Please check your email or log in to your portal to see what is required.",
  AWAITING_PAYMENT: "A payment request has been sent to you. Please check your email for the payment link.",
  COMPLETED:        "Great news! Your request has been completed. Please check your email for details.",
  CANCELLED:        "Your request has been cancelled. Please contact us if you have any questions.",
};

export async function sendStatusUpdateWhatsApp(params: {
  clientName:  string;
  clientPhone: string;
  serviceName: string;
  newStatus:   string;
  requestId:   string;
  adminNote?:  string;
}): Promise<WhatsAppResult> {
  const statusMessage = STATUS_MESSAGES[params.newStatus];
  if (!statusMessage) {
    return { success: false, error: "No WhatsApp template for this status" };
  }

  // Don't send WhatsApp for internal-only status changes
  if (["PENDING", "IN_REVIEW"].includes(params.newStatus) && !params.adminNote) {
    return { success: false, error: "Status change does not require WhatsApp notification" };
  }

  const lines = [
    `Hello ${params.clientName.split(" ")[0]},`,
    ``,
    `*Update on your ${params.serviceName} request:*`,
    ``,
    statusMessage,
  ];

  if (params.adminNote && !params.adminNote.startsWith("[internal]")) {
    lines.push(``, `Message from our team:`, `"${params.adminNote}"`);
  }

  if (params.newStatus === "AWAITING_DOCS" || params.newStatus === "AWAITING_PAYMENT") {
    lines.push(``, `Log in to your client portal: ${SITE_URL}/portal`);
  }

  lines.push(
    ``,
    `Reference: ${params.requestId.slice(-8).toUpperCase()}`,
    ``,
    `— Premasse Business Services`
  );

  return sendWhatsApp(params.clientPhone, lines.join("\n"));
}

// ── Notification: payment confirmed ──────────────────────────────────────────

export async function sendPaymentConfirmedWhatsApp(params: {
  clientName:  string;
  clientPhone: string;
  serviceName: string;
  amount:      number;
  requestId:   string;
}): Promise<WhatsAppResult> {
  const body = [
    `Hello ${params.clientName.split(" ")[0]},`,
    ``,
    `✅ *Payment confirmed!*`,
    ``,
    `We have received your payment of *$${params.amount.toFixed(2)} USD* for *${params.serviceName}*.`,
    ``,
    `Our team will now process your request. We will be in touch with an update shortly.`,
    ``,
    `Reference: ${params.requestId.slice(-8).toUpperCase()}`,
    ``,
    `You can track your request at: ${SITE_URL}/portal`,
    ``,
    `— Premasse Business Services`,
  ].join("\n");

  return sendWhatsApp(params.clientPhone, body);
}

// ── Admin: new request alert ──────────────────────────────────────────────────
// Sends a WhatsApp to the admin when a new request arrives.
// Much faster than email for a one-person operation.

export async function sendAdminNewRequestWhatsApp(params: {
  clientName:  string;
  clientPhone: string;
  serviceName: string;
  requestId:   string;
}): Promise<WhatsAppResult> {
  const adminPhone = process.env.ADMIN_WHATSAPP_PHONE;
  if (!adminPhone) {
    return { success: false, error: "ADMIN_WHATSAPP_PHONE not set" };
  }

  const body = [
    `🔔 *New service request received*`,
    ``,
    `*Service:* ${params.serviceName}`,
    `*Client:* ${params.clientName}`,
    `*Phone:* ${params.clientPhone}`,
    `*Reference:* ${params.requestId.slice(-8).toUpperCase()}`,
    ``,
    `Open in dashboard: ${SITE_URL}/dashboard/requests/${params.requestId}`,
  ].join("\n");

  return sendWhatsApp(adminPhone, body);
}