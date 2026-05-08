// app/(admin)/dashboard/requests/[id]/page.tsx

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { RequestStatus } from "@prisma/client";
import StatusBadge from "@/components/dashboard/StatusBadge";
import AuditTimeline from "@/components/dashboard/AuditTimeline";
import { updateRequestStatus } from "./actions";
import { format } from "date-fns";
import RequestDocuments from "@/components/dashboard/RequestDocuments";
import InvoiceButton from "@/components/dashboard/InvoiceButton";
import PaymentPanel from "@/components/dashboard/PaymentPanel";

export const metadata: Metadata = { title: "Request detail — Admin" };
export const dynamic = "force-dynamic";

const ALL_STATUSES = Object.values(RequestStatus);

const STATUS_LABELS: Record<RequestStatus, string> = {
  PENDING:          "Pending",
  IN_REVIEW:        "In review",
  IN_PROGRESS:      "In progress",
  AWAITING_DOCS:    "Awaiting docs",
  AWAITING_PAYMENT: "Awaiting payment",
  COMPLETED:        "Completed",
  CANCELLED:        "Cancelled",
};

export default async function RequestDetailPage({
  params,
  searchParams,
}: {
  params:       Promise<{ id: string }>;
  searchParams: Promise<{ updated?: string }>;
}) {
  await requireAdmin();

  const { id }      = await params;
  const { updated } = await searchParams;

  const request = await prisma.serviceRequest.findUnique({
    where: { id },
    include: {
      service: {
        select: { name: true, category: true, slug: true },
      },
      documents: {
        orderBy: { uploadedAt: "desc" },
      },
      auditLogs: {
        orderBy: { createdAt: "desc" },
        include: {
          admin: { select: { name: true, email: true } },
        },
      },
      payments: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!request) notFound();

  const wasJustUpdated = updated === "1";

  // Get the most recent payment (if any) for the PaymentPanel
  const latestPayment = request.payments.length > 0 ? request.payments[0] : null;

  // Format latest payment for PaymentPanel component
  const existingPayment = latestPayment ? {
    id: latestPayment.id,
    amount: latestPayment.amount,
    status: latestPayment.status,
    method: latestPayment.method,
    redirectUrl: latestPayment.redirectUrl,
    createdAt: latestPayment.createdAt.toISOString(),
    paidAt: latestPayment.paidAt?.toISOString() ?? null,
  } : null;

  // Check if request is in a terminal state (can't create new payments)
  const isTerminalState = ["COMPLETED", "CANCELLED"].includes(request.status);
  const canCreatePayment = !isTerminalState && request.status !== "AWAITING_PAYMENT";

  return (
    <div className="max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-body text-slate/50 text-xs mb-6">
        <Link href="/dashboard/requests" className="hover:text-green-dark transition-colors">
          Requests
        </Link>
        <span>/</span>
        <span className="text-green-dark font-medium truncate max-w-50">
          {request.clientName}
        </span>
      </div>

      {/* Success toast */}
      {wasJustUpdated && (
        <div className="bg-green-50 border border-green-200 rounded-sm px-4 py-3 mb-6 flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-green-600 shrink-0">
            <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="font-body text-green-800 text-sm">Status updated successfully.</p>
        </div>
      )}

      {/* Page header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-display text-green-dark text-2xl font-semibold">
              {request.clientName}
            </h1>
            <StatusBadge status={request.status} />
          </div>
          <p className="font-body text-slate/60 text-sm">
            {request.service.name} ·{" "}
            Submitted {format(new Date(request.createdAt), "d MMM yyyy, HH:mm")}
          </p>
        </div>
        <p className="font-mono text-slate/30 text-xs hidden lg:block shrink-0">
          {request.id}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Client details */}
          <div className="bg-white border border-gray-100 rounded-sm p-6">
            <h2 className="font-display text-green-dark text-base font-semibold mb-5">
              Client details
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Full name",    value: request.clientName },
                { label: "Email",        value: request.clientEmail },
                { label: "Phone",        value: request.clientPhone ?? "—" },
                { label: "Service",      value: request.service.name },
                { label: "Category",     value: request.service.category.replace(/_/g, " ") },
                { label: "Last updated", value: format(new Date(request.updatedAt), "d MMM yyyy, HH:mm") },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="font-body text-slate/50 text-xs uppercase tracking-wider mb-0.5">
                    {label}
                  </dt>
                  <dd className="font-body text-green-dark text-sm">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Client notes */}
          <div className="bg-white border border-gray-100 rounded-sm p-6">
            <h2 className="font-display text-green-dark text-base font-semibold mb-4">
              Client notes
            </h2>
            <p className="font-body text-slate text-sm leading-relaxed whitespace-pre-wrap">
              {request.notes ?? (
                <span className="text-slate/40 italic">No notes provided.</span>
              )}
            </p>
          </div>

          {/* Documents */}
          <RequestDocuments
            requestId={request.id}
            initialDocuments={request.documents}
          />

        </div>

        {/* Right column */}
        <div className="space-y-6">

          {/* Status update form */}
          <div className="bg-white border border-gray-100 rounded-sm p-6">
            <h2 className="font-display text-green-dark text-base font-semibold mb-5">
              Update status
            </h2>

            <form action={updateRequestStatus} className="space-y-4">
              <input type="hidden" name="requestId" value={request.id} />

              <div className="flex flex-col gap-1.5">
                <label htmlFor="newStatus" className="font-body text-green-dark text-sm font-medium">
                  New status
                </label>
                <select
                  id="newStatus"
                  name="newStatus"
                  defaultValue={request.status}
                  className="font-body text-green-dark text-sm w-full bg-white border border-gray-200 rounded-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-colors"
                >
                  {ALL_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="note" className="font-body text-green-dark text-sm font-medium">
                  Internal note{" "}
                  <span className="text-slate/40 font-normal">(optional)</span>
                </label>
                <textarea
                  id="note"
                  name="note"
                  rows={3}
                  placeholder="e.g. Called client, waiting for ID documents…"
                  className="font-body text-green-dark text-sm w-full bg-white border border-gray-200 rounded-sm px-3 py-2.5 resize-none placeholder:text-slate/30 focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-colors"
                />
              </div>

              <button
                type="submit"
                className="btn-gold w-full font-body font-semibold text-green-dark px-4 py-3 rounded-sm text-sm tracking-wide"
              >
                Save status
              </button>
            </form>
          </div>

          {/* PAYMENT PANEL - Initiate payments */}
          {!isTerminalState && (
            <PaymentPanel
              requestId={request.id}
              existingPayment={existingPayment}
            />
          )}

          {/* Terminal state message */}
          {isTerminalState && (
            <div className="bg-gray-50 border border-gray-200 rounded-sm p-6">
              <h2 className="font-display text-green-dark text-base font-semibold mb-3">
                Payments
              </h2>
              <p className="font-body text-slate/50 text-sm">
                This request is {request.status.toLowerCase()}. 
                {request.status === "COMPLETED" 
                  ? " No further payments can be initiated." 
                  : " Payment cannot be initiated for cancelled requests."}
              </p>
              {request.payments.filter(p => p.status === "PAID").length > 0 && (
                <div className="mt-4">
                  <p className="font-body text-slate/60 text-sm mb-2">Paid invoices:</p>
                  {request.payments.filter(p => p.status === "PAID").map(p => (
                    <InvoiceButton
                      key={p.id}
                      paymentId={p.id}
                      clientName={request.clientName}
                      amount={p.amount}
                      status={p.status}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Audit timeline */}
          <div className="bg-white border border-gray-100 rounded-sm p-6">
            <h2 className="font-display text-green-dark text-base font-semibold mb-5">
              Activity
            </h2>
            <AuditTimeline entries={request.auditLogs} />
          </div>

          {/* Payment history section */}
          {request.payments.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-sm p-6">
              <h2 className="font-display text-green-dark text-base font-semibold mb-5">
                Payment history
              </h2>
              <div className="space-y-3">
                {request.payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-sm"
                  >
                    <div>
                      <p className="font-body text-green-dark text-sm font-medium">
                        ${payment.amount.toFixed(2)} USD
                      </p>
                      <p className="font-body text-slate/40 text-xs">
                        {payment.method ? `${payment.method} · ` : ""}
                        {format(new Date(payment.createdAt), "d MMM yyyy, HH:mm")}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block font-body font-semibold text-[10px] px-2 py-1 rounded-sm border uppercase tracking-widest ${
                        payment.status === "PAID" ? "bg-green-50 text-green-800 border-green-200" :
                        payment.status === "AWAITING_PAYMENT" ? "bg-amber-50 text-amber-800 border-amber-200" :
                        payment.status === "FAILED" ? "bg-red-50 text-red-700 border-red-200" :
                        "bg-gray-100 text-gray-500 border-gray-200"
                      }`}>
                        {payment.status === "AWAITING_PAYMENT" ? "Pending" :
                         payment.status === "PAID" ? "Paid" :
                         payment.status === "FAILED" ? "Failed" : "Cancelled"}
                      </span>
                      {payment.status === "PAID" && (
                        <div className="mt-2">
                          <InvoiceButton
                            paymentId={payment.id}
                            clientName={request.clientName}
                            amount={payment.amount}
                            status={payment.status}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}