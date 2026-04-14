// app/(client)/portal/page.tsx
// Client's request list — shows all requests linked to their account,
// plus any anonymous requests matched by email.

import { Metadata }   from "next";
import Link           from "next/link";
import { redirect }   from "next/navigation";
import { auth }       from "@/auth";
import { prisma }     from "@/lib/prisma";
import { RequestStatus } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";

export const metadata: Metadata = { title: "My requests — Premasse Portal" };
export const dynamic = "force-dynamic";

const STATUS_CONFIG: Record<RequestStatus, { label: string; classes: string }> = {
  PENDING:          { label: "Pending",          classes: "bg-amber-50 text-amber-800 border-amber-200" },
  IN_REVIEW:        { label: "In review",         classes: "bg-blue-50 text-blue-800 border-blue-200" },
  IN_PROGRESS:      { label: "In progress",       classes: "bg-purple-50 text-purple-800 border-purple-200" },
  AWAITING_DOCS:    { label: "Awaiting docs",     classes: "bg-orange-50 text-orange-800 border-orange-200" },
  AWAITING_PAYMENT: { label: "Awaiting payment",  classes: "bg-pink-50 text-pink-800 border-pink-200" },
  COMPLETED:        { label: "Completed",         classes: "bg-green-50 text-green-800 border-green-200" },
  CANCELLED:        { label: "Cancelled",         classes: "bg-gray-100 text-gray-500 border-gray-200" },
};

export default async function PortalHomePage() {
  const session = await auth();
  if (!session?.user) redirect("/portal/login");

  // Fetch requests for this client — by userId OR by email (catches anonymous)
  const requests = await prisma.serviceRequest.findMany({
    where: {
      OR: [
        { userId: session.user.id },
        { clientEmail: session.user.email! },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: {
      service:  { select: { name: true, category: true } },
      payments: { where: { status: "PAID" }, select: { amount: true } },
      _count:   { select: { documents: true } },
    },
  });

  const firstName = session.user.name?.split(" ")[0] ?? "there";

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-navy text-2xl font-semibold mb-1">
          Welcome back, {firstName}
        </h1>
        <p className="font-body text-slate/60 text-sm">
          {requests.length === 0
            ? "You haven't submitted any requests yet."
            : `${requests.length} request${requests.length !== 1 ? "s" : ""} on file.`}
        </p>
      </div>

      {/* Empty state */}
      {requests.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-sm p-16 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-slate/30">
              <rect x="3" y="3" width="14" height="4" rx="1" stroke="currentColor" strokeWidth="1.3"/>
              <rect x="3" y="9" width="14" height="4" rx="1" stroke="currentColor" strokeWidth="1.3"/>
              <rect x="3" y="15" width="8"  height="2" rx="1" stroke="currentColor" strokeWidth="1.3"/>
            </svg>
          </div>
          <p className="font-body text-slate/50 text-sm mb-6">
            No requests yet. Get started by submitting your first service request.
          </p>
          <Link
            href="/portal/new"
            className="btn-gold font-body font-semibold text-navy px-6 py-2.5 rounded-sm text-sm"
          >
            Submit a request
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => {
            const cfg     = STATUS_CONFIG[req.status];
            const paidAmt = req.payments.reduce((s, p) => s + p.amount, 0);

            return (
              <Link
                key={req.id}
                href={`/portal/requests/${req.id}`}
                className="block bg-white border border-gray-100 rounded-sm p-5 hover:border-gray-200 hover:shadow-sm transition-all duration-150"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h2 className="font-body text-navy text-sm font-medium">
                        {req.service.name}
                      </h2>
                      <span className={`inline-block font-body font-semibold text-[10px] px-2 py-0.5 rounded-sm border uppercase tracking-[0.12em] ${cfg.classes}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="font-body text-slate/50 text-xs">
                      Submitted {formatDistanceToNow(new Date(req.createdAt), { addSuffix: true })}
                      {req._count.documents > 0 && (
                        <> · {req._count.documents} document{req._count.documents !== 1 ? "s" : ""}</>
                      )}
                      {paidAmt > 0 && (
                        <> · ${paidAmt.toFixed(2)} paid</>
                      )}
                    </p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-slate/25 shrink-0 mt-0.5">
                    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </Link>
            );
          })}

          <div className="pt-2 text-center">
            <Link
              href="/portal/new"
              className="font-body text-navy border border-navy/20 hover:border-navy/50 px-6 py-2.5 rounded-sm text-sm transition-colors inline-block"
            >
              Submit a new request
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
