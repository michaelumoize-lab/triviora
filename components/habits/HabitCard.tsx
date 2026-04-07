"use client";
// components/habits/HabitCard.tsx
// Renders a single habit with: name, description, frequency badge, streak,
// completion checkbox, motivational quote reveal, and edit/delete actions.

import { useState } from "react";
import type { Habit } from "@/types/habits";

interface HabitCardProps {
  habit: Habit;
  onComplete: (id: string, done: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (habit: Habit) => void;
  /** Motivational content returned after completing the habit */
  completionQuote?: { content: string; source?: string } | null;
}

const FREQUENCY_LABELS: Record<string, string> = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
};

const FREQUENCY_COLORS: Record<string, string> = {
  DAILY: "bg-secondary text-secondary-foreground",
  WEEKLY: "bg-accent text-accent-foreground",
  MONTHLY: "bg-muted text-muted-foreground",
};

/** Returns emoji + label for a streak count */
function streakLabel(streak: number): { emoji: string; label: string } {
  if (streak === 0) return { emoji: "○", label: "Start your streak!" };
  if (streak < 3)
    return { emoji: "🔥", label: `${streak} day${streak > 1 ? "s" : ""}` };
  if (streak < 7) return { emoji: "🔥", label: `${streak} days` };
  if (streak < 30) return { emoji: "⚡", label: `${streak} days` };
  return { emoji: "🏆", label: `${streak} days` };
}

export function HabitCard({
  habit,
  onComplete,
  onDelete,
  onEdit,
  completionQuote,
}: HabitCardProps) {
  const [loading, setLoading] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { emoji, label } = streakLabel(habit.streak);

  // Last stored motivational quote for this habit
  const lastQuote = habit.motivationalContent.at(-1);
  const displayQuote = completionQuote
    ? `${completionQuote.content}${completionQuote.source ? ` — ${completionQuote.source}` : ""}`
    : lastQuote;

  async function handleCheck() {
    setLoading(true);
    await onComplete(habit.id, !habit.completedToday);
    if (!habit.completedToday) setShowQuote(true); // reveal quote on completion
    setLoading(false);
  }

  return (
    <div
      className={`group relative rounded-xl border transition-all duration-300 ${
        habit.completedToday
          ? "border-primary/30 bg-secondary/20"
          : "border-border bg-card hover:border-border/80 hover:shadow-sm"
      }`}
    >
      <div className="p-5">
        {/* ── Header row ────────────────────────────────── */}
        <div className="flex items-start gap-4">
          {/* Completion checkbox */}
          <button
            onClick={handleCheck}
            disabled={loading}
            aria-label={
              habit.completedToday ? "Mark incomplete" : "Mark complete"
            }
            className={`mt-0.5 flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              habit.completedToday
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input hover:border-primary"
            } ${loading ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
          >
            {habit.completedToday && (
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </button>

          {/* Name + description */}
          <div className="flex-1 min-w-0">
            <h3
              className={`font-semibold text-base leading-snug transition-colors ${
                habit.completedToday
                  ? "line-through text-muted-foreground"
                  : "text-foreground"
              }`}
            >
              {habit.name}
            </h3>
            {habit.description && (
              <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
                {habit.description}
              </p>
            )}
          </div>

          {/* Edit / Delete actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(habit)}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Edit habit"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            {confirmDelete ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={async () => {
                    await onDelete(habit.id);
                    setConfirmDelete(false);
                  }}
                  className="px-2 py-1 text-xs rounded bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity"
                >
                  Delete
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                aria-label="Delete habit"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* ── Meta row: frequency + streak ─────────────── */}
        <div className="mt-3 flex items-center gap-3 pl-10">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${FREQUENCY_COLORS[habit.frequency]}`}
          >
            {FREQUENCY_LABELS[habit.frequency]}
          </span>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <span>{emoji}</span>
            <span>{label}</span>
          </span>
          {habit.streak >= 7 && (
            <span className="text-xs text-primary font-medium">
              {habit.streak >= 30
                ? "Legend!"
                : habit.streak >= 14
                  ? "On fire!"
                  : "Great streak!"}
            </span>
          )}
        </div>

        {/* ── Streak progress bar (toward next milestone) ─ */}
        {habit.streak > 0 && (
          <div className="mt-3 pl-10">
            <StreakProgress streak={habit.streak} />
          </div>
        )}

        {/* ── Motivational quote reveal on completion ────── */}
        {habit.completedToday && displayQuote && (
          <div className="mt-4 pl-10">
            <button
              onClick={() => setShowQuote((s) => !s)}
              className="text-xs text-primary hover:text-primary/80 font-medium transition-colors flex items-center gap-1"
            >
              <span>{showQuote ? "▾" : "▸"}</span>
              <span>{showQuote ? "Hide" : "Show"} today&apos;s verse</span>
            </button>
            {showQuote && (
              <div className="mt-2 rounded-lg bg-secondary/40 border border-border px-4 py-3 animate-in slide-in-from-top-1 duration-200">
                <QuoteDisplay raw={displayQuote} />
              </div>
            )}
          </div>
        )}

        {/* ── Personal notes for this habit ─────────────── */}
        {habit.notes && (
          <p className="mt-3 pl-10 text-xs text-muted-foreground italic border-l-2 border-border pl-3 ml-10">
            {habit.notes}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────

/** Progress bar toward the next milestone (7, 14, 30, 60, 100) */
function StreakProgress({ streak }: { streak: number }) {
  const milestones = [7, 14, 30, 60, 100];
  const next = milestones.find((m) => m > streak) ?? 100;
  const prev = milestones[milestones.indexOf(next) - 1] ?? 0;
  const pct = Math.min(((streak - prev) / (next - prev)) * 100, 100);

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {streak}/{next}d
      </span>
    </div>
  );
}

/** Splits a raw "quote — source" string and renders it nicely */
function QuoteDisplay({ raw }: { raw: string }) {
  const dashIdx = raw.lastIndexOf(" — ");
  const text = dashIdx !== -1 ? raw.slice(0, dashIdx) : raw;
  const source = dashIdx !== -1 ? raw.slice(dashIdx + 3) : null;

  return (
    <>
      <p className="font-serif text-sm italic text-foreground/90 leading-relaxed">
        &quot;{text}&quot;
      </p>
      {source && (
        <p className="mt-1.5 text-xs text-muted-foreground font-medium">
          — {source}
        </p>
      )}
    </>
  );
}
