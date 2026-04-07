// app/api/habits/analytics/route.ts
// GET /api/habits/analytics?days=30
// Returns per-day completion stats for the last N days.

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import type { AnalyticsDay } from "@/types/habits";

function toMidnightUTC(d: Date = new Date()): Date {
  const copy = new Date(d);
  copy.setUTCHours(0, 0, 0, 0);
  return copy;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // Parse ?days query param (default 30, max 90)
  const url = new URL(req.url);
  const days = Math.min(parseInt(url.searchParams.get("days") ?? "30", 10), 90);

  // Build date range: [startDate, today]
  const today = toMidnightUTC();
  const startDate = new Date(today);
  startDate.setUTCDate(startDate.getUTCDate() - (days - 1));

  // Total habits count
  const totalHabits = await prisma.habit.count({ where: { userId } });

  // All completions in the date range
  const completions = await prisma.habitCompletion.findMany({
    where: {
      userId,
      date: { gte: startDate, lte: today },
    },
    select: { date: true },
  });

  // Group completions by date string (YYYY-MM-DD)
  const countByDate: Record<string, number> = {};
  for (const c of completions) {
    const key = c.date.toISOString().slice(0, 10);
    countByDate[key] = (countByDate[key] ?? 0) + 1;
  }

  // Build a full array of days (fills in 0 for days with no completions)
  const result: AnalyticsDay[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate);
    d.setUTCDate(d.getUTCDate() + i);
    const key = d.toISOString().slice(0, 10);
    const completed = countByDate[key] ?? 0;
    const total = totalHabits;

    result.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      completed,
      total,
      rate: total > 0 ? Math.round((completed / total) * 100) : 0,
    });
  }

  return NextResponse.json({ days: result, totalHabits });
}
