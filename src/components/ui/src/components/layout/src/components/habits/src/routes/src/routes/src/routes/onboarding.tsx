import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage,
});

const FOCUS_OPTIONS = [
  "Health",
  "Fitness",
  "Mindfulness",
  "Learning",
  "Career",
  "Relationships",
  "Creativity",
  "Home",
];

function OnboardingPage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [timePerDay, setTimePerDay] = useState("15–30 min");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    if (profile?.onboarding_completed) {
      navigate({ to: "/" });
      return;
    }
    if (profile?.display_name) setDisplayName(profile.display_name);
  }, [user, profile, loading]);

  function toggleFocus(area: string) {
    setFocusAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area].slice(0, 4),
    );
  }

  async function finish() {
    if (!user || busy) return;
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName.trim() || "Friend",
        focus_areas: focusAreas,
        time_per_day: timePerDay,
        onboarding_completed: true,
      })
      .eq("id", user.id);

    if (!error) {
      await refreshProfile();
      navigate({ to: "/" });
    }
    setBusy(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading…</div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-4 py-10">
      <div className="mb-8">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn("h-1.5 flex-1 rounded-full", i <= step ? "bg-primary" : "bg-muted")}
            />
          ))}
        </div>
      </div>

      {step === 0 && (
        <div className="animate-rise">
          <h1 className="font-display text-2xl font-semibold text-foreground">
            What should we call you?
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">A first name is perfect.</p>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="mt-6 h-12 w-full rounded-xl border border-input bg-card px-4 text-base outline-none ring-ring focus:ring-2"
            placeholder="Your name"
            autoFocus
          />
          <Button
            className="mt-8 w-full"
            size="lg"
            onClick={() => setStep(1)}
            disabled={!displayName.trim()}
          >
            Continue
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="animate-rise">
          <h1 className="font-display text-2xl font-semibold text-foreground">
            What matters right now?
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Pick up to 4 focus areas.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {FOCUS_OPTIONS.map((area) => {
              const selected = focusAreas.includes(area);
              return (
                <button
                  key={area}
                  type="button"
                  onClick={() => toggleFocus(area)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:border-primary/40",
                  )}
                >
                  {area}
                </button>
              );
            })}
          </div>
          <div className="mt-8 flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setStep(0)}>
              Back
            </Button>
            <Button className="flex-1" onClick={() => setStep(2)} disabled={focusAreas.length === 0}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-rise">
          <h1 className="font-display text-2xl font-semibold text-foreground">
            How much time can you give?
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">We’ll keep suggestions realistic.</p>
          <div className="mt-6 space-y-2">
            {["Under 15 min", "15–30 min", "30–60 min", "An hour or more"].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setTimePerDay(opt)}
                className={cn(
                  "flex w-full items-center rounded-xl border px-4 py-3 text-left text-sm font-medium transition",
                  timePerDay === opt
                    ? "border-primary bg-sage-soft text-foreground"
                    : "border-border bg-card hover:border-primary/40",
                )}
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="mt-8 flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button className="flex-1" size="lg" onClick={finish} disabled={busy}>
              {busy ? "Saving…" : "Start building momentum"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
