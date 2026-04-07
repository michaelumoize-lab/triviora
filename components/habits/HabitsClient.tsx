"use client";
// components/habits/HabitsClient.tsx
// The main client-side orchestrator for the habit tracker page.
// Manages all local state, API calls, notifications, and renders sub-sections.

import { useState, useEffect, useCallback } from "react";
import { MotivationalBanner } from "./MotivationalBanner";
import { HabitCard } from "./HabitCard";
import { AddHabitModal } from "./AddHabitModal";
import { DailyNoteSection } from "./DailyNoteSection";
import { AnalyticsSection } from "./AnalyticsSection";
import { GamificationSection } from "./GamificationSection";
import type {
  Habit,
  DailyNote,
  CreateHabitPayload,
  MotivationalContent,
} from "@/types/habits";

// ── Types ────────────────────────────────────────────────────
type Tab = "habits" | "analytics" | "gamification";

interface CompletionQuoteMap {
  [habitId: string]: { content: string; source?: string } | null;
}

interface HabitsClientProps {
  initialHabits: Habit[];
  initialDailyNote: DailyNote | null;
  userName: string;
}

// ── Tab config ───────────────────────────────────────────────
const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "habits", label: "Habits", icon: "✦" },
  { id: "analytics", label: "Analytics", icon: "📈" },
  { id: "gamification", label: "Rewards", icon: "🏆" },
];

