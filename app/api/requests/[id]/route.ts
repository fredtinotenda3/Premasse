// app/api/requests/[id]/route.ts
// GET  — fetch a single request (admin only)
// PATCH — update request status (admin only)

import { NextRequest, NextResponse } from "next/server";
import { z }      from "zod";
import { auth }   from "@/auth";
import { prisma } from "@/lib/prisma";
import { RequestStatus } from "@prisma/client";

const patchSchema = z.object({
  status:     z.nativeEnum(RequestStatus).optional(),
  adminNotes: z.string().max(2000).optional(),
});

// ── GET /api/requests/:id ─────────────────────────────────────────────────────

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Unauthorised." }, { status: 401 });
  }

  const { id } = await params;

  const request = await prisma.serviceRequest.findUnique({
    where:   { id },
    include: {
      service:   { select: { name: true, category: true } },
      documents: { orderBy: { uploadedAt: "desc" } },
      auditLogs: {
        orderBy: { createdAt: "desc" },
        include: { admin: { select: { name: true, email: true } } },
      },
      payments: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!request) {
    return NextResponse.json({ success: false, error: "Request not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true, request });
}

// ── PATCH /api/requests/:id ───────────────────────────────────────────────────

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Unauthorised." }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try { body = await req.json(); }
  catch {
    return NextResponse.json({ success: false, error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const request = await prisma.serviceRequest.findUnique({
    where:  { id },
    select: { id: true, status: true },
  });

  if (!request) {
    return NextResponse.json({ success: false, error: "Request not found." }, { status: 404 });
  }

  const { status, adminNotes } = parsed.data;

  // If status is changing, write an audit log entry
  if (status && status !== request.status) {
    await prisma.$transaction([
      prisma.serviceRequest.update({
        where: { id },
        data:  { status, ...(adminNotes !== undefined ? { adminNotes } : {}) },
      }),
      prisma.auditLog.create({
        data: {
          requestId:  id,
          changedBy:  session.user.id,
          fromStatus: request.status,
          toStatus:   status,
        },
      }),
    ]);
  } else {
    await prisma.serviceRequest.update({
      where: { id },
      data:  { ...(adminNotes !== undefined ? { adminNotes } : {}) },
    });
  }

  return NextResponse.json({ success: true });
}