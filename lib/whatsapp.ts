// lib/whatsapp.ts
// WhatsApp notification sender with graceful fallback for sandbox mode.
// Uses Twilio WhatsApp API.
//
// IMPORTANT: For business-initiated messages in production, you MUST:
//   1. Submit message templates to WhatsApp Business for approval
//   2. OR have the client message you first (then you can reply freely within 24h)
//
// For initial testing: Use Twilio Sandbox (clients must join sandbox first)

import twilio from "twilio";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://premasse.co.zw";

// ─── Client singleton ────────────────────────────────────────────────────────

function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    return null; // Graceful degradation - WhatsApp not configured
  }

  return twilio(accountSid, authToken);
}

// ─── Phone normalisation ─────────────────────────────────────────────────────
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

// ─── Check if WhatsApp is configured ─────────────────────────────────────────

export function isWhatsAppConfigured(): boolean {
  const fromNumber = process.env.TWILIO_WHATSAPP_FROM;
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  return !!(fromNumber && accountSid);
}

export type WhatsAppResult =
  | { success: true;  sid: string }
  | { success: false; error: string };

// ─── Send a WhatsApp message (with graceful degradation) ─────────────────────

async function sendWhatsApp(
  to:   string,
  body: string
): Promise<WhatsAppResult> {
  const fromNumber = process.env.TWILIO_WHATSAPP_FROM;
  const client = getTwilioClient();
  
  if (!client || !fromNumber) {
    console.warn("[whatsapp] WhatsApp not configured — skipping message");
    return { success: false, error: "WhatsApp not configured" };
  }

  try {
    const message = await client.messages.create({
      from: fromNumber,
      to:   `whatsapp:${normaliseZimbabwePhone(to)}`,
      body,
    });

    console.info(`[whatsapp] Sent to ${to} — SID: ${message.sid}`);
    return { success: true, sid: message.sid };
  } catch (err: any) {
    console.error("[whatsapp] Send failed:", err?.message ?? err);
    
    // Check if it's a template error (common in sandbox mode)
    if (err?.message?.includes("not part of an existing conversation")) {
      return { 
        success: false, 
        error: "WhatsApp: Client must message first (sandbox mode) or templates must be approved for production." 
      };
    }
    
    return { success: false, error: err?.message ?? "Unknown error" };
  }
}

// ─── Notification: request received ──────────────────────────────────────────

export async function sendRequestReceivedWhatsApp(params: {
  clientName:  string;
  clientPhone: string;
  serviceName: string;
  requestId:   string;
}): Promise<WhatsAppResult> {
  if (!isWhatsAppConfigured()) {
    return { success: false, error: "WhatsApp not configured" };
  }

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

// ─── Notification: status updated ────────────────────────────────────────────

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
  if (!isWhatsAppConfigured()) {
    return { success: false, error: "WhatsApp not configured" };
  }

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

// ─── Notification: payment confirmed ─────────────────────────────────────────

export async function sendPaymentConfirmedWhatsApp(params: {
  clientName:  string;
  clientPhone: string;
  serviceName: string;
  amount:      number;
  requestId:   string;
}): Promise<WhatsAppResult> {
  if (!isWhatsAppConfigured()) {
    return { success: false, error: "WhatsApp not configured" };
  }

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

// ─── Admin: new request alert ────────────────────────────────────────────────

export async function sendAdminNewRequestWhatsApp(params: {
  clientName:  string;
  clientPhone: string;
  serviceName: string;
  requestId:   string;
}): Promise<WhatsAppResult> {
  if (!isWhatsAppConfigured()) {
    return { success: false, error: "WhatsApp not configured" };
  }

  const adminPhone = process.env.ADMIN_WHATSAPP_PHONE;
  if (!adminPhone) {
    console.warn("[whatsapp] ADMIN_WHATSAPP_PHONE not set — skipping admin alert");
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