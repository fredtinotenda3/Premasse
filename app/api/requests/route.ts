// app/api/requests/route.ts  (updated for Phase 3 — email notifications)
// Diff from Phase 1: sendRequestEmails() is now called after the DB transaction.
// Emails fire in parallel and never block the response — a failed email does
// not fail the request. The client always gets a 201 if the DB write succeeds.

import { NextRequest, NextResponse } from "next/server";
import { prisma }                from "@/lib/prisma";
import { sendRequestEmails }     from "@/lib/email";
import {
  serviceRequestSchema,
  type ServiceRequestResponse,
} from "@/validators/request.schema";

export async function POST(
  req: NextRequest
): Promise<NextResponse<ServiceRequestResponse>> {

  // ── 1. Parse + validate ────────────────────────────────────────────────────
  let body: unknown;
  try { body = await req.json(); }
  catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsed = serviceRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Please fix the errors below and try again.",
        fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      },
      { status: 422 }
    );
  }

  const { clientName, clientEmail, clientPhone, serviceId, notes } = parsed.data;

  // ── 2. Verify service ──────────────────────────────────────────────────────
  const service = await prisma.service.findUnique({
    where:  { id: serviceId },
    select: { id: true, name: true, isActive: true },
  });

  if (!service?.isActive) {
    return NextResponse.json(
      { success: false, error: "The selected service is not available." },
      { status: 400 }
    );
  }

  // ── 3. Duplicate guard ─────────────────────────────────────────────────────
  const duplicate = await prisma.serviceRequest.findFirst({
    where:  { clientEmail, serviceId, status: "PENDING" },
    select: { id: true },
  });

  if (duplicate) {
    return NextResponse.json(
      {
        success: false,
        error: "You already have a pending request for this service. Our team will be in touch shortly.",
      },
      { status: 409 }
    );
  }

  // ── 4. DB transaction ──────────────────────────────────────────────────────
  const admin = await prisma.user.findFirst({
    where:   { role: "ADMIN" },
    select:  { id: true },
    orderBy: { createdAt: "asc" },
  });

  if (!admin) {
    return NextResponse.json(
      { success: false, error: "Server configuration error. Please contact us directly." },
      { status: 500 }
    );
  }

  let newRequest: { id: string };
  try {
    newRequest = await prisma.$transaction(async (tx) => {
      const request = await tx.serviceRequest.create({
        data: {
          clientName,
          clientEmail,
          clientPhone: clientPhone || null,
          serviceId,
          notes,
          status: "PENDING",
        },
        select: { id: true },
      });

      await tx.auditLog.create({
        data: {
          requestId:  request.id,
          changedBy:  admin.id,
          fromStatus: null,
          toStatus:   "PENDING",
          note:       `Request submitted via website for service: ${service.name}`,
        },
      });

      return request;
    });
  } catch (err) {
    console.error("[api/requests] DB transaction failed:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again or contact us directly." },
      { status: 500 }
    );
  }

  // ── 5. Send emails (non-blocking) ──────────────────────────────────────────
  // Fire-and-forget — awaited with allSettled so errors are logged but never
  // bubble up to break the 201 response the client is already expecting.
  sendRequestEmails({
    clientName,
    clientEmail,
    clientPhone: clientPhone || null,
    serviceName: service.name,
    notes,
    requestId:   newRequest.id,
  }).catch((err) =>
    console.error("[api/requests] sendRequestEmails threw unexpectedly:", err)
  );

  console.info(
    `[api/requests] Request created: ${newRequest.id} (${service.name} for ${clientEmail})`
  );

  return NextResponse.json(
    {
      success:   true,
      requestId: newRequest.id,
      message:   `Your request has been received. We'll contact you at ${clientEmail} within one business day.`,
    },
    { status: 201 }
  );
}

// GET — fetch active services for the form dropdown (unchanged)
export async function GET(): Promise<NextResponse> {
  try {
    const services = await prisma.service.findMany({
      where:   { isActive: true },
      orderBy: { sortOrder: "asc" },
      select:  { id: true, name: true, slug: true, category: true, description: true, price: true },
    });
    return NextResponse.json({ success: true, services });
  } catch (err) {
    console.error("[api/requests GET] Failed to fetch services:", err);
    return NextResponse.json({ success: false, error: "Failed to load services" }, { status: 500 });
  }
}