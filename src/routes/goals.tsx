import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { Goal, Habit } from "@/types/database";
import { Plus, ChevronDown, ChevronRight, Archive } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/goals")({
  component: GoalsPage,
});

function GoalsPage() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [goals, setGoals] = useState<(Goal & { habits?: Habit[] })[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);

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
    loadGoals();
  }, [user, profile, loading]);

  async function loadGoals() {
    if (!user) return;
    const [goalsRes, habitsRes] = await Promise.all([
      supabase.from("goals").select("*").eq("user_id", user.id).neq("status", "archived"),
      supabase.from("habits").select("*").eq("user_id", user.id).neq("status", "archived"),
    ]);

    const allGoals = (goalsRes.data ?? []) as Goal[];
    const allHabits = (habitsRes.data ?? []) as Habit[];

    const withHabits = allGoals.map((g) => ({
      ...g,
      habits: allHabits.filter((h) => h.goal_id === g.id),
    }));
    setGoals(withHabits);
  }

  async function handleAddGoal(name: string, area: string, why: string) {
    if (!user || busy) return;
    setBusy(true);
    await supabase.from("goals").insert({
      user_id: user.id,
      name,
      area,
      why: why || null,
    });
    setBusy(false);
    setShowForm(false);
    loadGoals();
  }

  async function handleArchiveGoal(id: string) {
    if (!user || busy) return;
    setBusy(true);
    await supabase.from("goals").update({ status: "archived" }).eq("id", id);
    setBusy(false);
    loadGoals();
  }

  async function handleAddHabit(goalId: string, name: string, full: string, min: string) {
    if (!user || busy) return;
    setBusy(true);
    await supabase.from("habits").insert({
      goal_id: goalId,
      user_id: user.id,
      name,
      full_version: full,
      minimum_version: min,
    });
    setBusy(false);
    loadGoals();
  }

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading…</div>
      </div>
    );
  }

  return (
    <AppShell>
      <header className="mb-6 animate-rise">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
          Your goals
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Break big intentions into small, kind habits.
        </p>
      </header>

      <div className="mb-4">
        <Button onClick={() => setShowForm((v) => !v)} variant="soft">
          <Plus className="h-4 w-4" />
          New goal
        </Button>
      </div>

      {showForm && (
        <NewGoalForm onSubmit={handleAddGoal} onCancel={() => setShowForm(false)} />
      )}

      <section className="space-y-3">
        {goals.length === 0 && !showForm ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-10 text-center">
            <p className="font-medium text-foreground">No goals yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Start with one area you'd like to grow in.
            </p>
          </div>
        ) : (
          goals.map((goal) => (
            <GoalItem
              key={goal.id}
              goal={goal}
              expanded={expanded[goal.id] ?? false}
              onToggle={() =>
                setExpanded((prev) => ({ ...prev, [goal.id]: !prev[goal.id] ?? true }))
              }
              onArchive={() => handleArchiveGoal(goal.id)}
              onAddHabit={(name, full, min) => handleAddHabit(goal.id, name, full, min)}
              busy={busy}
            />
          ))
        )}
      </section>
    </AppShell>
  );
}

function GoalItem({
  goal,
  expanded,
  onToggle,
  onArchive,
  onAddHabit,
  busy,
}: {
  goal: Goal & { habits?: Habit[] };
  expanded: boolean;
  onToggle: () => void;
  onArchive: () => void;
  onAddHabit: (name: string, full: string, min: string) => void;
  busy: boolean;
}) {
  const [showHabitForm, setShowHabitForm] = useState(false);

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <button onClick={onToggle} className="flex flex-1 items-start gap-2 text-left">
          {expanded ? (
            <ChevronDown className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          )}
          <div>
            <h3 className="font-display text-base font-semibold text-foreground">{goal.name}</h3>
            <p className="text-xs text-muted-foreground">{goal.area}</p>
            {goal.why && (
              <p className="mt-1 text-sm text-muted-foreground/80">{goal.why}</p>
            )}
          </div>
        </button>
        <button
          onClick={onArchive}
          disabled={busy}
          className="text-muted-foreground hover:text-foreground"
        >
          <Archive className="h-4 w-4" />
        </button>
      </div>

      {expanded && (
        <div className="mt-4 space-y-3 border-t border-border/50 pt-4">
          {(goal.habits ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No habits yet for this goal.</p>
          ) : (
            (goal.habits ?? []).map((h) => (
              <div key={h.id} className="rounded-xl bg-background/60 px-3 py-2">
                <p className="text-sm font-medium text-foreground">{h.name}</p>
                <p className="text-xs text-muted-foreground">Full: {h.full_version}</p>
                <p className="text-xs text-muted-foreground">Min: {h.minimum_version}</p>
              </div>
            ))
          )}

          {showHabitForm ? (
            <NewHabitForm
              onSubmit={onAddHabit}
              onCancel={() => setShowHabitForm(false)}
            />
          ) : (
            <Button size="sm" variant="ghost" onClick={() => setShowHabitForm(true)}>
              <Plus className="h-4 w-4" />
              Add habit
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function NewGoalForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (name: string, area: string, why: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [area, setArea] = useState("Health");
  const [why, setWhy] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (name.trim()) onSubmit(name.trim(), area, why.trim());
      }}
      className="mb-4 space-y-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm"
    >
      <input
        type="text"
        placeholder="Goal name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none ring-ring focus:ring-2"
        required
      />
      <select
        value={area}
        onChange={(e) => setArea(e.target.value)}
        className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none ring-ring focus:ring-2"
      >
        {["Health", "Mind", "Career", "Relationships", "Creativity", "Finances"].map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
      <textarea
        placeholder="Why does this matter to you?"
        value={why}
        onChange={(e) => setWhy(e.target.value)}
        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
        rows={2}
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm">
          Create goal
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function NewHabitForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (name: string, full: string, min: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [full, setFull] = useState("");
  const [min, setMin] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (name.trim() && full.trim() && min.trim())
          onSubmit(name.trim(), full.trim(), min.trim());
      }}
      className="space-y-2 rounded-xl bg-background/60 p-3"
    >
      <input
        type="text"
        placeholder="Habit name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none ring-ring focus:ring-2"
        required
      />
      <input
        type="text"
        placeholder="Full version (the ideal)"
        value={full}
        onChange={(e) => setFull(e.target.value)}
        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none ring-ring focus:ring-2"
        required
      />
      <input
        type="text"
        placeholder="Minimum version (on hard days)"
        value={min}
        onChange={(e) => setMin(e.target.value)}
        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none ring-ring focus:ring-2"
        required
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm">
          Add
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
