"use client";
// components/habits/MotivationalBanner.tsx
// Displays a rotating motivational quote at the top of the page.
// The quote cycles through all content stored across the user's habits.

import { useState, useEffect, useCallback } from "react";
import type { Habit } from "@/types/habits";

interface MotivationalBannerProps {
  habits: Habit[];
}

// ── Fallback quotes shown before user has habits ─────────────
const SEED_QUOTES = [
  { text: "We are what we repeatedly do. Excellence is not an act, but a habit.", source: "Aristotle" },
  { text: "I can do all this through him who gives me strength.", source: "Philippians 4:13" },
  { text: "Begin, and the work will be completed.", source: "St. Francis de Sales" },
];

export function MotivationalBanner({ habits }: MotivationalBannerProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [fade, setFade] = useState(true);

  // Build a flat list of all quotes from all habits
  const allQuotes: { text: string; source?: string }[] = habits.flatMap((h) =>
    h.motivationalContent.map((q) => {
      const dashIdx = q.lastIndexOf(" — ");
      return dashIdx !== -1
        ? { text: q.slice(0, dashIdx), source: q.slice(dashIdx + 3) }
        : { text: q };
    })
  );

  const quotes = allQuotes.length > 0 ? allQuotes : SEED_QUOTES;

  const cycleQuote = useCallback(() => {
    setFade(false);
    setTimeout(() => {
      setCurrentIdx((i) => (i + 1) % quotes.length);
      setFade(true);
    }, 400);
  }, [quotes.length]);

  // Auto-cycle every 12 seconds
  useEffect(() => {
    const id = setInterval(cycleQuote, 12000);
    return () => clearInterval(id);
  }, [cycleQuote]);

  const quote = quotes[currentIdx];

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-secondary/40 px-6 py-5 mb-8">
      {/* Decorative quotation mark */}
      <span
        className="absolute -top-3 left-4 text-8xl leading-none text-primary/10 select-none font-serif"
        aria-hidden
      >
        &ldquo;
      </span>

      <div
        className="relative z-10 transition-opacity duration-400"
        style={{ opacity: fade ? 1 : 0 }}
      >
        <p className="font-serif text-base italic text-foreground/90 leading-relaxed">
          {quote.text}
        </p>
        {quote.source && (
          <p className="mt-2 text-sm text-muted-foreground font-medium tracking-wide">
            — {quote.source}
          </p>
        )}
      </div>

      {/* Next quote button */}
      <button
        onClick={cycleQuote}
        className="absolute bottom-3 right-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Next quote"
      >
        next ›
      </button>

      {/* Dot indicators */}
      {quotes.length > 1 && (
        <div className="flex gap-1 mt-4">
          {quotes.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setFade(false);
                setTimeout(() => { setCurrentIdx(i); setFade(true); }, 400);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIdx ? "w-5 bg-primary" : "w-1.5 bg-border"
              }`}
              aria-label={`Quote ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
