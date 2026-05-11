// app/(admin)/dashboard/analytics/page.tsx

import { Metadata } from "next";
import Link from "next/link";

import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

import {
  RequestsLineChart,
  RevenueBarChart,
  RequestsByServiceChart,
  StatusDonutChart,
} from "@/components/dashboard/AnalyticsCharts";

import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  DollarSign,
  Sparkles,
  TimerReset,
} from "lucide-react";

export const metadata: Metadata =
  {
    title:
      "Analytics — Premasse Admin",
  };

export const dynamic =
  "force-dynamic";

const VALID_RANGES = [
  30,
  90,
  365,
] as const;

type Range =
  (typeof VALID_RANGES)[number];

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{
    range?: string;
  }>;
}) {
  await requireAdmin();

  const {
    range: rangeParam,
  } = await searchParams;

  const range: Range =
    VALID_RANGES.includes(
      Number(
        rangeParam
      ) as Range
    )
      ? (Number(
          rangeParam
        ) as Range)
      : 30;

  const since =
    new Date();

  since.setDate(
    since.getDate() - range
  );

  // ───────────────────────────────────────────────────────────
  // Queries
  // ───────────────────────────────────────────────────────────

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

    prisma.serviceRequest.groupBy(
      {
        by: ["status"],

        _count: {
          status: true,
        },
      }
    ),

    prisma.serviceRequest.groupBy(
      {
        by: ["serviceId"],

        where: {
          createdAt: {
            gte: since,
          },
        },

        _count: {
          serviceId: true,
        },
      }
    ),

    prisma.payment.aggregate(
      {
        where: {
          status: "PAID",
        },

        _sum: {
          amount: true,
        },

        _count: {
          id: true,
        },

        _avg: {
          amount: true,
        },
      }
    ),

    prisma.serviceRequest.findMany(
      {
        where: {
          status:
            "COMPLETED",
        },

        select: {
          createdAt: true,
          updatedAt: true,
        },

        take: 200,

        orderBy: {
          updatedAt:
            "desc",
        },
      }
    ),

    prisma.$queryRaw<
      {
        date: Date;
        count: bigint;
      }[]
    >`
      SELECT
        DATE_TRUNC('day', "createdAt") AS date,
        COUNT(*)::bigint               AS count
      FROM service_requests
      WHERE "createdAt" >= ${since}
      GROUP BY DATE_TRUNC('day', "createdAt")
      ORDER BY date ASC
    `,

    prisma.$queryRaw<
      {
        month: Date;
        total: number;
        count: bigint;
      }[]
    >`
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

  // ───────────────────────────────────────────────────────────
  // Services
  // ───────────────────────────────────────────────────────────

  const serviceIds =
    requestsByService.map(
      (r) => r.serviceId
    );

  const services =
    await prisma.service.findMany(
      {
        where: {
          id: {
            in: serviceIds,
          },
        },

        select: {
          id: true,
          name: true,
        },
      }
    );

  const serviceMap =
    Object.fromEntries(
      services.map((s) => [
        s.id,
        s.name,
      ])
    );

  // ───────────────────────────────────────────────────────────
  // Derived stats
  // ───────────────────────────────────────────────────────────

  const avgResolutionDays =
    completedRequests.length ===
    0
      ? null
      : completedRequests.reduce(
          (sum, r) => {
            return (
              sum +
              (r.updatedAt.getTime() -
                r.createdAt.getTime()) /
                86400000
            );
          },
          0
        ) /
        completedRequests.length;

  const completedCount =
    requestsByStatus.find(
      (r) =>
        r.status ===
        "COMPLETED"
    )?._count.status ?? 0;

  const conversionRate =
    totalRequests === 0
      ? 0
      : Math.round(
          (completedCount /
            totalRequests) *
            100
        );

  const totalRevenue =
    revenueStats._sum
      .amount ?? 0;

  const totalPaidCount =
    revenueStats._count
      .id ?? 0;

  // ───────────────────────────────────────────────────────────
  // Chart data
  // ───────────────────────────────────────────────────────────

  const statusData =
    requestsByStatus.map(
      (r) => ({
        status: r.status,
        count:
          r._count.status,
      })
    );

  const serviceData =
    requestsByService.map(
      (r) => ({
        service:
          serviceMap[
            r.serviceId
          ] ?? "Unknown",

        count:
          r._count
            .serviceId,
      })
    );

  const timeData =
    requestsOverTime.map(
      (r) => ({
        date: r.date
          .toISOString()
          .split("T")[0],

        count: Number(
          r.count
        ),
      })
    );

  const revenueData =
    revenueOverTime.map(
      (r) => ({
        month: r.month
          .toISOString()
          .slice(0, 7),

        total: r.total,

        count: Number(
          r.count
        ),
      })
    );

  // ───────────────────────────────────────────────────────────
  // Stats
  // ───────────────────────────────────────────────────────────

  const STATS = [
    {
      label:
        "Total requests",

      value: totalRequests,

      sub: "all time",

      icon:
        BarChart3,

      glow:
        "from-[#C9A84C]/15 to-transparent",

      href:
        "/dashboard/requests",
    },

    {
      label:
        "Total revenue",

      value: `$${totalRevenue.toFixed(
        2
      )}`,

      sub: `${totalPaidCount} paid invoice${
        totalPaidCount !== 1
          ? "s"
          : ""
      }`,

      icon:
        DollarSign,

      glow:
        "from-emerald-500/15 to-transparent",

      href: null,
    },

    {
      label:
        "Conversion rate",

      value: `${conversionRate}%`,

      sub: "completed",

      icon:
        CheckCircle2,

      glow:
        "from-purple-500/15 to-transparent",

      href: null,
    },

    {
      label:
        "Avg resolution",

      value:
        avgResolutionDays !=
        null
          ? `${Math.round(
              avgResolutionDays *
                10
            ) / 10}d`
          : "—",

      sub: "days to complete",

      icon:
        TimerReset,

      glow:
        "from-blue-500/15 to-transparent",

      href: null,
    },
  ];

  // ───────────────────────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────────────────────

  return (
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6 mb-10">

        <div>

          <div className="inline-flex items-center gap-3 mb-6">

            <div className="flex items-center gap-2.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-5 py-2.5 backdrop-blur-md shadow-[0_10px_40px_rgba(201,168,76,0.08)]">

              <Sparkles className="w-4 h-4 text-[#C9A84C]" />

              <span className="font-body text-[#C9A84C] text-[11px] tracking-[0.24em] uppercase font-semibold">
                Analytics
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
            Business
            <br />

            <span className="text-[#C9A84C] italic">
              insights.
            </span>
          </h1>

          <p className="text-white/60 text-base sm:text-lg max-w-2xl leading-relaxed">
            Monitor request
            trends, revenue,
            performance, and
            service activity
            across the Premasse
            platform.
          </p>
        </div>

        {/* Range */}
        <div className="flex gap-2 self-start">

          {VALID_RANGES.map(
            (r) => (
              <Link
                key={r}
                href={`/dashboard/analytics?range=${r}`}
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
                    range === r
                      ? "border-[#C9A84C]/20 bg-[#C9A84C]/10 text-[#C9A84C]"
                      : "border-white/10 bg-white/[0.03] text-white/45 hover:text-white hover:border-white/20"
                  }
                `}
              >
                {r === 365
                  ? "1 year"
                  : `${r}d`}
              </Link>
            )
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">

        {STATS.map(
          ({
            label,
            value,
            sub,
            icon: Icon,
            glow,
            href,
          }) => {
            const card = (
              <div
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
                  h-full
                "
              >

                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${glow}`}
                />

                <div className="relative">

                  <div className="flex items-start justify-between mb-8">

                    <div className="w-14 h-14 rounded-2xl border border-white/10 bg-white/[0.04] flex items-center justify-center">

                      <Icon className="w-6 h-6 text-[#C9A84C]" />
                    </div>

                    {href && (
                      <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-[#C9A84C] transition-colors duration-300" />
                    )}
                  </div>

                  <p className="font-display text-white text-4xl leading-none mb-3">
                    {value}
                  </p>

                  <p className="text-white text-sm font-medium mb-1">
                    {label}
                  </p>

                  <p className="text-white/40 text-xs uppercase tracking-[0.16em]">
                    {sub}
                  </p>
                </div>
              </div>
            );

            return href ? (
              <Link
                key={label}
                href={href}
              >
                {card}
              </Link>
            ) : (
              <div key={label}>
                {card}
              </div>
            );
          }
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <ChartCard
          title="Requests over time"
          subtitle={`Last ${range} days`}
        >
          <RequestsLineChart
            data={timeData}
          />
        </ChartCard>

        <ChartCard
          title="Revenue over time"
          subtitle="Monthly USD · last 12 months"
        >
          <RevenueBarChart
            data={revenueData}
          />
        </ChartCard>

        <ChartCard
          title="Requests by service"
          subtitle={`Last ${range} days`}
        >
          <RequestsByServiceChart
            data={serviceData}
          />
        </ChartCard>

        <ChartCard
          title="Status breakdown"
          subtitle="All requests · current distribution"
        >
          <StatusDonutChart
            data={statusData}
          />
        </ChartCard>
      </div>

      {/* Footer */}
      <p className="text-white/25 text-xs text-center mt-10 uppercase tracking-[0.18em]">
        Analytics refresh on
        every page load ·
        Revenue figures in USD
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Chart card
// ─────────────────────────────────────────────────────────────

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
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

      <div className="absolute top-[-100px] right-[-100px] w-[240px] h-[240px] rounded-full bg-[#C9A84C]/10 blur-3xl" />

      <div className="relative">

        <div className="mb-6">

          <div className="flex items-center gap-3 mb-2">

            <div className="h-px w-10 bg-[#C9A84C]" />

            <span className="text-[#C9A84C] text-xs tracking-[0.22em] uppercase font-semibold">
              Chart
            </span>
          </div>

          <h2 className="font-display text-white text-2xl mb-2">
            {title}
          </h2>

          <p className="text-white/45 text-sm">
            {subtitle}
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[320px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}