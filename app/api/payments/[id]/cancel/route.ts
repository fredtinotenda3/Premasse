// app/api/payments/[id]/cancel/route.ts
// Cancels a pending payment so a new one can be created.

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Admin auth guard
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Unauthorised." }, { status: 401 });
  }

  const { id } = await params;

  // Check if payment exists
  const existingPayment = await prisma.payment.findUnique({
    where: { id },
    select: { id: true, status: true, requestId: true },
  });

  if (!existingPayment) {
    return NextResponse.json({ success: false, error: "Payment not found." }, { status: 404 });
  }

  // Only pending payments can be cancelled
  if (existingPayment.status !== "AWAITING_PAYMENT" && existingPayment.status !== "PENDING") {
    return NextResponse.json(
      { success: false, error: `Cannot cancel payment with status: ${existingPayment.status}` },
      { status: 400 }
    );
  }

  // Update to CANCELLED
  const payment = await prisma.payment.update({
    where: { id },
    data: { status: "CANCELLED" },
    select: { id: true, status: true, requestId: true },
  });

  console.info(
    `[api/payments/cancel] Payment ${id} cancelled by admin ${session.user.email}`
  );

  return NextResponse.json({ success: true, payment });
}