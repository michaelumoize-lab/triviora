import {
  Brain,
  PenLine,
  Lightbulb,
  Dumbbell,
  CheckSquare,
  HeartPulse,
  Feather,
  Moon,
  Wind,
} from "lucide-react";

const FEATURES = [
  {
    pillar: "Mind",
    badge: "🧠",
    headline: "Sharpen your focus",
    description:
      "Track deep work sessions, log reflective journal entries, and receive personalized AI insights that reveal your mental patterns over time.",
    color: {
      pill: "bg-primary/10 text-primary",
      icon: "bg-primary/10 text-primary",
      accent: "bg-primary",
    },
    items: [
      { icon: Brain, label: "Focus tracking" },
      { icon: PenLine, label: "AI journaling" },
      { icon: Lightbulb, label: "Smart insights" },
    ],
  },
  {
    pillar: "Body",
    badge: "💪",
    headline: "Build lasting habits",
    description:
      "Log workouts, monitor health metrics, and stay consistent with habit streaks that celebrate every step forward — no matter how small.",
    color: {
      pill: "bg-secondary text-secondary-foreground",
      icon: "bg-secondary text-secondary-foreground",
      accent: "bg-secondary-foreground",
    },
    items: [
      { icon: Dumbbell, label: "Fitness logs" },
      { icon: CheckSquare, label: "Habit streaks" },
      { icon: HeartPulse, label: "Health metrics" },
    ],
  },
  {
    pillar: "Spirit",
    badge: "✨",
    headline: "Find your balance",
    description:
      "Guided reflections and mindfulness check-ins help you stay grounded, notice your emotional rhythms, and cultivate a deeper sense of ease.",
    color: {
      pill: "bg-muted text-muted-foreground",
      icon: "bg-muted text-foreground",
      accent: "bg-muted-foreground",
    },
    items: [
      { icon: Feather, label: "Reflections" },
      { icon: Moon, label: "Mindfulness" },
      { icon: Wind, label: "Calm rituals" },
    ],
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative py-28 px-6 overflow-hidden"
      aria-labelledby="features-heading"
    >
      {/* Subtle background texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-muted/30 dark:bg-muted/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 inset-x-0 h-px bg-border"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 inset-x-0 h-px bg-border"
      />

      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card text-xs font-medium text-muted-foreground tracking-wide shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Three pillars, one platform
          </span>

          <h2
            id="features-heading"
            className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground"
          >
            Everything you need to <span className="text-primary">thrive</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            Triviora brings Mind, Body, and Spirit into one unified view — so
            you always know where you stand and what to focus on next.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURES.map(
            ({ pillar, badge, headline, description, color, items }) => (
              <article
                key={pillar}
                className="group relative flex flex-col rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* Top accent line */}
                <div className={`h-0.5 w-full ${color.accent}`} />

                <div className="flex flex-col flex-1 p-6 space-y-5">
                  {/* Pillar badge */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${color.pill}`}
                    >
                      {badge} {pillar}
                    </span>
                  </div>

                  {/* Text content */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground tracking-tight">
                      {headline}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {description}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-border" />

                  {/* Feature list */}
                  <ul className="space-y-2.5 mt-auto">
                    {items.map(({ icon: Icon, label }) => (
                      <li key={label} className="flex items-center gap-3">
                        <span
                          className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 ${color.icon}`}
                        >
                          <Icon className="w-3.5 h-3.5" aria-hidden />
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ),
          )}
        </div>

        {/* Bottom footnote */}
        <p className="mt-10 text-center text-xs text-muted-foreground">
          All three pillars sync together — progress in one lifts the others.
        </p>
      </div>
    </section>
  );
}
