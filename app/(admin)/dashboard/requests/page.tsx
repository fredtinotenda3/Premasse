// app/(admin)/dashboard/requests/page.tsx
// Requests list — server component with URL-based filtering.
// Filter by status via ?status=PENDING — no client state needed.

import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { RequestStatus } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";

export const metadata: Metadata = { title: "Requests — Admin" };

// Revalidate every 30s — requests trickle in, not real-time
export const revalidate = 30;

const ALL_STATUSES = Object.values(RequestStatus);

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  await requireAdmin();

  const activeStatus =
    searchParams.status &&
    ALL_STATUSES.includes(searchParams.status as RequestStatus)
      ? (searchParams.status as RequestStatus)
      : null;

  // Fetch requests + counts in parallel
  const [requests, statusCounts] = await Promise.all([
    prisma.serviceRequest.findMany({
      where: activeStatus ? { status: activeStatus } : undefined,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        clientName: true,
        clientEmail: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        service: { select: { name: true, category: true } },
      },
    }),
    prisma.serviceRequest.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
  ]);

  // Build count map for filter pills
  const countMap = Object.fromEntries(
    statusCounts.map((s) => [s.status, s._count.status])
  ) as Record<RequestStatus, number>;

  const totalCount = statusCounts.reduce((sum, s) => sum + s._count.status, 0);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="font-display text-navy text-xl sm:text-2xl font-semibold mb-1">
          Service requests
        </h1>
        <p className="font-body text-slate/60 text-sm">
          {totalCount} total request{totalCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Status filter pills - horizontal scroll on mobile */}
      <div className="overflow-x-auto pb-2 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex flex-nowrap sm:flex-wrap gap-2 min-w-max sm:min-w-0">
          <Link
            href="/dashboard/requests"
            className={`font-body text-xs px-3 py-1.5 rounded-sm border transition-colors duration-150 whitespace-nowrap ${
              !activeStatus
                ? "bg-navy text-white border-navy"
                : "bg-white text-slate border-gray-200 hover:border-gray-300"
            }`}
          >
            All ({totalCount})
          </Link>
          {ALL_STATUSES.map((status) => (
            <Link
              key={status}
              href={`/dashboard/requests?status=${status}`}
              className={`font-body text-xs px-3 py-1.5 rounded-sm border transition-colors duration-150 whitespace-nowrap ${
                activeStatus === status
                  ? "bg-navy text-white border-navy"
                  : "bg-white text-slate border-gray-200 hover:border-gray-300"
              }`}
            >
              {status.replace("_", " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
              {countMap[status] ? ` (${countMap[status]})` : " (0)"}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile card view - visible on small screens */}
      <div className="block sm:hidden space-y-4">
        {requests.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-sm p-8 text-center">
            <p className="font-body text-slate/50 text-sm">
              No requests{activeStatus ? ` with status "${activeStatus}"` : ""}.
            </p>
          </div>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              className="bg-white border border-gray-100 rounded-sm p-4 hover:shadow-md transition-shadow duration-200"
            >
              {/* Client info */}
              <div className="mb-3">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-body text-navy text-sm font-semibold">
                    {req.clientName}
                  </h3>
                  <StatusBadge status={req.status} size="sm" />
                </div>
                <p className="font-body text-slate/50 text-xs mb-2">
                  {req.clientEmail}
                </p>
              </div>

              {/* Service info */}
              <div className="mb-3 pt-2 border-t border-gray-50">
                <p className="font-body text-navy text-sm font-medium">
                  {req.service.name}
                </p>
                <p className="font-body text-slate/40 text-xs uppercase tracking-wider mt-0.5">
                  {req.service.category.replace("_", " ")}
                </p>
              </div>

              {/* Date and action */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <p className="font-body text-slate/60 text-xs">
                  {formatDistanceToNow(new Date(req.createdAt), {
                    addSuffix: true,
                  })}
                </p>
                <Link
                  href={`/dashboard/requests/${req.id}`}
                  className="font-body text-xs text-navy border border-navy/20 hover:border-navy/50 px-3 py-1.5 rounded-sm transition-colors duration-150 inline-block"
                >
                  View →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop table view - hidden on mobile */}
      <div className="hidden sm:block">
        {requests.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-sm p-16 text-center">
            <p className="font-body text-slate/50 text-sm">
              No requests{activeStatus ? ` with status "${activeStatus}"` : ""}.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Client", "Service", "Status", "Submitted", ""].map((h) => (
                      <th
                        key={h}
                        className="font-body text-left text-xs text-slate/50 font-medium uppercase tracking-widest px-5 py-3"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {requests.map((req) => (
                    <tr
                      key={req.id}
                      className="hover:bg-gray-50/60 transition-colors duration-100"
                    >
                      {/* Client */}
                      <td className="px-5 py-4">
                        <p className="font-body text-navy text-sm font-medium">
                          {req.clientName}
                        </p>
                        <p className="font-body text-slate/50 text-xs">
                          {req.clientEmail}
                        </p>
                      </td>

                      {/* Service */}
                      <td className="px-5 py-4">
                        <p className="font-body text-navy text-sm">
                          {req.service.name}
                        </p>
                        <p className="font-body text-slate/40 text-xs uppercase tracking-wider">
                          {req.service.category.replace("_", " ")}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <StatusBadge status={req.status} size="sm" />
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4">
                        <p className="font-body text-slate/60 text-xs">
                          {formatDistanceToNow(new Date(req.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/dashboard/requests/${req.id}`}
                          className="font-body text-xs text-navy border border-navy/20 hover:border-navy/50 px-3 py-1.5 rounded-sm transition-colors duration-150"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}