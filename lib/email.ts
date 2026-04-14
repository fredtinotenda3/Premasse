// lib/email.ts
// Server-side email sending functions.
// Each function renders a React Email template and sends via Resend.
// Import these in API routes and server actions — never call resend.emails.send directly.

import { render } from "@react-email/render";
import { resend, EMAIL_FROM, EMAIL_ADMIN, SITE_URL } from "./resend";
import ClientConfirmation from "@/emails/ClientConfirmation";
import AdminNewRequest    from "@/emails/AdminNewRequest";

// ── Types ─────────────────────────────────────────────────────────────────────

type EmailResult =
  | { success: true;  messageId: string }
  | { success: false; error: string };

// ── Client confirmation ───────────────────────────────────────────────────────
// Sent to the client right after their request is created.

export async function sendClientConfirmation(params: {
  clientName:  string;
  clientEmail: string;
  serviceName: string;
  requestId:   string;
  notes:       string;
}): Promise<EmailResult> {
  try {
    const html = await render(
      ClientConfirmation({
        clientName:  params.clientName,
        serviceName: params.serviceName,
        requestId:   params.requestId,
        notes:       params.notes,
        siteUrl:     SITE_URL,
      })
    );

    const { data, error } = await resend.emails.send({
      from:    EMAIL_FROM,
      to:      [params.clientEmail],
      subject: `Request received: ${params.serviceName} — Premasse`,
      html,
    });

    if (error || !data) {
      console.error("[email:clientConfirmation] Resend error:", error);
      return { success: false, error: error?.message ?? "Unknown Resend error" };
    }

    console.info(
      `[email:clientConfirmation] Sent to ${params.clientEmail} (id=${data.id})`
    );
    return { success: true, messageId: data.id };
  } catch (err) {
    console.error("[email:clientConfirmation] Unexpected error:", err);
    return { success: false, error: String(err) };
  }
}

// ── Admin alert ───────────────────────────────────────────────────────────────
// Sent to the Premasse admin when a new request arrives.

export async function sendAdminAlert(params: {
  clientName:  string;
  clientEmail: string;
  clientPhone: string | null;
  serviceName: string;
  notes:       string;
  requestId:   string;
}): Promise<EmailResult> {
  const dashboardUrl = `${SITE_URL}/dashboard/requests/${params.requestId}`;
  const submittedAt  = new Date().toLocaleString("en-ZW", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone:  "Africa/Harare",
  });

  try {
    const html = await render(
      AdminNewRequest({
        clientName:   params.clientName,
        clientEmail:  params.clientEmail,
        clientPhone:  params.clientPhone,
        serviceName:  params.serviceName,
        notes:        params.notes,
        requestId:    params.requestId,
        submittedAt,
        dashboardUrl,
      })
    );

    const { data, error } = await resend.emails.send({
      from:    EMAIL_FROM,
      to:      [EMAIL_ADMIN],
      subject: `New request: ${params.serviceName} from ${params.clientName}`,
      html,
    });

    if (error || !data) {
      console.error("[email:adminAlert] Resend error:", error);
      return { success: false, error: error?.message ?? "Unknown Resend error" };
    }

    console.info(
      `[email:adminAlert] Sent to ${EMAIL_ADMIN} (id=${data.id})`
    );
    return { success: true, messageId: data.id };
  } catch (err) {
    console.error("[email:adminAlert] Unexpected error:", err);
    return { success: false, error: String(err) };
  }
}

// ── Send both in parallel ─────────────────────────────────────────────────────
// Convenience wrapper used in the API route — fires both emails at once.
// Neither failure blocks the request from being saved.

export async function sendRequestEmails(params: {
  clientName:  string;
  clientEmail: string;
  clientPhone: string | null;
  serviceName: string;
  notes:       string;
  requestId:   string;
}): Promise<void> {
  const [clientResult, adminResult] = await Promise.allSettled([
    sendClientConfirmation({
      clientName:  params.clientName,
      clientEmail: params.clientEmail,
      serviceName: params.serviceName,
      requestId:   params.requestId,
      notes:       params.notes,
    }),
    sendAdminAlert(params),
  ]);

  if (clientResult.status === "rejected" || !clientResult.value.success) {
    console.warn("[email] Client confirmation failed — request still saved.");
  }
  if (adminResult.status === "rejected" || !adminResult.value.success) {
    console.warn("[email] Admin alert failed — request still saved.");
  }
}