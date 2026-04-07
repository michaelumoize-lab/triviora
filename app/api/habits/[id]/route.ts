// app/api/habits/[id]/route.ts
// PUT    /api/habits/[id]  — update a habit's fields
// DELETE /api/habits/[id]  — delete a habit and all its completions

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

// ── PUT ───────────────────────────────────────────────────────
export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify the habit belongs to this user
  const existing = await prisma.habit.findFirst({
    where: { id: params.id, userId: session.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Habit not found" }, { status: 404 });
  }

  const body = await req.json();
  const { name, description, frequency, notes } = body;

  const updated = await prisma.habit.update({
    where: { id: params.id },
    data: {
      ...(name?.trim() && { name: name.trim() }),
      ...(description !== undefined && {
        description: description?.trim() ?? null,
      }),
      ...(frequency && { frequency }),
      ...(notes !== undefined && { notes: notes?.trim() ?? null }),
    },
  });

  return NextResponse.json({ ...updated, completedToday: existing.streak > 0 });
}

// ── DELETE ────────────────────────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.habit.findFirst({
    where: { id: params.id, userId: session.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Habit not found" }, { status: 404 });
  }

  // Cascade delete removes completions automatically (defined in schema)
  await prisma.habit.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
