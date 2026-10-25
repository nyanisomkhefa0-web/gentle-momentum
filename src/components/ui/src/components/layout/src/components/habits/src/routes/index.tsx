import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { HabitCard } from "@/components/habits/HabitCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { fmtFriendlyDate, greetingForHour, todayISO, weekdayOfISO } from "@/lib/dates";
import type { Habit, HabitLog, MoodEntry } from "@/types/database";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/")({
  component: TodayPage,
});

function TodayPage() {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const today = todayISO();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<Record<string, HabitLog>>({});
  const [mood, setMood] = useState<MoodEntry | null>(null);
  const [busy, setBusy] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    if (profile && !profile.onboarding_completed) {
      navigate({ to: "/onboarding" });
      return;
    }
    loadToday();
  }, [user, profile, loading]);

  async function loadToday() {
    if (!user) return;
    setDataLoading(true);

    const [habitsRes, logsRes, moodRes] = await Promise.all([
      supabase.from("habits").select("*").eq("user_id", user.id).eq("status", "active"),
      supabase.from("habit_logs").select("*").eq("user_id", user.id).eq("log_date", today),
      supabase
        .from("mood_entries")
        .select("*")
        .eq("user_id", user.id)
        .eq("entry_date", today)
        .maybeSingle(),
    ]);

    const allHabits = (habitsRes.data ?? []) as Habit[];
    const dow = weekdayOfISO(today);

    const due = allHabits.filter((h) => {
      if (h.frequency_type === "daily") return true;
      if (h.frequency_type === "weekdays") return dow >= 1 && dow <= 5;
      if (h.frequency_type === "weekly_x") return (h.weekdays ?? []).includes(dow);
      return true;
    });

    setHabits(due);
    const map: Record<string, HabitLog> = {};
    for (const log of (logsRes.data ?? []) as HabitLog[]) {
      map[log.habit_id] = log;
    }
    setLogs(map);
    setMood((moodRes.data as MoodEntry) ?? null);
    setDataLoading(false);
  }

  async function handleLog(habitId: string, status: "full" | "minimum" | "skipped") {
    if (!user || busy) return;
    setBusy(true);

    const existing = logs[habitId];

    if (existing) {
      const { data, error } = await supabase
        .from("habit_logs")
        .update({ status, skip_reason: status === "skipped" ? "Chose to skip" : null })
        .eq("id", existing.id)
        .select()
        .single();
      if (!error && data) {
        setLogs((prev) => ({ ...prev, [habitId]: data as HabitLog }));
      }
    } else {
      const { data, error } = await supabase
        .from("habit_logs")
        .insert({
          habit_id: habitId,
          user_id: user.id,
          log_date: today,
          status,
          skip_reason: status === "skipped" ? "Chose to skip" : null,
        })
        .select()
        .single();
      if (!error && data) {
        setLogs((prev) => ({ ...prev, [habitId]: data as HabitLog }));
      }
    }

    setBusy(false);
  }

  const stats = useMemo(() => {
    const total = habits.length;
    const completed = habits.filter((h) => {
      const s = logs[h.id]?.status;
      return s === "full" || s === "minimum";
    }).length;
    return { total, completed };
  }, [habits, logs]);

  if (loading || dataLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="animate-soft-pulse text-muted-foreground">Loading…</div>
      </div>
    );
  }

  const hour = new Date().getHours();
  const name = profile?.display_name?.split(" ")[0] || "there";

  return (
    <AppShell>
      <header className="mb-6 animate-rise">
        <p className="text-sm font-medium text-muted-foreground">{fmtFriendlyDate(today)}</p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground">
          {greetingForHour(hour)}, {name}
        </h1>
        {stats.total > 0 && (
          <p className="mt-2 text-sm text-muted-foreground">
            {stats.completed} of {stats.total} done today
          </p>
        )}
      </header>

      <section className="mb-6">
        <Link
          to="/mood"
          className="flex items-center justify-between rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-sm transition hover:border-primary/30"
        >
          <div>
            <p className="text-sm font-medium text-foreground">How are you feeling?</p>
            <p className="text-xs text-muted-foreground">
              {mood ? `Logged: ${moodLabel(mood.mood)}` : "Tap to check in"}
            </p>
          </div>
          <span className="text-2xl">{mood ? moodEmoji(mood.mood) : "✨"}</span>
        </Link>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-foreground">Today’s habits</h2>
          <Button asChild size="sm" variant="soft">
            <Link to="/goals">
              <Plus className="h-4 w-4" />
              Goals
            </Link>
          </Button>
        </div>

        {habits.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-10 text-center">
            <p className="font-medium text-foreground">No habits scheduled today</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a goal and add habits to build gentle momentum.
            </p>
            <Button asChild className="mt-4">
              <Link to="/goals">Add a goal</Link>
            </Button>
          </div>
        ) : (
          habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              log={logs[habit.id] ?? null}
              onLog={(status) => handleLog(habit.id, status)}
              disabled={busy}
            />
          ))
        )}
      </section>

      <div className="mt-10 text-center">
        <button
          type="button"
          onClick={() => signOut()}
          className="text-xs text-muted-foreground underline-offset-2 hover:underline"
        >
          Sign out
        </button>
      </div>
    </AppShell>
  );
}

function moodEmoji(m: number) {
  return ["", "😔", "😕", "😐", "🙂", "😊"][m] ?? "✨";
}

function moodLabel(m: number) {
  return ["", "Low", "Off", "Okay", "Good", "Great"][m] ?? "Logged";
}
