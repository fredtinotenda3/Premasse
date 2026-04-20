// app/api/invoice/[id]/route.ts
// GET /api/invoice/:paymentId — generates and streams a PDF invoice.
// Admin-only. Clients can view their own via /api/invoice/:paymentId?client=1
// with their session token.
//
// Usage:
//   Admin: GET /api/invoice/clxabc123
//   Client: GET /api/invoice/clxabc123 (authenticated as the request owner)

import { NextRequest, NextResponse }  from "next/server";
import { auth }                       from "@/auth";
import { prisma }                     from "@/lib/prisma";
import { generateInvoicePDF, buildInvoiceData } from "@/lib/invoice";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }

  const { id: paymentId } = await params;

  // Load the payment to validate ownership
  const payment = await prisma.payment.findUnique({
    where:  { id: paymentId },
    select: {
      id:        true,
      status:    true,
      requestId: true,
      request:   { select: { clientEmail: true, userId: true } },
    },
  });

  if (!payment) {
    return NextResponse.json({ error: "Payment not found." }, { status: 404 });
  }

  // Auth check: admin can download any invoice; client can only download their own
  const isAdmin  = session.user.role === "ADMIN";
  const isOwner  =
    payment.request.userId === session.user.id ||
    payment.request.clientEmail === session.user.email;

  if (!isAdmin && !isOwner) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 403 });
  }

  if (payment.status !== "PAID") {
    return NextResponse.json(
      { error: "Invoice is only available for paid payments." },
      { status: 400 }
    );
  }

  // Build invoice data
  const invoiceData = await buildInvoiceData(payment.requestId, paymentId, prisma);
  if (!invoiceData) {
    return NextResponse.json({ error: "Could not build invoice data." }, { status: 500 });
  }

  // Generate PDF
  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await generateInvoicePDF(invoiceData);
  } catch (err) {
    console.error("[api/invoice] PDF generation failed:", err);
    return NextResponse.json({ error: "Failed to generate invoice." }, { status: 500 });
  }

  const filename = `Invoice-${invoiceData.invoiceNumber}-${invoiceData.clientName.replace(/\s+/g, "-")}.pdf`;

  console.info(`[api/invoice] Generated: ${filename} (payment ${paymentId})`);

  return new NextResponse(pdfBuffer, {
    status:  200,
    headers: {
      "Content-Type":        "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length":      String(pdfBuffer.length),
      "Cache-Control":       "no-store",
    },
  });
}