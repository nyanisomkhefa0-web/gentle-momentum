import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(profile?.display_name ?? "");
  const [reminders, setReminders] = useState(profile?.reminders_enabled ?? false);
  const [shareMood, setShareMood] = useState(profile?.share_mood ?? false);
  const [shareStreak, setShareStreak] = useState(profile?.share_streak ?? false);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    setName(profile?.display_name ?? "");
    setReminders(profile?.reminders_enabled ?? false);
    setShareMood(profile?.share_mood ?? false);
    setShareStreak(profile?.share_streak ?? false);
  }, [user, profile, loading]);

  async function handleSave() {
    if (!user || busy) return;
    setBusy(true);
    await supabase
      .from("profiles")
      .update({
        display_name: name,
        reminders_enabled: reminders,
        share_mood: shareMood,
        share_streak: shareStreak,
      })
      .eq("id", user.id);
    await refreshProfile();
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
          Your profile
        </h1>
      </header>

      <div className="space-y-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none ring-ring focus:ring-2"
          />
        </div>

        {(profile?.focus_areas ?? []).length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Focus areas</p>
            <div className="flex flex-wrap gap-2">
              {(profile?.focus_areas ?? []).map((area) => (
                <span
                  key={area}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <ToggleRow
            label="Reminders"
            description="Get gentle nudges to check in"
            checked={reminders}
            onChange={setReminders}
          />
          <ToggleRow
            label="Share mood"
            description="Let your mood check-ins be visible"
            checked={shareMood}
            onChange={setShareMood}
          />
          <ToggleRow
            label="Share streak"
            description="Let your streak count be visible"
            checked={shareStreak}
            onChange={setShareStreak}
          />
        </div>

        <Button onClick={handleSave} className="w-full" size="lg" disabled={busy}>
          {busy ? "Saving…" : "Save changes"}
        </Button>

        {saved && (
          <p className="text-center text-sm text-primary animate-rise">Changes saved.</p>
        )}

        <div className="pt-4">
          <button
            type="button"
            onClick={() => {
              signOut();
              navigate({ to: "/auth" });
            }}
            className="w-full text-center text-sm text-muted-foreground underline-offset-2 hover:underline"
          >
            Sign out
          </button>
        </div>
      </div>
    </AppShell>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/70 bg-card px-4 py-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-muted"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
