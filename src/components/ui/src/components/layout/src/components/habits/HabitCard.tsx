import { Check, Minus, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Habit, HabitLog } from "@/types/database";

interface HabitCardProps {
  habit: Habit;
  log: HabitLog | null;
  onLog: (status: "full" | "minimum" | "skipped") => void;
  disabled?: boolean;
}

export function HabitCard({ habit, log, onLog, disabled }: HabitCardProps) {
  const status = log?.status ?? null;
  const done = status === "full" || status === "minimum";

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/70 bg-card p-4 shadow-sm transition-all",
        done && "border-primary/30 bg-sage-soft/40",
        status === "skipped" && "opacity-70",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-base font-semibold leading-tight text-foreground">
            {habit.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {status === "full"
              ? habit.full_version
              : status === "minimum"
                ? habit.minimum_version
                : status === "skipped"
                  ? log?.skip_reason || "Skipped today"
                  : `Full: ${habit.full_version}`}
          </p>
          {!status && (
            <p className="mt-0.5 text-xs text-muted-foreground/80">
              Min: {habit.minimum_version}
            </p>
          )}
        </div>
        {done && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-5 w-5" />
          </div>
        )}
      </div>

      {!status && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" className="flex-1" disabled={disabled} onClick={() => onLog("full")}>
            <Check className="h-4 w-4" />
            Full
          </Button>
          <Button size="sm" variant="soft" className="flex-1" disabled={disabled} onClick={() => onLog("minimum")}>
            <Minus className="h-4 w-4" />
            Minimum
          </Button>
          <Button size="sm" variant="ghost" disabled={disabled} onClick={() => onLog("skipped")}>
            <SkipForward className="h-4 w-4" />
            Skip
          </Button>
        </div>
      )}
    </div>
  );
}
