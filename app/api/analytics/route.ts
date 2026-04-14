// app/api/analytics/route.ts
// Admin-only. Runs all analytics aggregations in parallel and returns
// a single JSON payload for the dashboard page.
// Cached for 5 minutes — analytics don't need to be real-time.

import { NextRequest, NextResponse } from "next/server";
import { auth }   from "@/auth";
import { prisma } from "@/lib/prisma";

export const revalidate = 300; // 5 min ISR cache

export async function GET(req: NextRequest) {
  // Admin only
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Unauthorised." }, { status: 401 });
  }

  const range = parseInt(req.nextUrl.searchParams.get("range") ?? "30");
  const since = new Date();
  since.setDate(since.getDate() - range);

  // ── Run all queries in parallel ───────────────────────────────────────────

  const [
    totalRequests,
    requestsByStatus,
    requestsByService,
    revenueStats,
    completedRequests,
    requestsOverTime,
    revenueOverTime,
  ] = await Promise.all([

    // 1. Total request count (all time)
    prisma.serviceRequest.count(),

    // 2. Requests grouped by status (all time)
    prisma.serviceRequest.groupBy({
      by:     ["status"],
      _count: { status: true },
    }),

    // 3. Requests grouped by service name (within range)
    prisma.serviceRequest.groupBy({
      by:     ["serviceId"],
      where:  { createdAt: { gte: since } },
      _count: { serviceId: true },
    }),

    // 4. Revenue: sum of paid payments (all time)
    prisma.payment.aggregate({
      where:  { status: "PAID" },
      _sum:   { amount: true },
      _count: { id: true },
      _avg:   { amount: true },
    }),

    // 5. Completed requests for avg resolution time
    prisma.serviceRequest.findMany({
      where:  { status: "COMPLETED" },
      select: { createdAt: true, updatedAt: true },
      take:   200,
      orderBy: { updatedAt: "desc" },
    }),

    // 6. Requests per day over range (raw SQL for date truncation)
    prisma.$queryRaw<{ date: Date; count: bigint }[]>`
      SELECT
        DATE_TRUNC('day', "created_at") AS date,
        COUNT(*)::bigint                AS count
      FROM service_requests
      WHERE "created_at" >= ${since}
      GROUP BY DATE_TRUNC('day', "created_at")
      ORDER BY date ASC
    `,

    // 7. Revenue per month (last 12 months)
    prisma.$queryRaw<{ month: Date; total: number; count: bigint }[]>`
      SELECT
        DATE_TRUNC('month', "created_at") AS month,
        COALESCE(SUM(amount), 0)::float   AS total,
        COUNT(*)::bigint                  AS count
      FROM payments
      WHERE status = 'PAID'
        AND "created_at" >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', "created_at")
      ORDER BY month ASC
    `,
  ]);

  // ── Resolve service names for the by-service chart ────────────────────────

  const serviceIds = requestsByService.map((r) => r.serviceId);
  const services   = await prisma.service.findMany({
    where:  { id: { in: serviceIds } },
    select: { id: true, name: true },
  });
  const serviceMap = Object.fromEntries(services.map((s) => [s.id, s.name]));

  // ── Compute average resolution time ───────────────────────────────────────

  const avgResolutionDays =
    completedRequests.length === 0
      ? null
      : completedRequests.reduce((sum, r) => {
          const ms = r.updatedAt.getTime() - r.createdAt.getTime();
          return sum + ms / (1000 * 60 * 60 * 24);
        }, 0) / completedRequests.length;

  // ── Compute conversion rate: completed / total ────────────────────────────

  const completedCount =
    requestsByStatus.find((r) => r.status === "COMPLETED")?._count.status ?? 0;
  const conversionRate =
    totalRequests === 0 ? 0 : Math.round((completedCount / totalRequests) * 100);

  // ── Shape response ────────────────────────────────────────────────────────

  return NextResponse.json({
    success: true,
    range,
    summary: {
      totalRequests,
      totalRevenue:    revenueStats._sum.amount  ?? 0,
      totalPaidCount:  revenueStats._count.id    ?? 0,
      avgPayment:      revenueStats._avg.amount  ?? 0,
      conversionRate,
      avgResolutionDays: avgResolutionDays
        ? Math.round(avgResolutionDays * 10) / 10
        : null,
    },
    requestsByStatus: requestsByStatus.map((r) => ({
      status: r.status,
      count:  r._count.status,
    })),
    requestsByService: requestsByService.map((r) => ({
      service: serviceMap[r.serviceId] ?? "Unknown",
      count:   r._count.serviceId,
    })),
    requestsOverTime: requestsOverTime.map((r) => ({
      date:  r.date.toISOString().split("T")[0],
      count: Number(r.count),
    })),
    revenueOverTime: revenueOverTime.map((r) => ({
      month:  r.month.toISOString().slice(0, 7), // "YYYY-MM"
      total:  r.total,
      count:  Number(r.count),
    })),
  });
}