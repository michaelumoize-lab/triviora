"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { ModeToggle } from "@/components/Shared/ModeToggle";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Preview", href: "#preview" },
  { label: "Testimonials", href: "#testimonials" },
];

export default function LandingNavbar() {
  const { data: session } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4">
      <nav
        ref={menuRef}
        className={`w-full max-w-5xl rounded-2xl border transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur-xl border-border shadow-md"
            : "bg-background/70 backdrop-blur-md border-border/40"
        }`}
      >
        <div className="flex items-center justify-between px-5 h-14">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Triviora home"
            className="flex items-center gap-2.5 group shrink-0"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary transition-transform duration-200 group-hover:scale-105">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-base tracking-tight text-foreground">
              Triviora
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-150 whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ModeToggle />

            <div className="hidden sm:block w-px h-5 bg-border mx-0.5" />

            {session?.user ? (
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Dashboard
              </Link>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5">
                <Link
                  href="/auth/sign-in"
                  className="px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              aria-label="Toggle menu"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-border px-3 pt-3 pb-4 space-y-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-all"
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 mt-2 border-t border-border space-y-2">
              {session?.user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block text-center py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/sign-in"
                    onClick={() => setIsOpen(false)}
                    className="block text-center py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    onClick={() => setIsOpen(false)}
                    className="block text-center py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
