// app/api/habits/route.ts
// GET  /api/habits  — list all habits for the authenticated user
// POST /api/habits  — create a new habit (triggers Groq for initial content)

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { fetchMotivationalContent, formatMotivational } from "@/lib/groq";
import type { MotivationalType } from "@/types/habits";

// Helper: normalize any Date to midnight UTC (for day-level uniqueness)
function toMidnightUTC(d: Date = new Date()): Date {
  const copy = new Date(d);
  copy.setUTCHours(0, 0, 0, 0);
  return copy;
}

// ── GET ──────────────────────────────────────────────────────
export async function GET(_req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = toMidnightUTC();

  const habits = await prisma.habit.findMany({
    where: { userId: session.user.id },
    include: {
      // Pull only today's completion to derive completedToday
      completions: {
        where: { date: { gte: today } },
        take: 1,
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const result = habits.map(({ completions, ...habit }) => ({
    ...habit,
    completedToday: completions.length > 0,
  }));

  return NextResponse.json(result);
}

// ── POST ─────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    name,
    description,
    frequency = "DAILY",
    notes,
    contentType = "bible_verse" as MotivationalType,
  } = body;

  if (!name?.trim()) {
    return NextResponse.json(
      { error: "Habit name is required" },
      { status: 400 },
    );
  }

  // Fetch initial motivational content from Groq before saving
  const motivational = await fetchMotivationalContent(name.trim(), contentType);

  const habit = await prisma.habit.create({
    data: {
      userId: session.user.id,
      name: name.trim(),
      description: description?.trim() ?? null,
      frequency,
      notes: notes?.trim() ?? null,
      streak: 0,
      motivationalContent: [formatMotivational(motivational)],
    },
  });

  return NextResponse.json(
    { ...habit, completedToday: false, motivational },
    { status: 201 },
  );
}
// Trigger hot reload
