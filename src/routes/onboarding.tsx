import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage,
});

const FOCUS_AREAS = [
  "Health",
  "Mind",
  "Career",
  "Relationships",
  "Creativity",
  "Finances",
] as const;

const TIME_OPTIONS = ["5 min", "15 min", "30 min", "1 hour+"] as const;

function OnboardingPage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(profile?.display_name ?? "");
  const [areas, setAreas] = useState<string[]>(profile?.focus_areas ?? []);
  const [timePerDay, setTimePerDay] = useState<string>(profile?.time_per_day ?? "15 min");
  const [graceDays, setGraceDays] = useState<number>(3);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading]);

  function toggleArea(area: string) {
    setAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area],
    );
  }

  async function handleComplete(e: React.FormEvent) {
    e.preventDefault();
    if (!user || busy) return;
    setBusy(true);

    await supabase.from("profiles").upsert({
      id: user.id,
      display_name: name || user.email?.split("@")[0] || "Friend",
      focus_areas: areas,
      time_per_day: timePerDay,
      grace_days_per_month: graceDays,
      onboarding_completed: true,
    });

    await refreshProfile();
    setBusy(false);
    navigate({ to: "/" });
  }

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading…</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm animate-rise">
        <div className="mb-6 text-center">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
            Let's set you up
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            A few quick questions so we can tailor things for you.
          </p>
        </div>

        <form onSubmit={handleComplete} className="space-y-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              What should we call you?
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none ring-ring focus:ring-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              What do you want to focus on?
            </label>
            <div className="flex flex-wrap gap-2">
              {FOCUS_AREAS.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => toggleArea(area)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                    areas.includes(area)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              How much time per day?
            </label>
            <div className="flex flex-wrap gap-2">
              {TIME_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setTimePerDay(opt)}
                  className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                    timePerDay === opt
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Grace days per month: {graceDays}
            </label>
            <input
              type="range"
              min={0}
              max={10}
              value={graceDays}
              onChange={(e) => setGraceDays(Number(e.target.value))}
              className="w-full"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Days you can miss without breaking a streak.
            </p>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={busy}>
            {busy ? "Saving…" : "Get started"}
          </Button>
        </form>
      </div>
    </div>
  );
}
