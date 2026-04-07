// app/habits/page.tsx
// Server component — fetches initial data server-side for fast first paint,
// then passes to the HabitsClient for all interactive behaviour.

import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { HabitsClient } from "@/components/habits/HabitsClient";
import type { Habit, DailyNote } from "@/types/habits";

export const dynamic = "force-dynamic"; // always fresh data

function toMidnightUTC(d: Date = new Date()): Date {
  const copy = new Date(d);
  copy.setUTCHours(0, 0, 0, 0);
  return copy;
}

export default async function HabitsPage() {
  const session = await getServerSession();

  // Redirect unauthenticated users to sign-in
  if (!session?.user) redirect("/sign-in");

  const userId = session.user.id;
  const today = toMidnightUTC();

  // ── Fetch habits with today's completion status ───────────
  const rawHabits = await prisma.habit.findMany({
    where: { userId },
    include: {
      completions: {
        where: { date: { gte: today } },
        take: 1,
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const habits: Habit[] = rawHabits.map(({ completions, ...habit }) => ({
    ...habit,
    completedToday: completions.length > 0,
    createdAt: habit.createdAt.toISOString(),
    updatedAt: habit.updatedAt.toISOString(),
    description: habit.description ?? null,
    notes: habit.notes ?? null,
    frequency: habit.frequency as Habit["frequency"],
  }));

  // ── Fetch today's daily note ──────────────────────────────
  const rawNote = await prisma.dailyNote.findFirst({
    where: { userId, date: today },
  });

  const dailyNote: DailyNote | null = rawNote
    ? {
        id: rawNote.id,
        content: rawNote.content,
        date: rawNote.date.toISOString(),
        createdAt: rawNote.createdAt.toISOString(),
      }
    : null;

  const userName = session.user.name ?? session.user.email ?? "Friend";

  return (
    <HabitsClient
      initialHabits={habits}
      initialDailyNote={dailyNote}
      userName={userName}
    />
  );
}
