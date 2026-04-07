"use client";
// components/habits/DailyNoteSection.tsx
// A textarea to write a personalized daily review note.
// Auto-saves with a 1.5 second debounce after the user stops typing.

import { useState, useEffect, useRef, useCallback } from "react";
import type { DailyNote } from "@/types/habits";

interface DailyNoteSectionProps {
  initialNote: DailyNote | null;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

const PROMPTS = [
  "What went well with your habits today?",
  "What challenged you today, and how did you respond?",
  "What are you grateful for today?",
  "How did your habits bring you closer to your goals?",
  "What will you do differently tomorrow?",
];

export function DailyNoteSection({ initialNote }: DailyNoteSectionProps) {
  const [content, setContent] = useState(initialNote?.content ?? "");
  const [status, setSaveStatus] = useState<SaveStatus>("idle");
  const [promptIdx, setPromptIdx] = useState(0);
  const [today, setToday] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  useEffect(() => {
    setPromptIdx(Math.floor(Math.random() * PROMPTS.length));
    setToday(new Date().toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric", year: "numeric",
    }));
  }, []);

  // ── Auto-save with debounce ─────────────────────────────
  const save = useCallback(async (text: string) => {
    if (!text.trim()) return;
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/daily-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      if (!res.ok) throw new Error();
      setSaveStatus("saved");
      // Reset to idle after 2 seconds
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      setSaveStatus("error");
    }
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    setContent(val);
    setSaveStatus("idle");

    // Debounce: save 1.5s after the user stops typing
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => save(val), 1500);
  }

  // Flush on unmount
  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/30">
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <span>📓</span> Daily Review
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">{today}</p>
        </div>

        {/* Save status indicator */}
        <div className="text-xs font-medium">
          {status === "saving" && (
            <span className="text-muted-foreground flex items-center gap-1.5">
              <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Saving…
            </span>
          )}
          {status === "saved" && <span className="text-primary">✓ Saved</span>}
          {status === "error" && <span className="text-destructive">Save failed</span>}
        </div>
      </div>

      {/* Prompt */}
      <div className="px-5 pt-4">
        <p className="text-xs italic text-muted-foreground font-serif">
          {PROMPTS[promptIdx]}
        </p>
      </div>

      {/* Textarea */}
      <div className="p-5 pt-2">
        <textarea
          value={content}
          onChange={handleChange}
          placeholder="Write your thoughts for today…"
          rows={6}
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition resize-none leading-relaxed font-serif"
        />

        {/* Footer: word count + manual save */}
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {wordCount} {wordCount === 1 ? "word" : "words"}
          </p>
          <button
            onClick={() => save(content)}
            disabled={status === "saving" || !content.trim()}
            className="text-xs px-3 py-1.5 rounded-lg border border-input bg-background text-muted-foreground hover:text-foreground hover:border-ring disabled:opacity-40 transition-colors"
          >
            Save now
          </button>
        </div>
      </div>
    </div>
  );
}
