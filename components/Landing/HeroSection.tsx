import Link from "next/link";
import { Brain, Heart, Sparkles, ArrowRight } from "lucide-react";

const PILLARS = [
  { icon: Brain, label: "Mind", color: "text-primary" },
  { icon: Heart, label: "Body", color: "text-primary" },
  { icon: Sparkles, label: "Spirit", color: "text-primary" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-20 overflow-hidden">
      {/* Ambient background glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Warm center radial — light */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-125 rounded-full bg-primary/8 blur-[120px] dark:bg-primary/12" />
        {/* Soft bottom edge glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-125 h-50 bg-secondary/30 blur-[80px] dark:bg-secondary/20" />
      </div>

      {/* Pill badge */}
      <div className="animate-fade-in mb-10">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card text-xs font-medium text-muted-foreground tracking-wide shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          AI-powered life management
        </span>
      </div>

      {/* Headline */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.05]">
          Balance Your{" "}
          <span className="relative inline-block">
            <span className="text-primary">Mind,</span>
          </span>{" "}
          <br className="hidden sm:block" />
          Body <span className="text-muted-foreground font-light">&</span>{" "}
          <span className="text-primary">Spirit</span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto font-normal">
          Triviora uses AI to help you track what matters — your habits, focus,
          and well-being — and turns daily patterns into meaningful growth.
        </p>
      </div>

      {/* CTA buttons */}
      <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/auth/sign-up"
          className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all duration-200 shadow-sm"
        >
          Start for free
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
        <Link
          href="#how-it-works"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:bg-accent transition-all duration-200"
        >
          See how it works
        </Link>
      </div>

      {/* Pillar chips */}
      <div className="mt-16 flex items-center gap-3 sm:gap-5 flex-wrap justify-center">
        {PILLARS.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card/80 backdrop-blur-sm shadow-xs text-sm font-medium text-foreground"
          >
            <Icon className="w-4 h-4 text-primary shrink-0" />
            {label}
          </div>
        ))}
      </div>

      {/* Mock dashboard preview */}
      <div className="mt-20 w-full max-w-3xl mx-auto">
        <div className="relative rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
          {/* Fake browser chrome */}
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-muted/40">
            <span className="w-2.5 h-2.5 rounded-full bg-destructive/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-secondary-foreground/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-primary/30" />
            <span className="ml-3 text-xs text-muted-foreground font-mono">
              triviora.app/dashboard
            </span>
          </div>

          {/* Dashboard content */}
          <div className="p-5 sm:p-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Stat cards */}
            {[
              {
                label: "Focus Score",
                value: "84",
                unit: "/100",
                delta: "+6 this week",
              },
              {
                label: "Habits Done",
                value: "5",
                unit: "/7",
                delta: "Great streak!",
              },
              {
                label: "Mood Today",
                value: "7.2",
                unit: "/10",
                delta: "Feeling balanced",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-background p-4 space-y-1"
              >
                <p className="text-xs text-muted-foreground font-medium">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                  <span className="text-sm font-normal text-muted-foreground ml-0.5">
                    {stat.unit}
                  </span>
                </p>
                <p className="text-xs text-primary">{stat.delta}</p>
              </div>
            ))}

            {/* AI insight card */}
            <div className="sm:col-span-2 rounded-xl border border-border bg-background p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  AI Insight
                </p>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                You&apos;ve been most productive on mornings after 7+ hours of
                sleep. Consider scheduling deep work before noon this week.
              </p>
            </div>

            {/* Habit tracker */}
            <div className="rounded-xl border border-border bg-background p-4 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Today&apos;s Habits
              </p>
              <div className="space-y-2">
                {[
                  { name: "Meditate", done: true },
                  { name: "Journal", done: true },
                  { name: "Exercise", done: false },
                ].map((habit) => (
                  <div key={habit.name} className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                        habit.done
                          ? "bg-primary border-primary"
                          : "border-border"
                      }`}
                    >
                      {habit.done && (
                        <svg
                          className="w-2.5 h-2.5 text-primary-foreground"
                          viewBox="0 0 10 10"
                          fill="none"
                        >
                          <path
                            d="M2 5l2.5 2.5L8 3"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        habit.done
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {habit.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-card to-transparent pointer-events-none" />
        </div>

        {/* Reflection below preview */}
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Your personal dashboard — always in sync with how you&apos;re doing.
        </p>
      </div>
    </section>
  );
}
