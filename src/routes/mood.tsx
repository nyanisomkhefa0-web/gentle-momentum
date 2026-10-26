import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { todayISO } from "@/lib/dates";
import type { MoodEntry } from "@/types/database";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mood")({
  component: MoodPage,
});

const MOODS = [
  { value: 1, emoji: "😔", label: "Low" },
  { value: 2, emoji: "😕", label: "Off" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😊", label: "Great" },
] as const;

function MoodPage() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const today = todayISO();
  const [entry, setEntry] = useState<MoodEntry | null>(null);
  const [selected, setSelected] = useState<number>(3);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

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
    loadMood();
  }, [user, profile, loading]);

  async function loadMood() {
    if (!user) return;
    const { data } = await supabase
      .from("mood_entries")
      .select("*")
      .eq("user_id", user.id)
      .eq("entry_date", today)
      .maybeSingle();
    if (data) {
      setEntry(data as MoodEntry);
      setSelected(data.mood);
      setNote(data.note ?? "");
    }
  }

  async function handleSave() {
    if (!user || busy) return;
    setBusy(true);
    setSaved(false);

    if (entry) {
      await supabase
        .from("mood_entries")
        .update({ mood: selected, note: note || null })
        .eq("id", entry.id);
    } else {
      await supabase.from("mood_entries").insert({
        user_id: user.id,
        entry_date: today,
        mood: selected,
        note: note || null,
      });
    }

    setBusy(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
          Mood check-in
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          No judgment — just noticing how you feel.
        </p>
      </header>

      <div className="space-y-6">
        <div className="flex justify-between gap-2">
          {MOODS.map((m) => (
            <button
              key={m.value}
              onClick={() => setSelected(m.value)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-2xl border py-4 transition-all",
                selected === m.value
                  ? "border-primary bg-primary/10 scale-105"
                  : "border-border bg-card hover:border-primary/30",
              )}
            >
              <span className="text-3xl">{m.emoji}</span>
              <span
                className={cn(
                  "text-xs font-medium",
                  selected === m.value ? "text-primary" : "text-muted-foreground",
                )}
              >
                {m.label}
              </span>
            </button>
          ))}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Anything on your mind? (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="A word, a thought…"
            rows={3}
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
          />
        </div>

        <Button onClick={handleSave} className="w-full" size="lg" disabled={busy}>
          {busy ? "Saving…" : entry ? "Update check-in" : "Save check-in"}
        </Button>

        {saved && (
          <p className="text-center text-sm text-primary animate-rise">
            Saved. Thanks for checking in.
          </p>
        )}
      </div>
    </AppShell>
  );
}
