"use client";
import { useState } from "react";

export default function TestThemePage() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="bg-background text-foreground min-h-screen transition-colors duration-300 font-sans selection:bg-primary/30">
        
        {/* Simplified Sidebar + Main Content Layout */}
        <div className="flex min-h-screen">
          {/* Sidebar Preview */}
          <aside className="hidden md:flex w-64 flex-col bg-sidebar border-r border-sidebar-border p-4 transition-colors">
            <div className="text-xl font-serif font-bold mb-8 text-sidebar-foreground px-2">
              Triviora
            </div>
            <nav className="space-y-1">
              {["Dashboard", "Analytics", "Settings"].map((item) => (
                <div
                  key={item}
                  className={`px-3 py-2 rounded-md text-sm cursor-pointer transition ${
                    item === "Dashboard"
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  }`}
                >
                  {item}
                </div>
              ))}
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col items-center p-8">
            
            {/* Header Controls */}
            <div className="w-full max-w-4xl flex justify-between items-center mb-12">
              <h1 className="text-3xl font-serif font-bold tracking-tight">Theme Preview</h1>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg shadow-md hover:opacity-90 transition active:scale-95"
              >
                Switch to {darkMode ? "Light" : "Dark"} Mode
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-4xl">
              
              {/* Card Section */}
              <section className="space-y-6">
                <div className="bg-card text-card-foreground p-8 rounded-xl shadow-lg border border-border transition-colors">
                  <h2 className="text-2xl font-serif mb-4">The Triviora Philosophy</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Balance is not something you find, it&apos;s something you create. 
                    This interface uses your custom theme variables to ensure a 
                    cohesive experience across Mind, Body, and Spirit.
                  </p>
                  <div className="mt-6 flex gap-3">
                    <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md shadow-sm text-sm font-medium hover:brightness-110">
                      MIND
                    </button>
                    <button className="px-4 py-2 bg-accent text-accent-foreground rounded-md shadow-sm text-sm font-medium hover:brightness-110">
                      BODY
                    </button>
                    <button className="px-4 py-2 bg-muted text-muted-foreground rounded-md shadow-sm text-sm font-medium hover:brightness-110 border border-border">
                      SPIRIT
                    </button>
                  </div>
                </div>

                {/* Form Input Section */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-foreground">Quick Journal Entry</label>
                  <input
                    type="text"
                    placeholder="How are you feeling today?"
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:ring-2 focus:ring-ring focus:outline-none transition placeholder:text-muted-foreground/60"
                  />
                  <button className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-xl">
                    Save Progress
                  </button>
                </div>
              </section>

              {/* Stats & Charts Simulation */}
              <section className="space-y-6">
                <div className="bg-card p-6 rounded-xl shadow-md border border-border">
                  <h3 className="font-serif text-lg mb-6">Activity Analytics</h3>
                  
                  {/* Chart Progress Simulation */}
                  <div className="space-y-5">
                    {[
                      { label: "Mind", val: "85%", color: "var(--chart-1)" },
                      { label: "Body", val: "62%", color: "var(--chart-2)" },
                      { label: "Spirit", val: "94%", color: "var(--chart-3)" },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium">{item.label}</span>
                          <span className="text-muted-foreground">{item.val}</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-1000" 
                            style={{ width: item.val, backgroundColor: item.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Palette Checklist */}
                <div className="p-4 bg-accent/20 rounded-lg border border-accent/30">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Color Verification</h4>
                  <div className="flex flex-wrap gap-2">
                    <div className="w-8 h-8 rounded bg-primary" title="Primary"></div>
                    <div className="w-8 h-8 rounded bg-secondary" title="Secondary"></div>
                    <div className="w-8 h-8 rounded bg-accent" title="Accent"></div>
                    <div className="w-8 h-8 rounded bg-muted" title="Muted"></div>
                    <div className="w-8 h-8 rounded bg-destructive" title="Destructive"></div>
                  </div>
                </div>
              </section>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}