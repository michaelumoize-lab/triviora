import Link from "next/link";
import { ArrowRight, Brain, Heart, Sparkles } from "lucide-react";

const PILLARS = [
  { icon: Brain, label: "Mind" },
  { icon: Heart, label: "Body" },
  { icon: Sparkles, label: "Spirit" },
];

export default function CtaSection() {
  return (
    <section
      id="cta"
      className="relative py-28 px-6 overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Ambient glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-primary/8 blur-[130px] dark:bg-primary/14" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-secondary/30 blur-[80px] dark:bg-secondary/15" />
      </div>

      <div className="max-w-3xl mx-auto text-center space-y-8">
        {/* Pillar icons row */}
        <div className="flex items-center justify-center gap-3">
          {PILLARS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-card border border-border shadow-xs"
              aria-label={label}
            >
              <Icon className="w-4 h-4 text-primary" aria-hidden />
            </div>
          ))}
        </div>

        {/* Headline */}
        <div className="space-y-4">
          <h2
            id="cta-heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.05]"
          >
            Start your journey <span className="text-primary">today</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
            Join thousands of people who use Triviora to understand themselves
            better and move through life with more clarity and intention.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/auth/sign-up"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all duration-200 shadow-sm w-full sm:w-auto justify-center"
          >
            Get started for free
            <ArrowRight
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:bg-accent transition-all duration-200 w-full sm:w-auto justify-center"
          >
            Explore features
          </Link>
        </div>

        {/* Trust line */}
        <p className="text-xs text-muted-foreground pt-2">
          Free forever on the core plan · No credit card required · Cancel
          anytime
        </p>

        {/* Decorative card strip */}
        <div className="relative mt-10 flex items-center justify-center gap-3 flex-wrap">
          {[
            "📓 Journal entry saved",
            "🏃 Workout logged",
            "🧘 Reflection complete",
            "✅ 7-day streak",
          ].map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card/80 backdrop-blur-sm text-xs font-medium text-muted-foreground shadow-xs"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
