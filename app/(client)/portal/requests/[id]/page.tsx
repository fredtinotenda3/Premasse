// app/(client)/portal/requests/[id]/page.tsx
// Client-facing request detail.
// Shows status, documents, and a sanitised audit timeline.
// Internal admin notes (adminNotes) are hidden. Only AuditLog entries
// where the note doesn't start with "[internal]" are shown to the client.

import { Metadata }  from "next";
import { notFound, redirect } from "next/navigation";
import Link          from "next/link";
import { auth }      from "@/auth";
import { prisma }    from "@/lib/prisma";
import { RequestStatus } from "@prisma/client";
import { format, formatDistanceToNow } from "date-fns";

export const metadata: Metadata = { title: "Request — Premasse Portal" };
export const dynamic = "force-dynamic";

const STATUS_CONFIG: Record<RequestStatus, { label: string; classes: string; desc: string }> = {
  PENDING:          { label: "Pending",         classes: "bg-amber-50 text-amber-800 border-amber-200",  desc: "Your request has been received and is waiting to be reviewed." },
  IN_REVIEW:        { label: "In review",        classes: "bg-blue-50 text-blue-800 border-blue-200",     desc: "A practitioner is reviewing your request." },
  IN_PROGRESS:      { label: "In progress",      classes: "bg-purple-50 text-purple-800 border-purple-200", desc: "Work on your request is underway." },
  AWAITING_DOCS:    { label: "Awaiting docs",    classes: "bg-orange-50 text-orange-800 border-orange-200", desc: "We need additional documents from you." },
  AWAITING_PAYMENT: { label: "Awaiting payment", classes: "bg-pink-50 text-pink-800 border-pink-200",    desc: "A payment request has been sent to you." },
  COMPLETED:        { label: "Completed",        classes: "bg-green-50 text-green-800 border-green-200", desc: "Your request has been completed." },
  CANCELLED:        { label: "Cancelled",        classes: "bg-gray-100 text-gray-500 border-gray-200",   desc: "This request has been cancelled." },
};

