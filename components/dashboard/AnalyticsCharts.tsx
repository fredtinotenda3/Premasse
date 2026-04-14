"use client";

// components/dashboard/AnalyticsCharts.tsx
// All four chart components in one file — avoids four separate client bundles.
// Uses Recharts (already a peer dep via react) for clean, responsive charts.
// Each chart is exported individually so the page can import only what it needs.

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

// ── Design tokens (match the Premasse palette) ────────────────────────────────

const NAVY  = "#0A2540";
const GOLD  = "#C9A84C";
const SLATE = "#4A5568";
const MUTED = "#E2E8F0";

const STATUS_COLORS: Record<string, string> = {
  PENDING:          "#F59E0B",
  IN_REVIEW:        "#3B82F6",
  IN_PROGRESS:      "#8B5CF6",
  AWAITING_DOCS:    "#F97316",
  AWAITING_PAYMENT: "#EC4899",
  COMPLETED:        "#10B981",
  CANCELLED:        "#9CA3AF",
};

// ── Shared tooltip style ──────────────────────────────────────────────────────

const tooltipStyle = {
  backgroundColor: "#fff",
  border:          "1px solid #E2E8F0",
  borderRadius:    "2px",
  fontSize:        "12px",
  fontFamily:      "var(--font-body, sans-serif)",
  color:           NAVY,
  boxShadow:       "0 2px 8px rgba(0,0,0,0.06)",
};

// ── 1. Requests over time (line chart) ────────────────────────────────────────

type TimePoint = { date: string; count: number };

export function RequestsLineChart({ data }: { data: TimePoint[] }) {
  if (data.length === 0) return <EmptyChart label="No request data for this period" />;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={MUTED} vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: SLATE, fontFamily: "var(--font-body, sans-serif)" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => {
            const d = new Date(v);
            return `${d.getDate()} ${d.toLocaleString("default", { month: "short" })}`;
          }}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 11, fill: SLATE, fontFamily: "var(--font-body, sans-serif)" }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelFormatter={(v) => new Date(v).toLocaleDateString("en-ZW", { dateStyle: "medium" })}
          formatter={(v) => [v ?? 0, "Requests"]}
        />
        <Line
          type="monotone"
          dataKey="count"
          stroke={NAVY}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: GOLD, stroke: NAVY, strokeWidth: 1.5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ── 2. Revenue over time (bar chart) ─────────────────────────────────────────

type RevenuePoint = { month: string; total: number; count: number };

export function RevenueBarChart({ data }: { data: RevenuePoint[] }) {
  if (data.length === 0) return <EmptyChart label="No revenue data yet" />;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={MUTED} vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: SLATE, fontFamily: "var(--font-body, sans-serif)" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => {
            const [year, month] = v.split("-");
            return new Date(parseInt(year), parseInt(month) - 1).toLocaleString("default", { month: "short" });
          }}
        />
        <YAxis
          tick={{ fontSize: 11, fill: SLATE, fontFamily: "var(--font-body, sans-serif)" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `$${v}`}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelFormatter={(v) => {
            const [year, month] = v.split("-");
            return new Date(parseInt(year), parseInt(month) - 1).toLocaleString("default", { month: "long", year: "numeric" });
          }}
          formatter={(v) => [`$${Number(v ?? 0).toFixed(2)}`, "Revenue"]}
        />
        <Bar
          dataKey="total"
          fill={GOLD}
          radius={[2, 2, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── 3. Requests by service (horizontal bar) ───────────────────────────────────

type ServicePoint = { service: string; count: number };

export function RequestsByServiceChart({ data }: { data: ServicePoint[] }) {
  if (data.length === 0) return <EmptyChart label="No service data for this period" />;

  // Sort descending
  const sorted = [...data].sort((a, b) => b.count - a.count);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={sorted}
        layout="vertical"
        margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={MUTED} horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: SLATE, fontFamily: "var(--font-body, sans-serif)" }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <YAxis
          type="category"
          dataKey="service"
          tick={{ fontSize: 11, fill: SLATE, fontFamily: "var(--font-body, sans-serif)" }}
          tickLine={false}
          axisLine={false}
          width={130}
          tickFormatter={(v: string) =>
            v.length > 20 ? v.slice(0, 18) + "…" : v
          }
        />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v) => [v ?? 0, "Requests"]}
        />
        <Bar
          dataKey="count"
          fill={NAVY}
          radius={[0, 2, 2, 0]}
          maxBarSize={18}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── 4. Status breakdown (donut) ───────────────────────────────────────────────

type StatusPoint = { status: string; count: number };

export function StatusDonutChart({ data }: { data: StatusPoint[] }) {
  if (data.length === 0) return <EmptyChart label="No status data yet" />;

  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="status"
          cx="40%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={2}
          strokeWidth={0}
        >
          {data.map((entry) => (
            <Cell
              key={entry.status}
              fill={STATUS_COLORS[entry.status] ?? "#CBD5E0"}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v, name) => [
            `${v} (${Math.round((Number(v) / total) * 100)}%)`,
            String(name).replace("_", " ").toLowerCase().replace(/^\w/, c => c.toUpperCase()),
          ]}
        />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          iconType="circle"
          iconSize={8}
          formatter={(value) =>
            String(value).replace(/_/g, " ").toLowerCase().replace(/^\w/, c => c.toUpperCase())
          }
          wrapperStyle={{
            fontSize: "11px",
            fontFamily: "var(--font-body, sans-serif)",
            color: SLATE,
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="h-55 flex items-center justify-center">
      <p className="font-body text-slate/40 text-sm italic">{label}</p>
    </div>
  );
}
