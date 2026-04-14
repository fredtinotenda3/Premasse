// app/(admin)/dashboard/page.tsx
// Dashboard home — summary stats with quick links.

import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { RequestStatus } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";

export const metadata: Metadata = { title: "Dashboard — Premasse Admin" };
export const revalidate = 60;

export default async function DashboardPage() {
  const session = await requireAdmin();

  const [statusCounts, recentRequests] = await Promise.all([
    prisma.serviceRequest.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
    prisma.serviceRequest.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        clientName: true,
        status: true,
        createdAt: true,
        service: { select: { name: true } },
      },
    }),
  ]);

  const countMap = Object.fromEntries(
    statusCounts.map((s) => [s.status, s._count.status])
  ) as Partial<Record<RequestStatus, number>>;

  const total = statusCounts.reduce((sum, s) => sum + s._count.status, 0);

  const STAT_CARDS = [
    {
      label: "Total requests",
      value: total,
      href: "/dashboard/requests",
      accent: "border-l-navy",
    },
    {
      label: "Pending",
      value: countMap["PENDING"] ?? 0,
      href: "/dashboard/requests?status=PENDING",
      accent: "border-l-amber-400",
    },
    {
      label: "In progress",
      value: countMap["IN_PROGRESS"] ?? 0,
      href: "/dashboard/requests?status=IN_PROGRESS",
      accent: "border-l-purple-400",
    },
    {
      label: "Completed",
      value: countMap["COMPLETED"] ?? 0,
      href: "/dashboard/requests?status=COMPLETED",
      accent: "border-l-green-500",
    },
  ];

  return (
    <div className="max-w-4xl">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="font-display text-navy text-2xl font-semibold mb-1">
          Good {getTimeOfDay()}, {session.user.name?.split(" ")[0] ?? "Admin"}
        </h1>
        <p className="font-body text-slate/60 text-sm">
          Here's what's happening with Premasse service requests.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {STAT_CARDS.map(({ label, value, href, accent }) => (
          <Link
            key={label}
            href={href}
            className={`bg-white border border-gray-100 border-l-4 ${accent} rounded-sm p-5 hover:shadow-sm transition-shadow duration-150`}
          >
            <p className="font-display text-navy text-3xl font-bold mb-1">
              {value}
            </p>
            <p className="font-body text-slate/60 text-sm">{label}</p>
          </Link>
        ))}
      </div>

      {/* Recent requests */}
      <div className="bg-white border border-gray-100 rounded-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h2 className="font-display text-navy text-base font-semibold">
            Recent requests
          </h2>
          <Link
            href="/dashboard/requests"
            className="font-body text-slate/50 text-xs hover:text-navy transition-colors"
          >
            View all →
          </Link>
        </div>

        {recentRequests.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="font-body text-slate/40 text-sm italic">
              No requests yet. They'll appear here once clients submit the form.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {recentRequests.map((req) => (
              <li key={req.id}>
                <Link
                  href={`/dashboard/requests/${req.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/60 transition-colors duration-100"
                >
                  <div>
                    <p className="font-body text-navy text-sm font-medium">
                      {req.clientName}
                    </p>
                    <p className="font-body text-slate/50 text-xs">
                      {req.service.name} ·{" "}
                      {formatDistanceToNow(new Date(req.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <StatusBadge status={req.status} size="sm" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function getTimeOfDay(): string {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