export default async function PortalRequestDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user) redirect("/portal/login");

  const request = await prisma.serviceRequest.findUnique({
    where: { id: params.id },
    include: {
      service:  { select: { name: true, category: true } },
      documents: { orderBy: { uploadedAt: "desc" } },
      auditLogs: {
        orderBy: { createdAt: "desc" },
        include: { admin: { select: { name: true } } },
      },
      payments: {
        where:   { status: "PAID" },
        orderBy: { paidAt: "desc" },
        select:  { amount: true, method: true, paidAt: true },
      },
    },
  });

  if (!request) notFound();

  // Security: client can only view their own requests
  const isOwner =
    request.userId === session.user.id ||
    request.clientEmail === session.user.email;
  if (!isOwner) notFound();

  const cfg = STATUS_CONFIG[request.status];

  // Filter audit log — hide entries whose notes start with "[internal]"
  const visibleLogs = request.auditLogs.filter(
    (log) => !log.note?.startsWith("[internal]")
  );

  const STATUS_LABELS: Record<string, string> = {
    PENDING:          "Pending",
    IN_REVIEW:        "In review",
    IN_PROGRESS:      "In progress",
    AWAITING_DOCS:    "Awaiting docs",
    AWAITING_PAYMENT: "Awaiting payment",
    COMPLETED:        "Completed",
    CANCELLED:        "Cancelled",
  };

  return (
    <div className="max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-body text-slate/40 text-xs mb-6">
        <Link href="/portal" className="hover:text-navy transition-colors">My requests</Link>
        <span>/</span>
        <span className="text-navy font-medium truncate">{request.service.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h1 className="font-display text-navy text-2xl font-semibold">
              {request.service.name}
            </h1>
            <span className={`inline-block font-body font-semibold text-xs px-2.5 py-1 rounded-sm border uppercase tracking-widest ${cfg.classes}`}>
              {cfg.label}
            </span>
          </div>
          <p className="font-body text-slate/50 text-sm">
            Submitted {format(new Date(request.createdAt), "d MMMM yyyy")}
          </p>
        </div>
      </div>

      {/* Status description */}
      <div className="bg-gray-50 border border-gray-100 rounded-sm px-4 py-3 mb-6">
        <p className="font-body text-slate text-sm">{cfg.desc}</p>
        {request.status === "AWAITING_DOCS" && (
          <p className="font-body text-orange-700 text-sm mt-1 font-medium">
            Please upload the required documents below.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Left: details + docs */}
        <div className="space-y-5">

          {/* Request details */}
          <div className="bg-white border border-gray-100 rounded-sm p-5">
            <h2 className="font-display text-navy text-base font-semibold mb-4">
              Your submission
            </h2>
            <dl className="space-y-3">
              {[
                { label: "Service",   value: request.service.name },
                { label: "Submitted", value: format(new Date(request.createdAt), "d MMM yyyy, HH:mm") },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="font-body text-slate/40 text-xs uppercase tracking-wider mb-0.5">{label}</dt>
                  <dd className="font-body text-navy text-sm">{value}</dd>
                </div>
              ))}
              {request.notes && (
                <div>
                  <dt className="font-body text-slate/40 text-xs uppercase tracking-wider mb-0.5">Your notes</dt>
                  <dd className="font-body text-slate text-sm leading-relaxed whitespace-pre-wrap">{request.notes}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Documents */}
          <div className="bg-white border border-gray-100 rounded-sm p-5">
            <h2 className="font-display text-navy text-base font-semibold mb-4">
              Documents
            </h2>
            {request.documents.length === 0 ? (
              <p className="font-body text-slate/40 text-sm italic">No documents uploaded.</p>
            ) : (
              <ul className="space-y-2">
                {request.documents.map((doc) => (
                  <li key={doc.id} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-sm bg-gray-100 flex items-center justify-center shrink-0">
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="text-slate/40">
                        <path d="M3 1h6l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V2a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2"/>
                        <path d="M9 1v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-body text-navy text-sm truncate block hover:underline underline-offset-2 decoration-gold"
                      >
                        {doc.fileName}
                      </a>
                      <p className="font-body text-slate/40 text-xs">
                        {(doc.fileSize / 1024).toFixed(0)} KB
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Payment info */}
          {request.payments.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-sm p-5">
              <h2 className="font-display text-navy text-base font-semibold mb-4">
                Payment
              </h2>
              {request.payments.map((p, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-navy text-xl font-bold">
                      ${p.amount.toFixed(2)} <span className="font-body text-slate/40 text-sm font-normal">USD</span>
                    </p>
                    <p className="font-body text-slate/50 text-xs">
                      {p.method ?? "Web"} · {p.paidAt ? format(new Date(p.paidAt), "d MMM yyyy") : ""}
                    </p>
                  </div>
                  <span className="font-body font-semibold text-xs px-2.5 py-1 rounded-sm border bg-green-50 text-green-800 border-green-200 uppercase tracking-widest">
                    Paid
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: activity timeline */}
        <div className="bg-white border border-gray-100 rounded-sm p-5">
          <h2 className="font-display text-navy text-base font-semibold mb-5">
            Activity
          </h2>

          {visibleLogs.length === 0 ? (
            <p className="font-body text-slate/40 text-sm italic">No activity yet.</p>
          ) : (
            <ol className="relative space-y-0">
              {visibleLogs.map((log, i) => {
                const isLast = i === visibleLogs.length - 1;
                return (
                  <li key={log.id} className="relative flex gap-3 pb-5">
                    {!isLast && (
                      <div className="absolute left-2.25 top-5 bottom-0 w-px bg-gray-100"/>
                    )}
                    <div className={`relative z-10 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                      i === 0 ? "bg-navy border-navy" : "bg-white border-gray-200"
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-gold" : "bg-gray-300"}`}/>
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="font-body text-navy text-sm font-medium">
                        {log.fromStatus
                          ? `${STATUS_LABELS[log.fromStatus] ?? log.fromStatus} → ${STATUS_LABELS[log.toStatus] ?? log.toStatus}`
                          : `Request ${STATUS_LABELS[log.toStatus]?.toLowerCase() ?? log.toStatus}`}
                      </p>
                      <p className="font-body text-slate/40 text-xs mt-0.5">
                        {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                      </p>
                      {log.note && !log.note.startsWith("[internal]") && (
                        <p className="font-body text-slate text-sm bg-gray-50 border border-gray-100 rounded-sm px-3 py-2 mt-2 leading-relaxed">
                          {log.note}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </div>

      {/* Contact nudge */}
      <div className="mt-6 bg-gold-pale border border-gold/20 rounded-sm p-5 flex items-center justify-between gap-4">
        <p className="font-body text-slate text-sm">
          Have a question about this request?
        </p>
        <a
          href="mailto:info@premasse.co.zw"
          className="font-body text-navy text-sm font-medium underline underline-offset-2 decoration-gold hover:decoration-2 transition-all shrink-0"
        >
          Contact us
        </a>
      </div>
    </div>
  );
}
