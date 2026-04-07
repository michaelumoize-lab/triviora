// types/habits.ts
// Shared types used across frontend components and API routes.

export type Frequency = "DAILY" | "WEEKLY" | "MONTHLY";
export type MotivationalType = "bible_verse" | "saint_quote" | "inspirational";

export interface MotivationalContent {
  type: MotivationalType;
  content: string;
  source?: string;
}

export interface Habit {
  id: string;
  name: string;
  description?: string | null;
  motivationalContent: string[];
  frequency: Frequency;
  streak: number;
  notes?: string | null;
  completedToday: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DailyNote {
  id: string;
  content: string;
  date: string;
  createdAt: string;
}

/** One day's completion summary across all habits */
export interface AnalyticsDay {
  date: string; // "Mon", "Tue", … or "Jan 1" etc.
  completed: number;
  total: number;
  rate: number; // 0–100 percentage
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  earned: boolean;
  requirement: number; // streak days required
}

export interface CreateHabitPayload {
  name: string;
  description?: string;
  frequency?: Frequency;
  notes?: string;
  contentType?: MotivationalType;
}
