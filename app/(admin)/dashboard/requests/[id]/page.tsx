// app/(admin)/dashboard/requests/[id]/page.tsx

import { Metadata } from "next";
import {
  notFound,
} from "next/navigation";

import Link from "next/link";

import {
  prisma,
} from "@/lib/prisma";

import {
  requireAdmin,
} from "@/lib/auth-helpers";

import {
  RequestStatus,
} from "@prisma/client";

import {
  format,
} from "date-fns";

import {
  ArrowLeft,
  Clock3,
  CreditCard,
  FileText,
  Sparkles,
  User2,
} from "lucide-react";

import StatusBadge from "@/components/dashboard/StatusBadge";
import AuditTimeline from "@/components/dashboard/AuditTimeline";
import RequestDocuments from "@/components/dashboard/RequestDocuments";
import InvoiceButton from "@/components/dashboard/InvoiceButton";
import PaymentPanel from "@/components/dashboard/PaymentPanel";

import {
  updateRequestStatus,
} from "./actions";

export const metadata: Metadata =
  {
    title:
      "Request detail — Admin",
  };

export const dynamic =
  "force-dynamic";

// ─────────────────────────────────────────────────────────────
// Status labels
// ─────────────────────────────────────────────────────────────

const ALL_STATUSES =
  Object.values(
    RequestStatus
  );

const STATUS_LABELS: Record<
  RequestStatus,
  string
> = {
  PENDING:
    "Pending",

  IN_REVIEW:
    "In review",

  IN_PROGRESS:
    "In progress",

  AWAITING_DOCS:
    "Awaiting docs",

  AWAITING_PAYMENT:
    "Awaiting payment",

  COMPLETED:
    "Completed",

  CANCELLED:
    "Cancelled",
};

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────

