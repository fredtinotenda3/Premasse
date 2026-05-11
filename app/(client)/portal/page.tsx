// app/(client)/portal/page.tsx
// Premium client request dashboard.

import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { RequestStatus } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowRight,
  FileText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata =
  {
    title:
      "My requests — Premasse Portal",
  };

export const dynamic =
  "force-dynamic";

const STATUS_CONFIG: Record<
  RequestStatus,
  {
    label: string;
    classes: string;
  }
> = {
  PENDING: {
    label: "Pending",

    classes:
      "border-amber-500/20 bg-amber-500/10 text-amber-300",
  },

  IN_REVIEW: {
    label: "In review",

    classes:
      "border-blue-500/20 bg-blue-500/10 text-blue-300",
  },

  IN_PROGRESS: {
    label: "In progress",

    classes:
      "border-purple-500/20 bg-purple-500/10 text-purple-300",
  },

  AWAITING_DOCS: {
    label: "Awaiting docs",

    classes:
      "border-orange-500/20 bg-orange-500/10 text-orange-300",
  },

  AWAITING_PAYMENT: {
    label:
      "Awaiting payment",

    classes:
      "border-pink-500/20 bg-pink-500/10 text-pink-300",
  },

  COMPLETED: {
    label: "Completed",

    classes:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  },

  CANCELLED: {
    label: "Cancelled",

    classes:
      "border-white/10 bg-white/[0.04] text-white/40",
  },
};

export default async function PortalHomePage() {
  const session = await auth();

  if (!session?.user)
    redirect("/portal/login");

  // Fetch requests
  const requests =
    await prisma.serviceRequest.findMany(
      {
        where: {
          OR: [
            {
              userId:
                session.user.id,
            },

            {
              clientEmail:
                session.user.email!,
            },
          ],
        },

        orderBy: {
          createdAt: "desc",
        },

        include: {
          service: {
            select: {
              name: true,
              category: true,
            },
          },

          payments: {
            where: {
              status: "PAID",
            },

            select: {
              amount: true,
            },
          },

          _count: {
            select: {
              documents: true,
            },
          },
        },
      }
    );

  const firstName =
    session.user.name?.split(
      " "
    )[0] ?? "there";

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-10">

        <div className="inline-flex items-center gap-3 mb-6">

          <div className="flex items-center gap-2.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-5 py-2.5 backdrop-blur-md shadow-[0_10px_40px_rgba(201,168,76,0.08)]">

            <Sparkles className="w-4 h-4 text-[#C9A84C]" />

            <span className="font-body text-[#C9A84C] text-[11px] tracking-[0.24em] uppercase font-semibold">
              Client dashboard
            </span>
          </div>
        </div>

        <h1
          className="font-display text-white leading-[0.95] mb-4"
          style={{
            fontSize:
              "clamp(2.8rem, 5vw, 5rem)",

            letterSpacing:
              "-0.05em",
          }}
        >
          Welcome back,
          <br />

          <span className="text-[#C9A84C] italic">
            {firstName}
          </span>
        </h1>

        <p className="text-white/60 text-base sm:text-lg max-w-2xl leading-relaxed">
          {requests.length === 0
            ? "You haven't submitted any requests yet."
            : `${requests.length} request${
                requests.length !==
                1
                  ? "s"
                  : ""
              } currently linked to your account.`}
        </p>
      </div>

      {/* Empty State */}
      {requests.length === 0 ? (
        <div
          className="
            relative
            overflow-hidden
            rounded-[2.5rem]
            border
            border-white/10
            bg-white/[0.03]
            backdrop-blur-2xl
            p-12
            sm:p-16
            text-center
            shadow-[0_40px_120px_rgba(0,0,0,0.25)]
          "
        >

          {/* Glow */}
          <div className="absolute top-[-80px] right-[-80px] w-[240px] h-[240px] rounded-full bg-[#C9A84C]/10 blur-3xl" />

          <div className="relative">

            <div className="w-20 h-20 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center mx-auto mb-8">

              <FileText className="w-8 h-8 text-white/30" />
            </div>

            <h2 className="font-display text-white text-3xl mb-4">
              No requests yet
            </h2>

            <p className="text-white/55 text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-10">
              Start your first request and track progress, uploads, payments, and updates from your client portal.
            </p>

            <Link
              href="/portal/new"
              className="
                group
                relative
                overflow-hidden
                inline-flex
                items-center
                gap-3
                bg-[#C9A84C]
                text-[#041f19]
                font-semibold
                px-8
                py-4
                rounded-2xl
                text-sm
                tracking-[0.14em]
                uppercase
                transition-all
                duration-500
                hover:-translate-y-1
                hover:shadow-[0_20px_60px_rgba(201,168,76,0.35)]
              "
            >

              Submit request

              <ArrowRight className="w-4 h-4" />

              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Request list */}
          <div className="space-y-5">

            {requests.map((req) => {
              const cfg =
                STATUS_CONFIG[
                  req.status
                ];

              const paidAmt =
                req.payments.reduce(
                  (s, p) =>
                    s + p.amount,
                  0
                );

              return (
                <Link
                  key={req.id}
                  href={`/portal/requests/${req.id}`}
                  className="
                    group
                    relative
                    overflow-hidden
                    block
                    rounded-[2rem]
                    border
                    border-white/10
                    bg-white/[0.03]
                    backdrop-blur-xl
                    p-6
                    shadow-[0_30px_80px_rgba(0,0,0,0.18)]
                    hover:border-[#C9A84C]/20
                    hover:-translate-y-1
                    transition-all
                    duration-500
                  "
                >

                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-[#C9A84C]/5 via-transparent to-transparent" />

                  <div className="relative flex items-start justify-between gap-6">

                    <div className="flex-1 min-w-0">

                      <div className="flex items-center gap-3 flex-wrap mb-3">

                        <h2 className="text-white text-lg font-medium">
                          {
                            req.service
                              .name
                          }
                        </h2>

                        <span
                          className={`
                            inline-flex
                            items-center
                            px-3
                            py-1
                            rounded-full
                            border
                            text-[10px]
                            uppercase
                            tracking-[0.16em]
                            font-semibold
                            ${cfg.classes}
                          `}
                        >
                          {
                            cfg.label
                          }
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/45">

                        <span>
                          Submitted{" "}
                          {formatDistanceToNow(
                            new Date(
                              req.createdAt
                            ),
                            {
                              addSuffix:
                                true,
                            }
                          )}
                        </span>

                        {req._count
                          .documents >
                          0 && (
                          <span>
                            {
                              req
                                ._count
                                .documents
                            }{" "}
                            document
                            {req
                              ._count
                              .documents !==
                            1
                              ? "s"
                              : ""}
                          </span>
                        )}

                        {paidAmt >
                          0 && (
                          <span>
                            $
                            {paidAmt.toFixed(
                              2
                            )}{" "}
                            paid
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">

                      <div className="hidden sm:flex items-center gap-2 text-white/30 text-[11px] tracking-[0.14em] uppercase">

                        <ShieldCheck className="w-3.5 h-3.5 text-[#C9A84C]" />

                        View details
                      </div>

                      <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-[#C9A84C] transition-colors duration-300" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <div className="pt-10 text-center">

            <Link
              href="/portal/new"
              className="
                inline-flex
                items-center
                gap-3
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
                backdrop-blur-md
                px-8
                py-4
                text-white/70
                hover:text-white
                hover:border-[#C9A84C]/20
                transition-all
                duration-300
              "
            >

              Submit a new request

              <ArrowRight className="w-4 h-4 text-[#C9A84C]" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}