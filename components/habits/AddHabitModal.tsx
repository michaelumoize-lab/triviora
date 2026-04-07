"use client";
// components/habits/AddHabitModal.tsx
// Modal for creating a new habit or editing an existing one.

import { useState, useEffect } from "react";
import type { Habit, CreateHabitPayload, Frequency, MotivationalType } from "@/types/habits";

interface AddHabitModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: CreateHabitPayload) => Promise<void>;
  /** If provided, the modal is in edit mode */
  editingHabit?: Habit | null;
  onUpdate?: (id: string, payload: Partial<CreateHabitPayload>) => Promise<void>;
}

const FREQUENCY_OPTIONS: { value: Frequency; label: string }[] = [
  { value: "DAILY", label: "Daily" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
];

const CONTENT_TYPE_OPTIONS: { value: MotivationalType; label: string; desc: string }[] = [
  { value: "bible_verse", label: "Bible Verse (NIV)", desc: "Scripture for strength" },
  { value: "saint_quote", label: "Saint's Quote", desc: "Wisdom from the saints" },
  { value: "inspirational", label: "Inspirational", desc: "Motivational wisdom" },
];

export function AddHabitModal({ open, onClose, onSave, editingHabit, onUpdate }: AddHabitModalProps) {
  const isEdit = !!editingHabit;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("DAILY");
  const [notes, setNotes] = useState("");
  const [contentType, setContentType] = useState<MotivationalType>("bible_verse");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Populate fields when editing
  useEffect(() => {
    if (editingHabit) {
      setName(editingHabit.name);
      setDescription(editingHabit.description ?? "");
      setFrequency(editingHabit.frequency);
      setNotes(editingHabit.notes ?? "");
    } else {
      setName(""); setDescription(""); setFrequency("DAILY"); setNotes(""); setContentType("bible_verse");
    }
    setError("");
  }, [editingHabit, open]);

  if (!open) return null;

  async function handleSubmit() {
    if (!name.trim()) { setError("Please enter a habit name."); return; }
    setLoading(true);
    setError("");
    try {
      if (isEdit && editingHabit && onUpdate) {
        await onUpdate(editingHabit.id, { name, description, frequency, notes });
      } else {
        await onSave({ name, description, frequency, notes, contentType });
      }
      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">
            {isEdit ? "Edit Habit" : "New Habit"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Habit name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Morning Prayer"
              maxLength={80}
              className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Description <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short note about this habit"
              maxLength={200}
              className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
            />
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Frequency</label>
            <div className="flex gap-2">
              {FREQUENCY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFrequency(opt.value)}
                  className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-all ${
                    frequency === opt.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input bg-background text-muted-foreground hover:border-ring hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Motivational content type (only on create) */}
          {!isEdit && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Motivational style
              </label>
              <div className="space-y-2">
                {CONTENT_TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setContentType(opt.value)}
                    className={`w-full flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-left transition-all ${
                      contentType === opt.value
                        ? "border-primary bg-secondary/30"
                        : "border-input bg-background hover:border-ring"
                    }`}
                  >
                    <span className="text-sm font-medium text-foreground">{opt.label}</span>
                    <span className="text-xs text-muted-foreground">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Personal notes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Personal note <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Why does this habit matter to you?"
              rows={2}
              maxLength={500}
              className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/30">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            {isEdit ? "Save Changes" : "Create Habit"}
          </button>
        </div>
      </div>
    </div>
  );
}
