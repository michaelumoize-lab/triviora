// app/api/habits/[id]/complete/route.ts
// POST   — mark today's habit as complete; updates streak; fetches new Groq quote
// DELETE — unmark today's completion; decrements streak

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { fetchMotivationalContent, formatMotivational } from "@/lib/groq";
import type { MotivationalType } from "@/types/habits";

type Params = { params: { id: string } };

function toMidnightUTC(d: Date = new Date()): Date {
  const copy = new Date(d);
  copy.setUTCHours(0, 0, 0, 0);
  return copy;
}

// ── POST — mark complete ──────────────────────────────────────
export async function POST(req: NextRequest, { params }: Params) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const today = toMidnightUTC();

  const habit = await prisma.habit.findFirst({
    where: { id: params.id, userId },
    include: {
      completions: { where: { date: { gte: today } }, take: 1 },
    },
  });

  if (!habit) {
    return NextResponse.json({ error: "Habit not found" }, { status: 404 });
  }

  // Already completed today — return early with current state
  if (habit.completions.length > 0) {
    return NextResponse.json({
      habit: { ...habit, completions: undefined, completedToday: true },
      alreadyDone: true,
    });
  }

  // ── Streak logic ─────────────────────────────────────────
  // Check if yesterday was completed to continue a streak
  const yesterday = toMidnightUTC();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);

  const yesterdayCompletion = await prisma.habitCompletion.findFirst({
    where: {
      habitId: params.id,
      date: { gte: yesterday, lt: today },
    },
  });

  const newStreak = yesterdayCompletion ? habit.streak + 1 : 1;

  // ── Groq: fetch fresh motivational quote ─────────────────
  // Determine content type from the request body (optional)
  let contentType: MotivationalType = "bible_verse";
  try {
    const body = await req.json();
    contentType = body?.contentType ?? "bible_verse";
  } catch {
    // no body — use default
  }

  const motivational = await fetchMotivationalContent(habit.name, contentType);
  const newQuote = formatMotivational(motivational);

  // ── DB transaction: create completion + update streak ────
  const [, updatedHabit] = await prisma.$transaction([
    prisma.habitCompletion.create({
      data: { habitId: params.id, userId, date: today },
    }),
    prisma.habit.update({
      where: { id: params.id },
      data: {
        streak: newStreak,
        // Append new quote to the motivationalContent array (keep last 10)
        motivationalContent:
          habit.motivationalContent.length < 10
            ? [...habit.motivationalContent, newQuote]
            : [...habit.motivationalContent.slice(1), newQuote],
      },
    }),
  ]);

  return NextResponse.json({
    habit: { ...updatedHabit, completedToday: true },
    motivational,
    streak: newStreak,
  });
}

// ── DELETE — unmark completion ────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const today = toMidnightUTC();

  const habit = await prisma.habit.findFirst({
    where: { id: params.id, userId },
  });
  if (!habit) {
    return NextResponse.json({ error: "Habit not found" }, { status: 404 });
  }

  // Remove today's completion record
  await prisma.habitCompletion.deleteMany({
    where: { habitId: params.id, userId, date: { gte: today } },
  });

  // Safely decrement streak (floor at 0)
  const updatedHabit = await prisma.habit.update({
    where: { id: params.id },
    data: { streak: Math.max(0, habit.streak - 1) },
  });

  return NextResponse.json({
    habit: { ...updatedHabit, completedToday: false },
  });
}
