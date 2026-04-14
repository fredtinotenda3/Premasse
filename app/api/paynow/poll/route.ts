// app/api/paynow/poll/route.ts
// Admin-triggered status poll.
// Useful when a webhook hasn't arrived yet and the admin wants to check manually.
// Also used by the PaymentPanel component to refresh status on page load.

import { NextRequest, NextResponse } from "next/server";
import { auth }                     from "@/auth";
import { prisma }                   from "@/lib/prisma";
import { createPaynowClient, mapPaynowStatus } from "@/lib/paynow";

export async function GET(req: NextRequest) {
  // Admin only
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Unauthorised." }, { status: 401 });
  }

  const paymentId = req.nextUrl.searchParams.get("paymentId");
  if (!paymentId) {
    return NextResponse.json({ success: false, error: "paymentId is required." }, { status: 400 });
  }

  const payment = await prisma.payment.findUnique({
    where:  { id: paymentId },
    select: { id: true, pollUrl: true, status: true, requestId: true },
  });

  if (!payment) {
    return NextResponse.json({ success: false, error: "Payment not found." }, { status: 404 });
  }

  if (!payment.pollUrl) {
    return NextResponse.json({ success: false, error: "No poll URL available for this payment." }, { status: 400 });
  }

  // Already in a terminal state — no need to poll
  if (["PAID", "FAILED", "CANCELLED"].includes(payment.status)) {
    return NextResponse.json({ success: true, status: payment.status, changed: false });
  }

  try {
    const paynow  = createPaynowClient(payment.requestId);
    const result  = await paynow.pollTransaction(payment.pollUrl);
    const newStatus = mapPaynowStatus(result.status());

    // If status changed, update DB
    if (newStatus !== payment.status) {
      await prisma.payment.update({
        where: { id: paymentId },
        data:  {
          status: newStatus,
          paidAt: newStatus === "PAID" ? new Date() : undefined,
        },
      });

      console.info(`[paynow/poll] Payment ${paymentId}: ${payment.status} → ${newStatus}`);
      return NextResponse.json({ success: true, status: newStatus, changed: true });
    }

    return NextResponse.json({ success: true, status: newStatus, changed: false });
  } catch (err) {
    console.error("[paynow/poll] Poll failed:", err);
    return NextResponse.json(
      { success: false, error: "Failed to check payment status." },
      { status: 500 }
    );
  }
}