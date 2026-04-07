// app/api/daily-notes/route.ts
// GET  /api/daily-notes         — fetch today's note for the authenticated user
// POST /api/daily-notes         — create or update today's note (upsert)
// GET  /api/daily-notes?all=1   — fetch last 7 days of notes

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";

function toMidnightUTC(d: Date = new Date()): Date {
  const copy = new Date(d);
  copy.setUTCHours(0, 0, 0, 0);
  return copy;
}

// ── GET ───────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const url = new URL(req.url);

  if (url.searchParams.get("all") === "1") {
    // Return last 7 days of notes
    const weekAgo = toMidnightUTC();
    weekAgo.setUTCDate(weekAgo.getUTCDate() - 6);

    const notes = await prisma.dailyNote.findMany({
      where: { userId, date: { gte: weekAgo } },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(notes);
  }

  // Default: just today's note
  const today = toMidnightUTC();
  const note = await prisma.dailyNote.findFirst({
    where: { userId, date: today },
  });

  return NextResponse.json(note ?? null);
}

// ── POST ──────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { content } = await req.json();

  if (!content?.trim()) {
    return NextResponse.json(
      { error: "Content cannot be empty" },
      { status: 400 },
    );
  }

  const today = toMidnightUTC();

  // Upsert: one note per user per day
  const note = await prisma.dailyNote.upsert({
    where: { userId_date: { userId, date: today } },
    create: { userId, content: content.trim(), date: today },
    update: { content: content.trim() },
  });

  return NextResponse.json(note, { status: 200 });
}
