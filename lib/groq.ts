// lib/groq.ts
// Handles all communication with the Groq API.
// The Groq API is OpenAI-compatible — base URL differs, model names differ.

import type { MotivationalContent, MotivationalType } from "@/types/habits";

const GROQ_API_KEY = process.env.GROQ_API_KEY!;
const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
const GROQ_MODEL = "llama-3.3-70b-versatile";

// ── System prompt to keep responses on-brand ────────────────
const SYSTEM_PROMPT = `You are a spiritual and motivational assistant for a habit-tracking app called Triviora.
Your tone is warm, encouraging, and faith-filled. Always respond with ONLY a valid JSON object — 
no markdown fences, no extra text, just the raw JSON.`;

// ── Per-type user prompts ────────────────────────────────────
function buildPrompt(habitName: string, type: MotivationalType): string {
  switch (type) {
    case "bible_verse":
      return `Generate one short, encouraging Bible verse (NIV translation) that relates to building the habit of "${habitName}".
Return ONLY: {"content": "full verse text", "source": "Book Chapter:Verse"}`;

    case "saint_quote":
      return `Generate one authentic, well-known quote from a Catholic saint that relates to building the habit of "${habitName}".
Return ONLY: {"content": "quote text", "source": "Saint Name"}`;

    case "inspirational":
      return `Generate one short, powerful motivational quote (not scripture) that relates to building the habit of "${habitName}".
Return ONLY: {"content": "quote text", "source": "Author Name or 'Unknown'"}`;
  }
}

// ── Main export ──────────────────────────────────────────────
export async function fetchMotivationalContent(
  habitName: string,
  type: MotivationalType = "bible_verse"
): Promise<MotivationalContent> {
  try {
    const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildPrompt(habitName, type) },
        ],
        max_tokens: 200,
        temperature: 0.75,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API responded with status ${response.status}`);
    }

    const data = await response.json();
    const rawText: string = data.choices?.[0]?.message?.content ?? "{}";

    // Strip any accidental markdown fences the model might add
    const clean = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return {
      type,
      content: parsed.content ?? getFallback(type).content,
      source: parsed.source ?? undefined,
    };
  } catch (err) {
    console.error("[groq] fetchMotivationalContent failed:", err);
    return getFallback(type);
  }
}

// ── Fallback content used when the API is unavailable ────────
function getFallback(type: MotivationalType): MotivationalContent {
  const fallbacks: Record<MotivationalType, MotivationalContent> = {
    bible_verse: {
      type: "bible_verse",
      content: "I can do all this through him who gives me strength.",
      source: "Philippians 4:13",
    },
    saint_quote: {
      type: "saint_quote",
      content: "Begin, and the work will be completed.",
      source: "St. Francis de Sales",
    },
    inspirational: {
      type: "inspirational",
      content: "Small daily improvements over time lead to stunning results.",
      source: "Robin Sharma",
    },
  };
  return fallbacks[type];
}

/** Format a MotivationalContent object into a single display string stored in the DB */
export function formatMotivational(m: MotivationalContent): string {
  return m.source ? `${m.content} — ${m.source}` : m.content;
}
