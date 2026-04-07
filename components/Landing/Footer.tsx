import Link from "next/link";
import { Sparkles } from "lucide-react";

const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Preview", href: "#preview" },
    { label: "Pricing", href: "/pricing" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

const SOCIAL_LINKS = [
  {
    label: "X / Twitter",
    href: "https://x.com/triviora",
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="currentColor"
        className="w-4 h-4"
        aria-hidden
      >
        <path d="M12.6 1h2.4L9.7 6.8 16 15h-4.5l-3.8-5-4.4 5H.9l5.7-6.5L0 1h4.6l3.4 4.5L12.6 1zm-.8 12.6h1.3L4.3 2.3H2.9l8.9 11.3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/triviora",
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="currentColor"
        className="w-4 h-4"
        aria-hidden
      >
        <path d="M8 1.44c2.14 0 2.39.01 3.23.05 2.3.1 3.18.99 3.28 3.28.04.84.05 1.09.05 3.23s-.01 2.39-.05 3.23c-.1 2.29-.98 3.18-3.28 3.28-.84.04-1.08.05-3.23.05s-2.39-.01-3.23-.05c-2.3-.1-3.18-.99-3.28-3.28C1.45 10.39 1.44 10.14 1.44 8s.01-2.39.05-3.23C1.59 2.48 2.48 1.59 4.77 1.49c.84-.04 1.09-.05 3.23-.05zM8 0C5.83 0 5.56.01 4.7.05 1.7.19.19 1.7.05 4.7.01 5.56 0 5.83 0 8c0 2.17.01 2.44.05 3.3.14 3 1.65 4.51 4.65 4.65.86.04 1.13.05 3.3.05s2.44-.01 3.3-.05c3-.14 4.51-1.65 4.65-4.65.04-.86.05-1.13.05-3.3 0-2.17-.01-2.44-.05-3.3C15.81 1.7 14.3.19 11.3.05 10.44.01 10.17 0 8 0zm0 3.89a4.11 4.11 0 100 8.22 4.11 4.11 0 000-8.22zM8 10.67a2.67 2.67 0 110-5.34 2.67 2.67 0 010 5.34zm5.23-6.92a.96.96 0 11-1.92 0 .96.96 0 011.92 0z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/triviora",
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="currentColor"
        className="w-4 h-4"
        aria-hidden
      >
        <path d="M1.15 5.33H3.9v9.18H1.15V5.33zM2.52 4.15a1.6 1.6 0 110-3.2 1.6 1.6 0 010 3.2zM14.5 14.51h-2.74v-4.47c0-1.06-.02-2.43-1.48-2.43-1.48 0-1.71 1.16-1.71 2.35v4.55H5.83V5.33h2.63v1.25h.04c.37-.7 1.26-1.43 2.6-1.43 2.78 0 3.3 1.83 3.3 4.21v5.15z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative border-t border-border bg-card"
      role="contentinfo"
    >
      {/* Top hairline accent */}
      <div
        aria-hidden
        className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent"
      />

      <div className="max-w-5xl mx-auto px-6 pt-14 pb-10">
        {/* Top row: brand + links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-6">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-2 space-y-4">
            <Link
              href="/"
              aria-label="Triviora home"
              className="inline-flex items-center gap-2.5 group"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary transition-transform duration-200 group-hover:scale-105">
                <Sparkles
                  className="w-4 h-4 text-primary-foreground"
                  aria-hidden
                />
              </div>
              <span className="font-semibold text-base tracking-tight text-foreground">
                Triviora
              </span>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              An AI-powered life management app that helps you balance Mind,
              Body, and Spirit — one intentional day at a time.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2 pt-1">
              {SOCIAL_LINKS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-150"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group} className="space-y-4">
              <p className="text-xs font-semibold text-foreground uppercase tracking-widest">
                {group}
              </p>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-12 h-px bg-border" />

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {year} Triviora. All rights reserved.
          </p>

          <div className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full bg-primary/70"
              aria-hidden
            />
            <p className="text-xs text-muted-foreground">
              Built for clarity, designed with care.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
