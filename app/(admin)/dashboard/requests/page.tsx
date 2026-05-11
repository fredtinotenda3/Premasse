// app/(admin)/dashboard/requests/page.tsx
// Premium cinematic requests dashboard.

import { Metadata } from "next";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

import StatusBadge from "@/components/dashboard/StatusBadge";

import { RequestStatus } from "@prisma/client";

import { formatDistanceToNow } from "date-fns";

import {
  ArrowRight,
  BriefcaseBusiness,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata =
  {
    title:
      "Requests — Premasse Admin",
  };

export const revalidate = 30;

const ALL_STATUSES =
  Object.values(
    RequestStatus
  );

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
  }>;
}) {
  await requireAdmin();

  const params =
    await searchParams;

  const activeStatus =
    params.status &&
    ALL_STATUSES.includes(
      params.status as RequestStatus
    )
      ? (params.status as RequestStatus)
      : null;

  const [
    requests,
    statusCounts,
  ] = await Promise.all([
    prisma.serviceRequest.findMany(
      {
        where:
          activeStatus
            ? {
                status:
                  activeStatus,
              }
            : undefined,

        orderBy: {
          createdAt:
            "desc",
        },

        select: {
          id: true,
          clientName: true,
          clientEmail: true,
          status: true,
          createdAt: true,
          updatedAt: true,

          service: {
            select: {
              name: true,
              category: true,
            },
          },
        },
      }
    ),

    prisma.serviceRequest.groupBy(
      {
        by: ["status"],

        _count: {
          status: true,
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
    ) as Record<
      RequestStatus,
      number
    >;

  const totalCount =
    statusCounts.reduce(
      (sum, s) =>
        sum +
        s._count.status,
      0
    );

  return (
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-10">

        <div className="inline-flex items-center gap-3 mb-6">

          <div className="flex items-center gap-2.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-5 py-2.5 backdrop-blur-md shadow-[0_10px_40px_rgba(201,168,76,0.08)]">

            <Sparkles className="w-4 h-4 text-[#C9A84C]" />

            <span className="font-body text-[#C9A84C] text-[11px] tracking-[0.24em] uppercase font-semibold">
              Request management
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
          Service
          <br />

          <span className="text-[#C9A84C] italic">
            requests.
          </span>
        </h1>

        <p className="text-white/60 text-base sm:text-lg max-w-2xl leading-relaxed">
          {totalCount} total
          request
          {totalCount !== 1
            ? "s"
            : ""}{" "}
          across all client
          submissions.
        </p>
      </div>

      {/* Filters */}
      <div className="overflow-x-auto pb-2 mb-8">

        <div className="flex gap-3 min-w-max">

          <FilterPill
            href="/dashboard/requests"
            active={!activeStatus}
            label={`All (${totalCount})`}
          />

          {ALL_STATUSES.map(
            (status) => (
              <FilterPill
                key={status}
                href={`/dashboard/requests?status=${status}`}
                active={
                  activeStatus ===
                  status
                }
                label={`${formatStatus(
                  status
                )} (${
                  countMap[
                    status
                  ] ?? 0
                })`}
              />
            )
          )}
        </div>
      </div>

      {/* Empty state */}
      {requests.length ===
      0 ? (
        <div
          className="
            relative
            overflow-hidden
            rounded-[2.5rem]
            border
            border-white/10
            bg-white/[0.03]
            backdrop-blur-2xl
            p-16
            text-center
            shadow-[0_40px_120px_rgba(0,0,0,0.22)]
          "
        >

          <div className="absolute top-[-100px] right-[-100px] w-[260px] h-[260px] rounded-full bg-[#C9A84C]/10 blur-3xl" />

          <div className="relative">

            <div className="w-20 h-20 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center mx-auto mb-8">

              <BriefcaseBusiness className="w-8 h-8 text-white/30" />
            </div>

            <h2 className="font-display text-white text-3xl mb-4">
              No requests found
            </h2>

            <p className="text-white/45 text-sm max-w-md mx-auto leading-relaxed">
              No client requests
              match the selected
              filter.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* MOBILE */}
          <div className="block lg:hidden space-y-5">

            {requests.map(
              (req) => (
                <Link
                  key={req.id}
                  href={`/dashboard/requests/${req.id}`}
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
                    p-5
                    shadow-[0_30px_80px_rgba(0,0,0,0.18)]
                    hover:border-[#C9A84C]/20
                    hover:-translate-y-1
                    transition-all
                    duration-500
                  "
                >

                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-[#C9A84C]/5 via-transparent to-transparent" />

                  <div className="relative">

                    <div className="flex items-start justify-between gap-4 mb-5">

                      <div className="min-w-0">

                        <h3 className="text-white text-base font-medium truncate">
                          {
                            req.clientName
                          }
                        </h3>

                        <p className="text-white/35 text-xs truncate mt-1">
                          {
                            req.clientEmail
                          }
                        </p>
                      </div>

                      <StatusBadge
                        status={
                          req.status
                        }
                        size="sm"
                      />
                    </div>

                    <div className="border-t border-white/5 pt-4">

                      <p className="text-white text-sm mb-1">
                        {
                          req
                            .service
                            .name
                        }
                      </p>

                      <p className="text-white/30 text-[11px] uppercase tracking-[0.16em]">
                        {req.service.category.replace(
                          "_",
                          " "
                        )}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-5 mt-5 border-t border-white/5">

                      <p className="text-white/35 text-xs">
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

                      <div className="flex items-center gap-2 text-[#C9A84C] text-xs uppercase tracking-[0.16em]">

                        View

                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            )}
          </div>

          {/* DESKTOP */}
          <div
            className="
              hidden
              lg:block
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

            <div className="absolute top-[-100px] right-[-100px] w-[260px] h-[260px] rounded-full bg-[#C9A84C]/10 blur-3xl" />

            <div className="relative overflow-x-auto">

              <table className="w-full min-w-[920px]">

                <thead>

                  <tr className="border-b border-white/10">

                    {[
                      "Client",
                      "Service",
                      "Status",
                      "Submitted",
                      "",
                    ].map(
                      (h) => (
                        <th
                          key={h}
                          className="
                            text-left
                            text-white/35
                            text-[11px]
                            font-semibold
                            uppercase
                            tracking-[0.18em]
                            px-8
                            py-5
                          "
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">

                  {requests.map(
                    (req) => (
                      <tr
                        key={req.id}
                        className="group hover:bg-white/[0.02] transition-colors duration-300"
                      >

                        {/* Client */}
                        <td className="px-8 py-6">

                          <p className="text-white text-sm font-medium mb-1">
                            {
                              req.clientName
                            }
                          </p>

                          <p className="text-white/35 text-xs">
                            {
                              req.clientEmail
                            }
                          </p>
                        </td>

                        {/* Service */}
                        <td className="px-8 py-6">

                          <p className="text-white text-sm mb-1">
                            {
                              req
                                .service
                                .name
                            }
                          </p>

                          <p className="text-white/30 text-[11px] uppercase tracking-[0.16em]">
                            {req.service.category.replace(
                              "_",
                              " "
                            )}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-8 py-6">

                          <StatusBadge
                            status={
                              req.status
                            }
                            size="sm"
                          />
                        </td>

                        {/* Date */}
                        <td className="px-8 py-6">

                          <p className="text-white/40 text-xs">
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
                        </td>

                        {/* Action */}
                        <td className="px-8 py-6 text-right">

                          <Link
                            href={`/dashboard/requests/${req.id}`}
                            className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-2xl
                              border
                              border-white/10
                              bg-white/[0.03]
                              px-4
                              py-2.5
                              text-white/60
                              hover:text-white
                              hover:border-[#C9A84C]/20
                              transition-all
                              duration-300
                            "
                          >

                            View

                            <ArrowRight className="w-4 h-4 text-[#C9A84C]" />
                          </Link>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function formatStatus(
  status: string
) {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (l) =>
        l.toUpperCase()
    );
}

function FilterPill({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={`
        inline-flex
        items-center
        justify-center
        rounded-full
        border
        px-5
        py-2.5
        text-[11px]
        uppercase
        tracking-[0.18em]
        font-semibold
        whitespace-nowrap
        transition-all
        duration-300
        ${
          active
            ? "border-[#C9A84C]/20 bg-[#C9A84C]/10 text-[#C9A84C]"
            : "border-white/10 bg-white/[0.03] text-white/45 hover:text-white hover:border-white/20"
        }
      `}
    >
      {label}
    </Link>
  );
}