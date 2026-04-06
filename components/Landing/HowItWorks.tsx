import { ClipboardList, Sparkles, TrendingUp } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Track your daily life",
    description:
      "Log habits, moods, focus sessions, and workouts in seconds. Triviora fits into your day without demanding your day.",
    detail: "Quick captures · Voice notes · Templates",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Get AI-powered insights",
    description:
      "Our AI surfaces patterns you'd never spot alone — correlating sleep, productivity, mood, and habits into plain-language insights.",
    detail: "Weekly digests · Pattern detection · Nudges",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Improve and stay consistent",
    description:
      "Personalized goals, streak tracking, and gentle accountability keep you moving forward — one intentional day at a time.",
    detail: "Custom goals · Streaks · Progress reports",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative py-28 px-6"
      aria-labelledby="how-heading"
    >
      {/* Ambient glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary/5 blur-[100px] dark:bg-primary/8" />
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20 space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card text-xs font-medium text-muted-foreground tracking-wide shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Simple by design
          </span>

          <h2
            id="how-heading"
            className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground"
          >
            Up and running in <span className="text-primary">three steps</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            No complicated setup. No overwhelming dashboards. Just a clear,
            guided path from scattered data to meaningful growth.
          </p>
        </div>

        {/* Steps — vertical on mobile, horizontal on desktop */}
        <div className="relative flex flex-col md:flex-row gap-6 md:gap-4">
          {/* Desktop connector line */}
          <div
            aria-hidden
            className="hidden md:block absolute top-[52px] left-[calc(16.666%+1rem)] right-[calc(16.666%+1rem)] h-px bg-border z-0"
          />

          {STEPS.map(
            ({ number, icon: Icon, title, description, detail }, index) => (
              <div
                key={number}
                className="relative flex-1 flex flex-col items-center text-center md:px-4 z-10"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                {/* Step icon ring */}
                <div className="relative mb-6">
                  {/* Outer ring */}
                  <div className="w-[68px] h-[68px] rounded-full border border-border bg-background flex items-center justify-center shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" aria-hidden />
                    </div>
                  </div>
                  {/* Step number badge */}
                  <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center leading-none tabular-nums shadow-sm">
                    {index + 1}
                  </span>
                </div>

                {/* Card */}
                <div className="w-full rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-300 p-5 space-y-3 text-left">
                  {/* Large decorative number */}
                  <span
                    aria-hidden
                    className="block text-5xl font-bold text-border/60 dark:text-border/40 leading-none select-none tabular-nums"
                  >
                    {number}
                  </span>

                  <h3 className="text-base font-semibold text-foreground tracking-tight">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>

                  {/* Detail tags */}
                  <div className="pt-1">
                    <p className="text-xs text-primary font-medium tracking-wide">
                      {detail}
                    </p>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>

        {/* CTA nudge */}
        <div className="mt-16 flex justify-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl border border-border bg-card shadow-sm">
            <span className="text-sm text-muted-foreground">
              Takes less than 2 minutes to set up.
            </span>
            <a
              href="/auth/sign-up"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-4 transition-all"
            >
              Start free →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
