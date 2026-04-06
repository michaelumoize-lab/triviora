import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Amara Osei",
    role: "Product Designer",
    company: "Notion",
    avatar: "AO",
    avatarColor: "bg-primary/15 text-primary",
    quote:
      "Triviora is the first app that actually connects the dots between my sleep, focus, and mood. The AI insights feel like having a thoughtful coach — not a data dump.",
    highlight: "connects the dots",
    stars: 5,
  },
  {
    name: "Luca Ferretti",
    role: "Freelance Engineer",
    company: "Independent",
    avatar: "LF",
    avatarColor: "bg-secondary text-secondary-foreground",
    quote:
      "I tried every productivity app out there. Triviora is the only one I've kept open every morning. The habit streaks and weekly digest keep me honest with myself.",
    highlight: "kept open every morning",
    stars: 5,
  },
  {
    name: "Seo-Yeon Park",
    role: "Wellness Coach",
    company: "Self-employed",
    avatar: "SP",
    avatarColor: "bg-muted text-foreground",
    quote:
      "I recommend Triviora to every client who feels scattered. The Spirit pillar — the reflections and mindfulness check-ins — is genuinely unlike anything else I've seen.",
    highlight: "genuinely unlike anything else",
    stars: 5,
  },
];

function StarRow({ count }: { count: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${count} out of 5 stars`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          className="w-3.5 h-3.5 text-primary fill-primary"
          viewBox="0 0 16 16"
          aria-hidden
        >
          <path d="M8 1.5l1.65 3.35 3.7.54-2.67 2.6.63 3.67L8 9.77l-3.31 1.74.63-3.67L2.65 5.4l3.7-.54L8 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative py-28 px-6 overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      {/* Background surface */}
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

      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full bg-primary/5 blur-[120px] dark:bg-primary/8 -z-10"
      />

      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card text-xs font-medium text-muted-foreground tracking-wide shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Loved by real people
          </span>

          <h2
            id="testimonials-heading"
            className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground"
          >
            What our users <span className="text-primary">are saying</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
            From designers to coaches to engineers — people who made Triviora
            part of their daily rhythm.
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map(
            ({
              name,
              role,
              company,
              avatar,
              avatarColor,
              quote,
              highlight,
              stars,
            }) => (
              <article
                key={name}
                className="group relative flex flex-col rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 p-6 space-y-5"
              >
                {/* Quote icon */}
                <div className="flex items-center justify-between">
                  <StarRow count={stars} />
                  <Quote
                    className="w-4 h-4 text-border group-hover:text-primary/40 transition-colors duration-300"
                    aria-hidden
                  />
                </div>

                {/* Quote text */}
                <blockquote className="flex-1">
                  <p className="text-sm text-foreground leading-relaxed">
                    {quote.split(highlight).map((part, i, arr) =>
                      i < arr.length - 1 ? (
                        <span key={i}>
                          {part}
                          <span className="font-semibold text-primary">
                            {highlight}
                          </span>
                        </span>
                      ) : (
                        <span key={i}>{part}</span>
                      ),
                    )}
                  </p>
                </blockquote>

                {/* Divider */}
                <div className="h-px bg-border" />

                {/* Author */}
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColor}`}
                    aria-hidden
                  >
                    {avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground leading-tight">
                      {name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {role} · {company}
                    </p>
                  </div>
                </div>
              </article>
            ),
          )}
        </div>

        {/* Social proof bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10">
          {[
            { value: "4.9 / 5", label: "Average rating" },
            { value: "2,400+", label: "Active users" },
            { value: "91%", label: "Return after 30 days" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold text-foreground tabular-nums">
                {value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
