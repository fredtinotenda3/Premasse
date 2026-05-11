// app/(admin)/dashboard/page.tsx
// Premium admin dashboard home.

import Link from "next/link";
import { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

import StatusBadge from "@/components/dashboard/StatusBadge";

import { RequestStatus } from "@prisma/client";

import { formatDistanceToNow } from "date-fns";

import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata =
  {
    title:
      "Dashboard — Premasse Admin",
  };

export const revalidate = 60;

export default async function DashboardPage() {
  const session =
    await requireAdmin();

  const [
    statusCounts,
    recentRequests,
  ] = await Promise.all([
    prisma.serviceRequest.groupBy(
      {
        by: ["status"],

        _count: {
          status: true,
        },
      }
    ),

    prisma.serviceRequest.findMany(
      {
        take: 5,

        orderBy: {
          createdAt: "desc",
        },

        select: {
          id: true,
          clientName: true,
          status: true,
          createdAt: true,

          service: {
            select: {
              name: true,
            },
          },
        },
      }
    ),
  ]);

  const countMap =
    Object.fromEntries(
      statusCounts.map(
        (s) => [
          s.status,
          s._count.status,
        ]
      )
    ) as Partial<
      Record<
        RequestStatus,
        number
      >
    >;

  const total =
    statusCounts.reduce(
      (sum, s) =>
        sum + s._count.status,
      0
    );

  const STAT_CARDS = [
    {
      label:
        "Total requests",

      value: total,

      href: "/dashboard/requests",

      icon: BriefcaseBusiness,

      glow:
        "from-[#C9A84C]/20 to-transparent",
    },

    {
      label: "Pending",

      value:
        countMap[
          "PENDING"
        ] ?? 0,

      href: "/dashboard/requests?status=PENDING",

      icon: Clock3,

      glow:
        "from-amber-500/20 to-transparent",
    },

    {
      label:
        "In progress",

      value:
        countMap[
          "IN_PROGRESS"
        ] ?? 0,

      href: "/dashboard/requests?status=IN_PROGRESS",

      icon: Sparkles,

      glow:
        "from-purple-500/20 to-transparent",
    },

    {
      label: "Completed",

      value:
        countMap[
          "COMPLETED"
        ] ?? 0,

      href: "/dashboard/requests?status=COMPLETED",

      icon:
        CheckCircle2,

      glow:
        "from-emerald-500/20 to-transparent",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-10">

        <div className="inline-flex items-center gap-3 mb-6">

          <div className="flex items-center gap-2.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-5 py-2.5 backdrop-blur-md shadow-[0_10px_40px_rgba(201,168,76,0.08)]">

            <Sparkles className="w-4 h-4 text-[#C9A84C]" />

            <span className="font-body text-[#C9A84C] text-[11px] tracking-[0.24em] uppercase font-semibold">
              Admin dashboard
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
          Good{" "}
          {getTimeOfDay()},
          <br />

          <span className="text-[#C9A84C] italic">
            {session.user.name?.split(
              " "
            )[0] ?? "Admin"}
          </span>
        </h1>

        <p className="text-white/60 text-base sm:text-lg max-w-2xl leading-relaxed">
          Here&apos;s what&apos;s happening across Premasse client requests and operations.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">

        {STAT_CARDS.map(
          ({
            label,
            value,
            href,
            icon: Icon,
            glow,
          }) => (
            <Link
              key={label}
              href={href}
              className="
                group
                relative
                overflow-hidden
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

              {/* Glow */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${glow}`}
              />

              <div className="relative">

                <div className="flex items-start justify-between mb-8">

                  <div
                    className="
                      w-14
                      h-14
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/[0.04]
                      flex
                      items-center
                      justify-center
                    "
                  >

                    <Icon className="w-6 h-6 text-[#C9A84C]" />
                  </div>

                  <ArrowRight className="w-5 h-5 text-white/25 group-hover:text-[#C9A84C] transition-colors duration-300" />
                </div>

                <p className="font-display text-white text-5xl leading-none mb-3">
                  {value}
                </p>

                <p className="text-white/50 text-sm">
                  {label}
                </p>
              </div>
            </Link>
          )
        )}
      </div>

      {/* Recent requests */}
      <section
        className="
          relative
          overflow-hidden
          rounded-[2.5rem]
          border
          border-white/10
          bg-white/[0.03]
          backdrop-blur-2xl
          shadow-[0_40px_120px_rgba(0,0,0,0.22)]
        "
      >

        {/* Glow */}
        <div className="absolute top-[-100px] right-[-100px] w-[260px] h-[260px] rounded-full bg-[#C9A84C]/10 blur-3xl" />

        <div className="relative">

          {/* Header */}
          <div className="flex items-center justify-between px-6 sm:px-8 py-6 border-b border-white/10">

            <div>

              <div className="flex items-center gap-3 mb-2">
                <div className="h-px w-10 bg-[#C9A84C]" />

                <span className="text-[#C9A84C] text-xs tracking-[0.22em] uppercase font-semibold">
                  Activity
                </span>
              </div>

              <h2 className="font-display text-white text-2xl">
                Recent requests
              </h2>
            </div>

            <Link
              href="/dashboard/requests"
              className="
                hidden
                sm:inline-flex
                items-center
                gap-2
                text-white/45
                hover:text-white
                transition-colors
                duration-300
                text-sm
              "
            >

              View all

              <ArrowRight className="w-4 h-4 text-[#C9A84C]" />
            </Link>
          </div>

          {/* Content */}
          {recentRequests.length ===
          0 ? (
            <div className="px-8 py-20 text-center">

              <div className="w-20 h-20 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center mx-auto mb-8">

                <BriefcaseBusiness className="w-8 h-8 text-white/30" />
              </div>

              <h3 className="font-display text-white text-3xl mb-4">
                No requests yet
              </h3>

              <p className="text-white/45 text-sm max-w-md mx-auto leading-relaxed">
                Client requests will appear here once submissions start coming in.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-white/5">

              {recentRequests.map(
                (req) => (
                  <li
                    key={req.id}
                  >

                    <Link
                      href={`/dashboard/requests/${req.id}`}
                      className="
                        group
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        justify-between
                        gap-5
                        px-6
                        sm:px-8
                        py-6
                        hover:bg-white/[0.02]
                        transition-colors
                        duration-300
                      "
                    >

                      <div className="flex-1 min-w-0">

                        <div className="flex items-center gap-3 flex-wrap mb-2">

                          <p className="text-white text-base font-medium truncate">
                            {
                              req.clientName
                            }
                          </p>

                          <StatusBadge
                            status={
                              req.status
                            }
                            size="sm"
                          />
                        </div>

                        <p className="text-white/45 text-sm leading-relaxed">

                          {
                            req
                              .service
                              .name
                          }{" "}
                          ·{" "}
                          {formatDistanceToNow(
                            new Date(
                              req.createdAt
                            ),
                            {
                              addSuffix:
                                true,
                            }
                          )}
                        </p>
                      </div>

                      <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-[#C9A84C] transition-colors duration-300 shrink-0" />
                    </Link>
                  </li>
                )
              )}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function getTimeOfDay(): string {
  const h =
    new Date().getHours();

  if (h < 12)
    return "morning";

  if (h < 17)
    return "afternoon";

  return "evening";
}