export default async function RequestDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    updated?: string;
  }>;
}) {
  await requireAdmin();

  const { id } =
    await params;

  const {
    updated,
  } =
    await searchParams;

  const request =
    await prisma.serviceRequest.findUnique(
      {
        where: {
          id,
        },

        include: {
          service: {
            select: {
              name: true,
              category: true,
              slug: true,
            },
          },

          documents: {
            orderBy: {
              uploadedAt:
                "desc",
            },
          },

          auditLogs: {
            orderBy: {
              createdAt:
                "desc",
            },

            include: {
              admin: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },

          payments: {
            orderBy: {
              createdAt:
                "desc",
            },
          },
        },
      }
    );

  if (!request)
    notFound();

  const wasJustUpdated =
    updated === "1";

  // ───────────────────────────────────────────────────────────
  // Payments
  // ───────────────────────────────────────────────────────────

  const latestPayment =
    request.payments
      .length > 0
      ? request
          .payments[0]
      : null;

  const existingPayment =
    latestPayment
      ? {
          id: latestPayment.id,

          amount:
            latestPayment.amount,

          status:
            latestPayment.status,

          method:
            latestPayment.method,

          redirectUrl:
            latestPayment.redirectUrl,

          createdAt:
            latestPayment.createdAt.toISOString(),

          paidAt:
            latestPayment.paidAt?.toISOString() ??
            null,
        }
      : null;

  const isTerminalState =
    [
      "COMPLETED",
      "CANCELLED",
    ].includes(
      request.status
    );

  // ───────────────────────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────────────────────

  return (
    <div className="max-w-7xl mx-auto">

      {/* Breadcrumb */}
      <div className="flex items-center gap-3 mb-8">

        <Link
          href="/dashboard/requests"
          className="
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-white/10
            bg-white/[0.03]
            px-4
            py-2
            text-white/55
            hover:text-white
            hover:border-white/20
            transition-all
            duration-300
          "
        >

          <ArrowLeft className="w-4 h-4" />

          <span className="text-xs uppercase tracking-[0.16em] font-medium">
            Back
          </span>
        </Link>

        <div className="h-px flex-1 bg-white/5" />
      </div>

      {/* Success */}
      {wasJustUpdated && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 mb-8 flex items-center gap-3">

          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="text-emerald-300 shrink-0"
          >
            <path
              d="M3 8l3 3 7-7"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <p className="text-emerald-200 text-sm">
            Request updated
            successfully.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="mb-10">

        <div className="inline-flex items-center gap-3 mb-6">

          <div className="flex items-center gap-2.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-5 py-2.5 backdrop-blur-md">

            <Sparkles className="w-4 h-4 text-[#C9A84C]" />

            <span className="text-[#C9A84C] text-[11px] tracking-[0.24em] uppercase font-semibold">
              Request detail
            </span>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">

          <div>

            <div className="flex flex-wrap items-center gap-4 mb-5">

              <h1
                className="font-display text-white leading-[0.95]"
                style={{
                  fontSize:
                    "clamp(2.5rem, 5vw, 4.8rem)",

                  letterSpacing:
                    "-0.05em",
                }}
              >
                {
                  request.clientName
                }
              </h1>

              <StatusBadge
                status={
                  request.status
                }
              />
            </div>

            <p className="text-white/60 text-base leading-relaxed max-w-3xl">
              {
                request
                  .service
                  .name
              }{" "}
              · Submitted{" "}
              {format(
                new Date(
                  request.createdAt
                ),
                "d MMM yyyy, HH:mm"
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl px-5 py-4">

            <p className="text-white/30 text-[10px] uppercase tracking-[0.18em] mb-2">
              Request ID
            </p>

            <p className="font-mono text-white/70 text-xs break-all max-w-[260px]">
              {request.id}
            </p>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left */}
        <div className="xl:col-span-2 space-y-6">

          {/* Client */}
          <GlassCard
            title="Client details"
            icon={User2}
          >

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              {[
                {
                  label:
                    "Full name",

                  value:
                    request.clientName,
                },

                {
                  label:
                    "Email",

                  value:
                    request.clientEmail,
                },

                {
                  label:
                    "Phone",

                  value:
                    request.clientPhone ??
                    "—",
                },

                {
                  label:
                    "Service",

                  value:
                    request
                      .service
                      .name,
                },

                {
                  label:
                    "Category",

                  value:
                    request.service.category.replace(
                      /_/g,
                      " "
                    ),
                },

                {
                  label:
                    "Last updated",

                  value:
                    format(
                      new Date(
                        request.updatedAt
                      ),
                      "d MMM yyyy, HH:mm"
                    ),
                },
              ].map(
                ({
                  label,
                  value,
                }) => (
                  <div
                    key={
                      label
                    }
                  >

                    <dt className="text-white/30 text-[10px] uppercase tracking-[0.18em] mb-2">
                      {label}
                    </dt>

                    <dd className="text-white text-sm leading-relaxed">
                      {value}
                    </dd>
                  </div>
                )
              )}
            </dl>
          </GlassCard>

          {/* Notes */}
          <GlassCard
            title="Client notes"
            icon={FileText}
          >

            <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
              {request.notes ?? (
                <span className="text-white/30 italic">
                  No notes
                  provided.
                </span>
              )}
            </p>
          </GlassCard>

          {/* Docs */}
          <RequestDocuments
            requestId={
              request.id
            }
            initialDocuments={
              request.documents
            }
          />
        </div>

        {/* Right */}
        <div className="space-y-6">

          {/* Status */}
          <GlassCard
            title="Update status"
            icon={Clock3}
          >

            <form
              action={
                updateRequestStatus
              }
              className="space-y-5"
            >

              <input
                type="hidden"
                name="requestId"
                value={
                  request.id
                }
              />

              {/* Select */}
              <div className="flex flex-col gap-2">

                <label
                  htmlFor="newStatus"
                  className="text-white text-sm font-medium"
                >
                  New status
                </label>

                <select
                  id="newStatus"
                  name="newStatus"
                  defaultValue={
                    request.status
                  }
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.03]
                    px-4
                    py-3
                    text-white
                    text-sm
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[#C9A84C]/20
                    focus:border-[#C9A84C]/30
                    transition-all
                  "
                >

                  {ALL_STATUSES.map(
                    (
                      s
                    ) => (
                      <option
                        key={
                          s
                        }
                        value={
                          s
                        }
                        className="bg-[#041f19]"
                      >
                        {
                          STATUS_LABELS[
                            s
                          ]
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Note */}
              <div className="flex flex-col gap-2">

                <label
                  htmlFor="note"
                  className="text-white text-sm font-medium"
                >
                  Internal note
                </label>

                <textarea
                  id="note"
                  name="note"
                  rows={4}
                  placeholder="e.g. Waiting for company registration documents..."
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.03]
                    px-4
                    py-3
                    text-white
                    text-sm
                    resize-none
                    placeholder:text-white/25
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[#C9A84C]/20
                    focus:border-[#C9A84C]/30
                    transition-all
                  "
                />
              </div>

              <button
                type="submit"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-[#C9A84C]/20
                  bg-[#C9A84C]/10
                  px-5
                  py-4
                  text-[#C9A84C]
                  text-sm
                  font-semibold
                  tracking-[0.14em]
                  uppercase
                  hover:bg-[#C9A84C]/15
                  transition-all
                  duration-300
                "
              >
                Save status
              </button>
            </form>
          </GlassCard>

          {/* Payments */}
          {!isTerminalState && (
            <PaymentPanel
              requestId={
                request.id
              }
              existingPayment={
                existingPayment
              }
            />
          )}

          {/* Terminal */}
          {isTerminalState && (
            <GlassCard
              title="Payments"
              icon={
                CreditCard
              }
            >

              <p className="text-white/55 text-sm leading-relaxed">
                This request is{" "}
                {request.status.toLowerCase()}
                .
              </p>

              {request.payments.filter(
                (
                  p
                ) =>
                  p.status ===
                  "PAID"
              ).length >
                0 && (
                <div className="mt-5 space-y-3">

                  {request.payments
                    .filter(
                      (
                        p
                      ) =>
                        p.status ===
                        "PAID"
                    )
                    .map(
                      (
                        p
                      ) => (
                        <InvoiceButton
                          key={
                            p.id
                          }
                          paymentId={
                            p.id
                          }
                          clientName={
                            request.clientName
                          }
                          amount={
                            p.amount
                          }
                          status={
                            p.status
                          }
                        />
                      )
                    )}
                </div>
              )}
            </GlassCard>
          )}

          {/* Activity */}
          <GlassCard
            title="Activity"
            icon={Clock3}
          >

            <AuditTimeline
              entries={
                request.auditLogs
              }
            />
          </GlassCard>

          {/* History */}
          {request.payments
            .length > 0 && (
            <GlassCard
              title="Payment history"
              icon={
                CreditCard
              }
            >

              <div className="space-y-4">

                {request.payments.map(
                  (
                    payment
                  ) => (
                    <div
                      key={
                        payment.id
                      }
                      className="
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/[0.03]
                        p-4
                      "
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <p className="text-white text-sm font-medium mb-1">
                            $
                            {payment.amount.toFixed(
                              2
                            )}{" "}
                            USD
                          </p>

                          <p className="text-white/35 text-xs">
                            {payment.method
                              ? `${payment.method} · `
                              : ""}
                            {format(
                              new Date(
                                payment.createdAt
                              ),
                              "d MMM yyyy, HH:mm"
                            )}
                          </p>
                        </div>

                        <StatusBadge
                          status={
                            payment.status ===
                            "FAILED"
                              ? "CANCELLED"
                              : payment.status ===
                                  "AWAITING_PAYMENT"
                                ? "PENDING"
                                : payment.status
                          }
                          size="sm"
                        />
                      </div>

                      {payment.status ===
                        "PAID" && (
                        <div className="mt-4">

                          <InvoiceButton
                            paymentId={
                              payment.id
                            }
                            clientName={
                              request.clientName
                            }
                            amount={
                              payment.amount
                            }
                            status={
                              payment.status
                            }
                          />
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Glass card
// ─────────────────────────────────────────────────────────────

function GlassCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;

  icon: React.ElementType;

  children: React.ReactNode;
}) {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[2.5rem]
        border
        border-white/10
        bg-white/[0.03]
        backdrop-blur-2xl
        p-6
        shadow-[0_40px_120px_rgba(0,0,0,0.22)]
      "
    >

      <div className="absolute top-[-80px] right-[-80px] w-[220px] h-[220px] rounded-full bg-[#C9A84C]/10 blur-3xl" />

      <div className="relative">

        <div className="flex items-center gap-3 mb-6">

          <div className="w-11 h-11 rounded-2xl border border-white/10 bg-white/[0.04] flex items-center justify-center">

            <Icon className="w-5 h-5 text-[#C9A84C]" />
          </div>

          <h2 className="font-display text-white text-xl">
            {title}
          </h2>
        </div>

        {children}
      </div>
    </div>
  );
}