// ── Example seed habits (shown when the user has no habits yet) ──
const EXAMPLE_HABITS: Habit[] = [
  {
    id: "example-1",
    name: "Morning Prayer",
    description: "Start the day in conversation with God",
    motivationalContent: [
      "Rejoice always, pray continually, give thanks in all circumstances. — 1 Thessalonians 5:16-18",
    ],
    frequency: "DAILY",
    streak: 5,
    notes:
      "Spend at least 10 minutes in quiet prayer before checking my phone.",
    completedToday: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "example-2",
    name: "Scripture Reading",
    description: "Read one chapter of the Bible each day",
    motivationalContent: [
      "Your word is a lamp for my feet, a light on my path. — Psalm 119:105",
    ],
    frequency: "DAILY",
    streak: 12,
    notes: "Currently reading through the Gospel of John.",
    completedToday: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function HabitsClient({
  initialHabits,
  initialDailyNote,
  userName,
}: HabitsClientProps) {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [activeTab, setActiveTab] = useState<Tab>("habits");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [completionQuotes, setCompletionQuotes] = useState<CompletionQuoteMap>(
    {},
  );
  const [notifPermission, setNotifPermission] =
    useState<NotificationPermission>("default");

  // Use example habits if the user hasn't created any yet
  const displayHabits = habits.length === 0 ? EXAMPLE_HABITS : habits;
  const isShowingExamples = habits.length === 0;

  // ── Request notification permission on mount ─────────────
  useEffect(() => {
    if ("Notification" in window) {
      //eslint-disable-next-line
      setNotifPermission(Notification.permission);
    }
  }, []);

  // ── Schedule notifications for incomplete habits ──────────
  useEffect(() => {
    if (notifPermission !== "granted") return;
    const incomplete = habits.filter(
      (h) => !h.completedToday && h.frequency === "DAILY",
    );
    if (incomplete.length === 0) return;

    // Notify 5 seconds after mount (in production: use a background worker / cron)
    const id = setTimeout(() => {
      new Notification("Triviora — Habit Reminder 🔔", {
        body: `You have ${incomplete.length} habit${incomplete.length > 1 ? "s" : ""} left to complete today.`,
        icon: "/favicon.ico",
      });
    }, 5000);

    return () => clearTimeout(id);
  }, [habits, notifPermission]);

  // ── Request notification permission ──────────────────────
  async function requestNotifications() {
    if (!("Notification" in window)) return;
    const perm = await Notification.requestPermission();
    setNotifPermission(perm);
  }

  // ── Create habit ─────────────────────────────────────────
  const handleCreate = useCallback(async (payload: CreateHabitPayload) => {
    const res = await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create habit");
    const data = await res.json();
    setHabits((prev) => [...prev, { ...data, completedToday: false }]);
  }, []);

  // ── Update habit ─────────────────────────────────────────
  const handleUpdate = useCallback(
    async (id: string, payload: Partial<CreateHabitPayload>) => {
      const res = await fetch(`/api/habits/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update habit");
      const data = await res.json();
      setHabits((prev) =>
        prev.map((h) => (h.id === id ? { ...h, ...data } : h)),
      );
    },
    [],
  );

  // ── Delete habit ─────────────────────────────────────────
  const handleDelete = useCallback(async (id: string) => {
    const res = await fetch(`/api/habits/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete habit");
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }, []);

  // ── Toggle habit completion ───────────────────────────────
  const handleComplete = useCallback(async (id: string, done: boolean) => {
    const method = done ? "POST" : "DELETE";
    const res = await fetch(`/api/habits/${id}/complete`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: done ? JSON.stringify({ contentType: "bible_verse" }) : undefined,
    });
    if (!res.ok) throw new Error("Failed to toggle completion");
    const data = await res.json();

    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...data.habit } : h)),
    );

    // Store the completion quote for this habit
    if (done && data.motivational) {
      setCompletionQuotes((prev) => ({
        ...prev,
        [id]: {
          content: data.motivational.content,
          source: data.motivational.source,
        },
      }));
    } else {
      setCompletionQuotes((prev) => ({ ...prev, [id]: null }));
    }
  }, []);

  // ── Stats for header ──────────────────────────────────────
  const completedCount = displayHabits.filter((h) => h.completedToday).length;
  const totalCount = displayHabits.length;
  const allDone = totalCount > 0 && completedCount === totalCount;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* ── Page header ─────────────────────────────────── */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground leading-tight">
              {greeting()}, {userName.split(" ")[0]} 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {allDone
                ? "All habits complete! Wonderful day. 🎉"
                : `${completedCount} of ${totalCount} habit${totalCount !== 1 ? "s" : ""} done today`}
            </p>
          </div>

          {/* Add habit button */}
          <button
            onClick={() => {
              setEditingHabit(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
          >
            <span className="text-base leading-none">+</span>
            <span>New Habit</span>
          </button>
        </div>

        {/* ── Notification permission prompt ───────────────── */}
        {notifPermission === "default" && (
          <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/20 px-4 py-3 text-sm">
            <p className="text-foreground">
              <span className="mr-1">🔔</span> Get daily habit reminders?
            </p>
            <button
              onClick={requestNotifications}
              className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
            >
              Enable
            </button>
          </div>
        )}

        {/* ── Motivational banner ──────────────────────────── */}
        <MotivationalBanner habits={displayHabits} />

        {/* ── Tab navigation ───────────────────────────────── */}
        <div className="flex rounded-xl border border-border bg-muted/40 p-1 gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── Tab content ──────────────────────────────────── */}
        {activeTab === "habits" && (
          <div className="space-y-6">
            {/* Example habits notice */}
            {isShowingExamples && (
              <div className="rounded-xl border border-secondary bg-secondary/20 px-4 py-3 text-sm text-secondary-foreground">
                <strong>Welcome!</strong> These are example habits to show you
                the layout.{" "}
                <button
                  onClick={() => {
                    setEditingHabit(null);
                    setModalOpen(true);
                  }}
                  className="underline font-medium"
                >
                  Create your first habit
                </button>{" "}
                to get started.
              </div>
            )}

            {/* Today's progress bar */}
            {totalCount > 0 && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Today&apos;s progress</span>
                  <span>
                    {Math.round((completedCount / totalCount) * 100)}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-700"
                    style={{ width: `${(completedCount / totalCount) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Habit list */}
            <div className="space-y-3">
              {displayHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onComplete={
                    isShowingExamples ? async () => {} : handleComplete
                  }
                  onDelete={isShowingExamples ? async () => {} : handleDelete}
                  onEdit={
                    isShowingExamples
                      ? () => {}
                      : (h) => {
                          setEditingHabit(h);
                          setModalOpen(true);
                        }
                  }
                  completionQuote={completionQuotes[habit.id]}
                />
              ))}
            </div>

            {/* Daily review note */}
            <DailyNoteSection initialNote={initialDailyNote} />
          </div>
        )}

        {activeTab === "analytics" && (
          <AnalyticsSection habits={displayHabits} />
        )}

        {activeTab === "gamification" && (
          <GamificationSection habits={displayHabits} />
        )}
      </div>

      {/* ── Add/Edit modal ───────────────────────────────── */}
      <AddHabitModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingHabit(null);
        }}
        onSave={handleCreate}
        editingHabit={editingHabit}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
