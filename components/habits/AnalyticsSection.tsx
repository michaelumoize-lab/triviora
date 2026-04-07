"use client";
// components/habits/AnalyticsSection.tsx
// Displays habit completion history using Recharts.
// Requires: npm install recharts

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  Area,
  AreaChart,
  Legend,
} from "recharts";
import type { AnalyticsDay, Habit } from "@/types/habits";

interface AnalyticsSectionProps {
  habits: Habit[];
}

// ── Custom Tooltip ───────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md text-sm">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="text-xs">
          {p.name}: {p.value}
          {p.name === "Rate" ? "%" : ""}
        </p>
      ))}
    </div>
  );
}

export function AnalyticsSection({ habits }: AnalyticsSectionProps) {
  const [data, setData] = useState<AnalyticsDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState<7 | 14 | 30>(14);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const res = await fetch(`/api/habits/analytics?days=${days}`);
        const json = await res.json();
        setData(json.days ?? []);
      } catch {
        console.error("Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [days]);

  // ── Derived stats ─────────────────────────────────────────
  const totalCompletions = data.reduce((s, d) => s + d.completed, 0);
  const avgRate = data.length
    ? Math.round(data.reduce((s, d) => s + d.rate, 0) / data.length)
    : 0;
  const bestDay = data.reduce(
    (best, d) => (d.rate > (best?.rate ?? -1) ? d : best),
    data[0],
  );
  const topStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);

  // Last N days (trim for small screens)
  const chartData = data.slice(-days);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Stat cards ──────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Total Completions"
          value={String(totalCompletions)}
          icon="✅"
        />
        <StatCard label="Avg. Rate" value={`${avgRate}%`} icon="📈" />
        <StatCard
          label="Best Day"
          value={bestDay?.date ?? "—"}
          sub={`${bestDay?.rate ?? 0}%`}
          icon="⭐"
        />
        <StatCard label="Top Streak" value={`${topStreak}d`} icon="🔥" />
      </div>

      {/* ── Period toggle ────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Completion History
        </h3>
        <div className="flex rounded-lg border border-border overflow-hidden text-xs font-medium">
          {([7, 14, 30] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 transition-colors ${
                days === d
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* ── Bar chart: completions per day ───────────────── */}
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-xs text-muted-foreground mb-3">
          Habits completed per day
        </p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart
            data={chartData}
            barSize={habits.length > 0 ? 14 : 8}
            margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              interval={days > 14 ? 4 : 1}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="completed"
              name="Completed"
              fill="var(--primary)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="total"
              name="Total"
              fill="var(--border)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Area chart: completion rate % over time ────── */}
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-xs text-muted-foreground mb-3">
          Completion rate (%)
        </p>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart
            data={chartData}
            margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
          >
            <defs>
              <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--primary)"
                  stopOpacity={0.25}
                />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              interval={days > 14 ? 4 : 1}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="rate"
              name="Rate"
              stroke="var(--primary)"
              strokeWidth={2}
              fill="url(#rateGrad)"
              dot={false}
              activeDot={{ r: 4, fill: "var(--primary)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Per-habit streaks ────────────────────────────── */}
      {habits.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-3">Current streaks</p>
          <div className="space-y-3">
            {habits
              .sort((a, b) => b.streak - a.streak)
              .map((h) => {
                const pct = Math.min(
                  (h.streak / Math.max(topStreak, 1)) * 100,
                  100,
                );
                return (
                  <div key={h.id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-foreground font-medium truncate max-w-[60%]">
                        {h.name}
                      </span>
                      <span className="text-muted-foreground">{h.streak}d</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── StatCard ─────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3 space-y-1">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{label}</p>
        <span className="text-base">{icon}</span>
      </div>
      <p className="text-xl font-bold text-foreground leading-none">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}
