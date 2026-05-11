"use client";

// components/dashboard/AnalyticsCharts.tsx
// Improved analytics charts with better visibility, spacing,
// responsiveness, and premium dashboard styling.

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ─────────────────────────────────────────────────────────────
// Design tokens
// ─────────────────────────────────────────────────────────────

const NAVY = "#0A2540";

const GOLD = "#C9A84C";

const SLATE = "rgba(255,255,255,0.72)";

const GRID = "rgba(255,255,255,0.08)";

const TOOLTIP_BG = "#081d18";

const STATUS_COLORS: Record<
  string,
  string
> = {
  PENDING: "#F59E0B",

  IN_REVIEW:
    "#3B82F6",

  IN_PROGRESS:
    "#8B5CF6",

  AWAITING_DOCS:
    "#F97316",

  AWAITING_PAYMENT:
    "#EC4899",

  COMPLETED:
    "#10B981",

  CANCELLED:
    "#9CA3AF",
};

// ─────────────────────────────────────────────────────────────
// Shared tooltip
// ─────────────────────────────────────────────────────────────

const tooltipStyle = {
  backgroundColor:
    TOOLTIP_BG,

  border:
    "1px solid rgba(255,255,255,0.08)",

  borderRadius: "16px",

  fontSize: "12px",

  color: "#ffffff",

  boxShadow:
    "0 10px 40px rgba(0,0,0,0.35)",

  backdropFilter:
    "blur(14px)",
};

// ─────────────────────────────────────────────────────────────
// Requests over time
// ─────────────────────────────────────────────────────────────

type TimePoint = {
  date: string;
  count: number;
};

