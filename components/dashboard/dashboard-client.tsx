// components/dashboard/dashboard-client.tsx
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Sun,
  Moon,
  Heart,
  Activity,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";

interface DashboardClientProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const { data: session } = authClient.useSession(); // For reactive updates if needed

  // Current time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const displayName = user.name || user.email?.split("@")[0] || "there";

  // Mock data (replace with real data fetching later)
  const [habits, setHabits] = useState([
    { id: 1, label: "Morning meditation", completed: true },
    { id: 2, label: "Read 10 pages", completed: false },
    { id: 3, label: "No processed sugar", completed: true },
    { id: 4, label: "Evening journal", completed: false },
  ]);

  const toggleHabit = (id: number) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit,
      ),
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-semibold tracking-tight">
                {getGreeting()}, {displayName}
              </h1>
              <p className="text-muted-foreground mt-1">
                {user.email} • Welcome back to Triviora
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="rounded-xl">
            <Target className="mr-2 h-4 w-4" />
            New Entry
          </Button>
          <Button size="sm" className="rounded-xl">
            Ask AI
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mind Card */}
        <Card className="lg:col-span-4 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Mind
            </CardTitle>
            <CardDescription>Focus • Clarity • Insights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Current Mood</p>
                <p className="text-3xl font-semibold">Calm</p>
              </div>
              <Badge variant="secondary" className="rounded-xl">
                +2 today
              </Badge>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Focus Time</span>
                <span className="font-medium">3h 42m</span>
              </div>
              <Progress value={68} className="h-2" />
            </div>

            <div className="flex justify-between text-sm">
              <span>Journaling Streak</span>
              <span className="font-medium text-primary">7 days 🔥</span>
            </div>
          </CardContent>
        </Card>

        {/* Body Card */}
        <Card className="lg:col-span-4 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Body
            </CardTitle>
            <CardDescription>Movement • Energy • Recovery</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Steps Today</span>
                <span className="font-medium">8,942 / 10,000</span>
              </div>
              <Progress value={89} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Workouts</p>
                <p className="text-3xl font-semibold">4</p>
                <p className="text-xs text-muted-foreground">this week</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Minutes</p>
                <p className="text-3xl font-semibold">87</p>
                <p className="text-xs text-muted-foreground">
                  +12 from yesterday
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spirit Card */}
        <Card className="lg:col-span-4 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Spirit
            </CardTitle>
            <CardDescription>Reflection • Balance • Presence</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Meditation</p>
                <p className="text-3xl font-semibold">18 min</p>
              </div>
              <Badge className="rounded-xl">Consistent</Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Balance Score
              </p>
              <div className="text-5xl font-light text-primary">82</div>
              <p className="text-xs text-muted-foreground">
                /100 • Slight improvement
              </p>
            </div>
          </CardContent>
        </Card>

        {/* AI Insight Card (Highlighted) */}
        <Card className="lg:col-span-12 rounded-3xl border-primary/20 bg-gradient-to-br from-card to-secondary/5 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                AI INSIGHT
              </div>
              <CardTitle>Today’s Gentle Recommendation</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed text-card-foreground/90">
              Your energy peaks in the morning. Consider moving your journaling
              to 7:30 AM and adding a 10-minute walk afterward. This small shift
              could improve your focus score by ~18% based on your patterns.
            </p>
            <Button variant="outline" className="mt-6 rounded-xl" size="sm">
              Apply this suggestion
            </Button>
          </CardContent>
        </Card>

        {/* Habits Tracker */}
        <Card className="lg:col-span-5 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Daily Habits
              <Badge variant="outline" className="rounded-xl">
                4 of 4
              </Badge>
            </CardTitle>
            <CardDescription>
              Build consistency one day at a time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {habits.map((habit) => (
              <div key={habit.id} className="flex items-center gap-3">
                <Checkbox
                  id={`habit-${habit.id}`}
                  checked={habit.completed}
                  onCheckedChange={() => toggleHabit(habit.id)}
                />
                <label
                  htmlFor={`habit-${habit.id}`}
                  className={`flex-1 text-sm cursor-pointer transition-colors ${
                    habit.completed ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {habit.label}
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Progress Section */}
        <Card className="lg:col-span-7 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              This Week’s Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center border border-dashed border-border rounded-2xl bg-muted/30">
              <div className="text-center">
                <p className="text-muted-foreground">Chart Placeholder</p>
                <p className="text-xs text-muted-foreground mt-1">
                  (Add Recharts / Tremor / shadcn Chart here)
                </p>
                <div className="mt-6 flex justify-center gap-8 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[--chart-1]"></div>
                    <span>Mind</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[--chart-2]"></div>
                    <span>Body</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[--chart-5]"></div>
                    <span>Spirit</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="text-center text-xs text-muted-foreground">
        Triviora • Premium AI Life Dashboard • Built with calm intention
      </div>
    </div>
  );
}
