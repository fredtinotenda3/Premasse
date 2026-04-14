// app/(admin)/dashboard/requests/[id]/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect }       from "next/navigation";
import { z }              from "zod";
import { prisma }         from "@/lib/prisma";
import { requireAdmin }   from "@/lib/auth-helpers";
import { RequestStatus }  from "@prisma/client";

const updateStatusSchema = z.object({
  requestId: z.string().cuid(),
  newStatus: z.nativeEnum(RequestStatus),
  note:      z.string().max(500).optional(),
});

export async function updateRequestStatus(formData: FormData): Promise<void> {
  const session = await requireAdmin();

  const parsed = updateStatusSchema.safeParse({
    requestId: formData.get("requestId"),
    newStatus: formData.get("newStatus"),
    note:      formData.get("note") || undefined,
  });

  if (!parsed.success) {
    console.warn("[action:updateStatus] Invalid payload:", parsed.error.flatten());
    return;
  }

  const { requestId, newStatus, note } = parsed.data;

  const request = await prisma.serviceRequest.findUnique({
    where:  { id: requestId },
    select: { id: true, status: true },
  });

  if (!request) {
    console.warn(`[action:updateStatus] Request not found: ${requestId}`);
    return;
  }

  if (request.status === newStatus) {
    return;
  }

  await prisma.$transaction([
    prisma.serviceRequest.update({
      where: { id: requestId },
      data:  { status: newStatus },
    }),
    prisma.auditLog.create({
      data: {
        requestId,
        changedBy:  session.user.id,
        fromStatus: request.status,
        toStatus:   newStatus,
        note:       note ?? null,
      },
    }),
  ]);

  console.info(
    `[action:updateStatus] Request ${requestId} → ${newStatus} by ${session.user.email}`
  );

  revalidatePath(`/dashboard/requests/${requestId}`);
  revalidatePath("/dashboard/requests");

  redirect(`/dashboard/requests/${requestId}?updated=1`);
}