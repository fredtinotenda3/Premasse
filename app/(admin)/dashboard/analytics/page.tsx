// app/(admin)/dashboard/analytics/page.tsx

import { Metadata }     from "next";
import Link             from "next/link";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma }       from "@/lib/prisma";
import {
  RequestsLineChart,
  RevenueBarChart,
  RequestsByServiceChart,
  StatusDonutChart,
} from "@/components/dashboard/AnalyticsCharts";

export const metadata: Metadata = { title: "Analytics — Admin" };
export const dynamic = "force-dynamic";

const VALID_RANGES = [30, 90, 365] as const;
type Range = typeof VALID_RANGES[number];

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  await requireAdmin();

  const { range: rangeParam } = await searchParams;
  const range: Range = VALID_RANGES.includes(Number(rangeParam) as Range)
    ? (Number(rangeParam) as Range)
    : 30;

  const since = new Date();
  since.setDate(since.getDate() - range);

  // ── Run all queries in parallel directly — no self-fetch ─────────────────

  const [
    totalRequests,
    requestsByStatus,
    requestsByService,
    revenueStats,
    completedRequests,
    requestsOverTime,
    revenueOverTime,
  ] = await Promise.all([

    prisma.serviceRequest.count(),

    prisma.serviceRequest.groupBy({
      by:     ["status"],
      _count: { status: true },
    }),

    prisma.serviceRequest.groupBy({
      by:     ["serviceId"],
      where:  { createdAt: { gte: since } },
      _count: { serviceId: true },
    }),

    prisma.payment.aggregate({
      where:  { status: "PAID" },
      _sum:   { amount: true },
      _count: { id: true },
      _avg:   { amount: true },
    }),

    prisma.serviceRequest.findMany({
      where:   { status: "COMPLETED" },
      select:  { createdAt: true, updatedAt: true },
      take:    200,
      orderBy: { updatedAt: "desc" },
    }),

    prisma.$queryRaw<{ date: Date; count: bigint }[]>`
      SELECT
        DATE_TRUNC('day', "createdAt") AS date,
        COUNT(*)::bigint               AS count
      FROM service_requests
      WHERE "createdAt" >= ${since}
      GROUP BY DATE_TRUNC('day', "createdAt")
      ORDER BY date ASC
    `,

    prisma.$queryRaw<{ month: Date; total: number; count: bigint }[]>`
      SELECT
        DATE_TRUNC('month', "createdAt") AS month,
        COALESCE(SUM(amount), 0)::float  AS total,
        COUNT(*)::bigint                 AS count
      FROM payments
      WHERE status = 'PAID'
        AND "createdAt" >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month ASC
    `,
  ]);

  // ── Resolve service names ─────────────────────────────────────────────────

  const serviceIds = requestsByService.map((r) => r.serviceId);
  const services   = await prisma.service.findMany({
    where:  { id: { in: serviceIds } },
    select: { id: true, name: true },
  });
  const serviceMap = Object.fromEntries(services.map((s) => [s.id, s.name]));

  // ── Derived stats ─────────────────────────────────────────────────────────

  const avgResolutionDays =
    completedRequests.length === 0
      ? null
      : completedRequests.reduce((sum, r) => {
          return sum + (r.updatedAt.getTime() - r.createdAt.getTime()) / 86400000;
        }, 0) / completedRequests.length;

  const completedCount =
    requestsByStatus.find((r) => r.status === "COMPLETED")?._count.status ?? 0;
  const conversionRate =
    totalRequests === 0 ? 0 : Math.round((completedCount / totalRequests) * 100);

  const totalRevenue   = revenueStats._sum.amount  ?? 0;
  const totalPaidCount = revenueStats._count.id    ?? 0;

  // ── Shape chart data ──────────────────────────────────────────────────────

  const statusData = requestsByStatus.map((r) => ({
    status: r.status,
    count:  r._count.status,
  }));

  const serviceData = requestsByService.map((r) => ({
    service: serviceMap[r.serviceId] ?? "Unknown",
    count:   r._count.serviceId,
  }));

  const timeData = requestsOverTime.map((r) => ({
    date:  r.date.toISOString().split("T")[0],
    count: Number(r.count),
  }));

  const revenueData = revenueOverTime.map((r) => ({
    month: r.month.toISOString().slice(0, 7),
    total: r.total,
    count: Number(r.count),
  }));

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-6xl">

      {/* Page header + range selector */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-navy text-2xl font-semibold mb-1">
            Analytics
          </h1>
          <p className="font-body text-slate/60 text-sm">
            Overview of requests, revenue, and performance.
          </p>
        </div>

        <div className="flex gap-1 bg-gray-100 rounded-sm p-1 flex-shrink-0">
          {VALID_RANGES.map((r) => (
            <Link
              key={r}
              href={`/dashboard/analytics?range=${r}`}
              className={`font-body text-xs px-3 py-1.5 rounded-sm transition-colors duration-150 ${
                range === r
                  ? "bg-white text-navy shadow-sm"
                  : "text-slate/60 hover:text-navy"
              }`}
            >
              {r === 365 ? "1 year" : `${r}d`}
            </Link>
          ))}
        </div>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label:  "Total requests",
            value:  totalRequests,
            sub:    "all time",
            accent: "border-l-navy",
            href:   "/dashboard/requests",
          },
          {
            label:  "Total revenue",
            value:  `$${totalRevenue.toFixed(2)}`,
            sub:    `${totalPaidCount} paid invoice${totalPaidCount !== 1 ? "s" : ""}`,
            accent: "border-l-amber-400",
            href:   null,
          },
          {
            label:  "Conversion rate",
            value:  `${conversionRate}%`,
            sub:    "pending → completed",
            accent: "border-l-green-500",
            href:   null,
          },
          {
            label:  "Avg resolution",
            value:  avgResolutionDays != null
                      ? `${Math.round(avgResolutionDays * 10) / 10}d`
                      : "—",
            sub:    "days to complete",
            accent: "border-l-purple-400",
            href:   null,
          },
        ].map(({ label, value, sub, accent, href }) => {
          const card = (
            <div className={`bg-white border border-gray-100 border-l-4 ${accent} rounded-sm p-5 ${href ? "hover:shadow-sm transition-shadow duration-150" : ""}`}>
              <p className="font-display text-navy text-3xl font-bold mb-1">{value}</p>
              <p className="font-body text-navy text-sm font-medium mb-0.5">{label}</p>
              <p className="font-body text-slate/50 text-xs">{sub}</p>
            </div>
          );
          return href ? (
            <Link key={label} href={href}>{card}</Link>
          ) : (
            <div key={label}>{card}</div>
          );
        })}
      </div>

      {/* Charts 2×2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white border border-gray-100 rounded-sm p-6">
          <div className="mb-4">
            <h2 className="font-display text-navy text-base font-semibold">Requests over time</h2>
            <p className="font-body text-slate/50 text-xs mt-0.5">Last {range} days</p>
          </div>
          <RequestsLineChart data={timeData} />
        </div>

        <div className="bg-white border border-gray-100 rounded-sm p-6">
          <div className="mb-4">
            <h2 className="font-display text-navy text-base font-semibold">Revenue over time</h2>
            <p className="font-body text-slate/50 text-xs mt-0.5">Monthly USD · last 12 months</p>
          </div>
          <RevenueBarChart data={revenueData} />
        </div>

        <div className="bg-white border border-gray-100 rounded-sm p-6">
          <div className="mb-4">
            <h2 className="font-display text-navy text-base font-semibold">Requests by service</h2>
            <p className="font-body text-slate/50 text-xs mt-0.5">Last {range} days</p>
          </div>
          <RequestsByServiceChart data={serviceData} />
        </div>

        <div className="bg-white border border-gray-100 rounded-sm p-6">
          <div className="mb-4">
            <h2 className="font-display text-navy text-base font-semibold">Status breakdown</h2>
            <p className="font-body text-slate/50 text-xs mt-0.5">All requests · current distribution</p>
          </div>
          <StatusDonutChart data={statusData} />
        </div>
      </div>

      <p className="font-body text-slate/35 text-xs text-center mt-8">
        Analytics refresh on every page load · Revenue figures in USD
      </p>
    </div>
  );
}