function RequestsLineChart({
  data,
}: {
  data: TimePoint[];
}) {
  if (data.length === 0) {
    return (
      <EmptyChart label="No request data for this period" />
    );
  }

  return (
    <div className="w-full h-[240px]">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >

          <CartesianGrid
            strokeDasharray="3 3"
            stroke={GRID}
            vertical={false}
          />

          <XAxis
            dataKey="date"
            tick={{
              fontSize: 11,
              fill: SLATE,
            }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(
              value
            ) => {
              const d =
                new Date(
                  value
                );

              return `${d.getDate()} ${d.toLocaleString(
                "default",
                {
                  month:
                    "short",
                }
              )}`;
            }}
            interval="preserveStartEnd"
          />

          <YAxis
            tick={{
              fontSize: 11,
              fill: SLATE,
            }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />

          <Tooltip
            contentStyle={
              tooltipStyle
            }
            labelFormatter={(
              value
            ) =>
              new Date(
                String(
                  value
                )
              ).toLocaleDateString(
                "en-ZW",
                {
                  dateStyle:
                    "medium",
                }
              )
            }
            formatter={(
              value
            ) => [
              value ?? 0,
              "Requests",
            ]}
          />

          <Line
            type="monotone"
            dataKey="count"
            stroke={GOLD}
            strokeWidth={3}
            dot={false}
            activeDot={{
              r: 5,
              fill: GOLD,
              stroke: NAVY,
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Revenue over time
// ─────────────────────────────────────────────────────────────

type RevenuePoint = {
  month: string;
  total: number;
  count: number;
};

function RevenueBarChart({
  data,
}: {
  data: RevenuePoint[];
}) {
  if (data.length === 0) {
    return (
      <EmptyChart label="No revenue data yet" />
    );
  }

  return (
    <div className="w-full h-[240px]">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -18,
            bottom: 0,
          }}
        >

          <CartesianGrid
            strokeDasharray="3 3"
            stroke={GRID}
            vertical={false}
          />

          <XAxis
            dataKey="month"
            tick={{
              fontSize: 11,
              fill: SLATE,
            }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(
              value
            ) => {
              const [
                year,
                month,
              ] =
                String(
                  value
                ).split("-");

              return new Date(
                parseInt(
                  year
                ),
                parseInt(
                  month
                ) - 1
              ).toLocaleString(
                "default",
                {
                  month:
                    "short",
                }
              );
            }}
          />

          <YAxis
            tick={{
              fontSize: 11,
              fill: SLATE,
            }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(
              value
            ) =>
              `$${value}`}
          />

          <Tooltip
            contentStyle={
              tooltipStyle
            }
            formatter={(
              value
            ) => [
              `$${Number(
                value ??
                  0
              ).toFixed(2)}`,
              "Revenue",
            ]}
          />

          <Bar
            dataKey="total"
            fill={GOLD}
            radius={[
              8,
              8,
              0,
              0,
            ]}
            maxBarSize={42}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Requests by service
// ─────────────────────────────────────────────────────────────

type ServicePoint = {
  service: string;
  count: number;
};

function RequestsByServiceChart({
  data,
}: {
  data: ServicePoint[];
}) {
  if (data.length === 0) {
    return (
      <EmptyChart label="No service data for this period" />
    );
  }

  const sorted = [
    ...data,
  ].sort(
    (a, b) =>
      b.count - a.count
  );

  return (
    <div className="w-full h-[240px]">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <BarChart
          data={sorted}
          layout="vertical"
          margin={{
            top: 8,
            right: 16,
            left: 8,
            bottom: 0,
          }}
        >

          <CartesianGrid
            strokeDasharray="3 3"
            stroke={GRID}
            horizontal={false}
          />

          <XAxis
            type="number"
            tick={{
              fontSize: 11,
              fill: SLATE,
            }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />

          <YAxis
            type="category"
            dataKey="service"
            tick={{
              fontSize: 11,
              fill: SLATE,
            }}
            tickLine={false}
            axisLine={false}
            width={130}
            tickFormatter={(
              value: string
            ) =>
              value.length >
              20
                ? value.slice(
                    0,
                    18
                  ) + "…"
                : value
            }
          />

          <Tooltip
            contentStyle={
              tooltipStyle
            }
            formatter={(
              value
            ) => [
              value ?? 0,
              "Requests",
            ]}
          />

          <Bar
            dataKey="count"
            fill={GOLD}
            radius={[
              0,
              8,
              8,
              0,
            ]}
            maxBarSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Status donut
// ─────────────────────────────────────────────────────────────

type StatusPoint = {
  status: string;
  count: number;
};

function StatusDonutChart({
  data,
}: {
  data: StatusPoint[];
}) {
  if (data.length === 0) {
    return (
      <EmptyChart label="No status data yet" />
    );
  }

  const total =
    data.reduce(
      (sum, d) =>
        sum + d.count,
      0
    );

  return (
    <div className="w-full h-[240px]">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <PieChart>

          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            cx="40%"
            cy="50%"
            innerRadius={58}
            outerRadius={86}
            paddingAngle={2}
            strokeWidth={0}
          >

            {data.map(
              (
                entry
              ) => (
                <Cell
                  key={
                    entry.status
                  }
                  fill={
                    STATUS_COLORS[
                      entry
                        .status
                    ] ??
                    "#CBD5E0"
                  }
                />
              )
            )}
          </Pie>

          <Tooltip
            contentStyle={
              tooltipStyle
            }
            formatter={(
              value,
              name
            ) => [
              `${value} (${Math.round(
                (Number(
                  value
                ) /
                  total) *
                  100
              )}%)`,

              String(name)
                .replace(
                  /_/g,
                  " "
                )
                .toLowerCase()
                .replace(
                  /^\w/,
                  (
                    c
                  ) =>
                    c.toUpperCase()
                ),
            ]}
          />

          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconType="circle"
            iconSize={8}
            formatter={(
              value
            ) =>
              String(
                value
              )
                .replace(
                  /_/g,
                  " "
                )
                .toLowerCase()
                .replace(
                  /^\w/,
                  (
                    c
                  ) =>
                    c.toUpperCase()
                )
            }
            wrapperStyle={{
              fontSize:
                "11px",

              color:
                "rgba(255,255,255,0.72)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Empty state
// ─────────────────────────────────────────────────────────────

function EmptyChart({
  label,
}: {
  label: string;
}) {
  return (
    <div className="h-[240px] flex items-center justify-center">

      <p className="text-white/35 text-sm italic">
        {label}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────

export {
  RequestsLineChart,
  RevenueBarChart,
  RequestsByServiceChart,
  StatusDonutChart,
};