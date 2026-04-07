"use client";
// components/habits/GamificationSection.tsx
// Displays badges, total points, and achievement progress.

import type { Habit } from "@/types/habits";

interface GamificationSectionProps {
  habits: Habit[];
}

interface BadgeDef {
  id: string;
  emoji: string;
  name: string;
  description: string;
  /** Called with the habits array to determine if earned */
  check: (habits: Habit[]) => boolean;
  /** 0–100 progress toward earning */
  progress: (habits: Habit[]) => number;
}

// ── Badge definitions ────────────────────────────────────────
const BADGE_DEFINITIONS: BadgeDef[] = [
  {
    id: "first_step",
    emoji: "🌱",
    name: "First Step",
    description: "Create your first habit",
    check: (h) => h.length > 0,
    progress: (h) => (h.length > 0 ? 100 : 0),
  },
  {
    id: "daily_win",
    emoji: "✨",
    name: "Daily Win",
    description: "Complete a habit today",
    check: (h) => h.some((x) => x.completedToday),
    progress: (h) => (h.some((x) => x.completedToday) ? 100 : 0),
  },
  {
    id: "triple_habit",
    emoji: "🎯",
    name: "Triple Threat",
    description: "Track 3 or more habits",
    check: (h) => h.length >= 3,
    progress: (h) => Math.min((h.length / 3) * 100, 100),
  },
  {
    id: "week_streak",
    emoji: "🔥",
    name: "On Fire",
    description: "Reach a 7-day streak on any habit",
    check: (h) => h.some((x) => x.streak >= 7),
    progress: (h) => Math.min((Math.max(...h.map((x) => x.streak), 0) / 7) * 100, 100),
  },
  {
    id: "fortnight",
    emoji: "⚡",
    name: "Fortnight",
    description: "Reach a 14-day streak on any habit",
    check: (h) => h.some((x) => x.streak >= 14),
    progress: (h) => Math.min((Math.max(...h.map((x) => x.streak), 0) / 14) * 100, 100),
  },
  {
    id: "month_master",
    emoji: "🏆",
    name: "Month Master",
    description: "Maintain a 30-day streak",
    check: (h) => h.some((x) => x.streak >= 30),
    progress: (h) => Math.min((Math.max(...h.map((x) => x.streak), 0) / 30) * 100, 100),
  },
  {
    id: "perfect_day",
    emoji: "🌟",
    name: "Perfect Day",
    description: "Complete ALL habits on a single day",
    check: (h) => h.length > 0 && h.every((x) => x.completedToday),
    progress: (h) => {
      if (h.length === 0) return 0;
      const done = h.filter((x) => x.completedToday).length;
      return Math.round((done / h.length) * 100);
    },
  },
  {
    id: "legend",
    emoji: "👑",
    name: "Legend",
    description: "Reach a 100-day streak",
    check: (h) => h.some((x) => x.streak >= 100),
    progress: (h) => Math.min((Math.max(...h.map((x) => x.streak), 0) / 100) * 100, 100),
  },
];

/** Points calculation: streaks × completions × habits */
function calcPoints(habits: Habit[]): number {
  return habits.reduce((sum, h) => {
    return sum + h.streak * 10 + (h.completedToday ? 25 : 0);
  }, 0);
}

function levelFromPoints(pts: number): { level: number; title: string; nextAt: number } {
  if (pts < 100) return { level: 1, title: "Beginner", nextAt: 100 };
  if (pts < 300) return { level: 2, title: "Apprentice", nextAt: 300 };
  if (pts < 600) return { level: 3, title: "Practitioner", nextAt: 600 };
  if (pts < 1000) return { level: 4, title: "Adept", nextAt: 1000 };
  if (pts < 2000) return { level: 5, title: "Expert", nextAt: 2000 };
  return { level: 6, title: "Master", nextAt: Infinity };
}

export function GamificationSection({ habits }: GamificationSectionProps) {
  const points = calcPoints(habits);
  const { level, title, nextAt } = levelFromPoints(points);
  const levelPct = nextAt === Infinity ? 100 : Math.min((points / nextAt) * 100, 100);

  const badges = BADGE_DEFINITIONS.map((def) => ({
    ...def,
    earned: def.check(habits),
    pct: def.progress(habits),
  }));

  const earnedCount = badges.filter((b) => b.earned).length;
  const topStreak = Math.max(...habits.map((h) => h.streak), 0);

  return (
    <div className="space-y-6">
      {/* ── Level & points card ──────────────────────────── */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Level {level}</p>
            <h3 className="text-2xl font-bold text-foreground mt-0.5">{title}</h3>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary">{points}</p>
            <p className="text-xs text-muted-foreground">points</p>
          </div>
        </div>

        {/* XP progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{points} pts</span>
            <span>{nextAt === Infinity ? "Max level!" : `${nextAt} pts to Level ${level + 1}`}</span>
          </div>
          <div className="h-2.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${levelPct}%` }}
            />
          </div>
        </div>

        {/* Mini stats */}
        <div className="mt-4 grid grid-cols-3 gap-3 text-center border-t border-border pt-4">
          <div>
            <p className="text-lg font-bold text-foreground">{habits.length}</p>
            <p className="text-xs text-muted-foreground">Habits</p>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{topStreak}d</p>
            <p className="text-xs text-muted-foreground">Top Streak</p>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{earnedCount}/{badges.length}</p>
            <p className="text-xs text-muted-foreground">Badges</p>
          </div>
        </div>
      </div>

      {/* ── Badges grid ──────────────────────────────────── */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Achievements</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {badges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      </div>

      {/* ── How points are earned ─────────────────────────── */}
      <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
        <p className="text-xs font-semibold text-foreground mb-2">How to earn points</p>
        <ul className="space-y-1 text-xs text-muted-foreground">
          <li>+25 pts — complete a habit today</li>
          <li>+10 pts — per streak day (per habit)</li>
          <li>Badges — unlock achievements as you grow</li>
        </ul>
      </div>
    </div>
  );
}

// ── BadgeCard ─────────────────────────────────────────────────
function BadgeCard({ badge }: { badge: BadgeDef & { earned: boolean; pct: number } }) {
  return (
    <div
      className={`rounded-xl border p-3 text-center transition-all duration-200 ${
        badge.earned
          ? "border-primary/40 bg-secondary/30"
          : "border-border bg-card opacity-60"
      }`}
    >
      <div className={`text-3xl mb-1.5 transition-all ${badge.earned ? "grayscale-0" : "grayscale opacity-40"}`}>
        {badge.emoji}
      </div>
      <p className="text-xs font-semibold text-foreground leading-tight">{badge.name}</p>
      <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{badge.description}</p>

      {/* Progress bar for unearned badges */}
      {!badge.earned && badge.pct > 0 && (
        <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary/60 transition-all duration-500"
            style={{ width: `${badge.pct}%` }}
          />
        </div>
      )}
      {badge.earned && (
        <p className="mt-1.5 text-[10px] font-medium text-primary">Earned ✓</p>
      )}
    </div>
  );
}
