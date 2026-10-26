import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Target, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Today", icon: Home },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/mood", label: "Mood", icon: Sparkles },
  { to: "/profile", label: "You", icon: User },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <main className="mx-auto w-full max-w-lg flex-1 px-4 pb-28 pt-6">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2 safe-pb">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || (to !== "/" && pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex min-w-[4.5rem] flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-[11px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className={cn("h-5 w-5", active && "stroke-[2.25px]")} />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
