import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/" });
  }, [user, loading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);

    if (mode === "signup") {
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name: email.split("@")[0] } },
      });
      if (err) setError(err.message);
      else setMessage("Check your email to confirm, or sign in if confirmation is disabled.");
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) setError(err.message);
      else navigate({ to: "/" });
    }
    setBusy(false);
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm animate-rise">
        <div className="mb-8 text-center">
          <p className="text-sm font-medium text-primary">Gentle Momentum</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground">
            {mode === "signin" ? "Welcome back" : "Start gently"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Habit tracking that respects real life.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-border/70 bg-card p-6 shadow-sm"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none ring-ring focus:ring-2"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none ring-ring focus:ring-2"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {message && <p className="text-sm text-primary">{message}</p>}

          <Button type="submit" className="w-full" size="lg" disabled={busy}>
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "signin" ? (
            <>
              New here?{" "}
              <button
                type="button"
                className="font-medium text-primary underline-offset-2 hover:underline"
                onClick={() => setMode("signup")}
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="font-medium text-primary underline-offset-2 hover:underline"
                onClick={() => setMode("signin")}
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
