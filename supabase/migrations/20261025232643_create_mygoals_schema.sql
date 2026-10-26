/*
# Create MyGoals schema — full habit-tracking app

## Overview
Creates all tables for a gentle habit-tracking app with auth, goals, habits,
daily logs, mood check-ins, accountability partnerships, and weekly reflections.

## Tables created
- `profiles` — user profile linked to auth.users, with display name, focus areas,
  grace days, sharing preferences, and onboarding state.
- `goals` — user goals with area, motivation ("why"), status, and pause periods.
- `habits` — habits belonging to a goal, with full/minimum versions, frequency
  type, weekdays, and pause periods.
- `habit_logs` — daily log entries per habit (full / minimum / skipped / missed).
- `mood_entries` — daily mood check-ins (1–5 scale) with optional note.
- `partnerships` — accountability partner relationships between two users.
- `partnership_shared_goals` — goals shared within a partnership.
- `encouragements` — messages sent between partners.
- `weekly_reflections` — weekly journal entries per user.
- `invites` — invite codes for bringing in new partners.

## Security
- RLS enabled on every table.
- CRUD grants to `authenticated`; full grants to `service_role`.
- Owner-scoped policies using `auth.uid()` for profiles, goals, habits, logs,
  moods, reflections, and invites.
- Partnership-aware policies allow partners to see each other's shared data.
- A trigger auto-creates a profile row when a new auth user signs up.

## Notes
- `user_id` columns do NOT have `DEFAULT auth.uid()` because the frontend
  explicitly passes `user_id` on every insert. If this causes issues, add the
  default later.
*/

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  photo_url text,
  focus_areas text[] not null default '{}',
  time_per_day text,
  grace_days_per_month int not null default 3,
  share_mood boolean not null default false,
  share_streak boolean not null default true,
  onboarding_completed boolean not null default false,
  reminders_enabled boolean not null default true,
  default_reminder_time text,
  created_at timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  area text not null,
  why text,
  target_date date,
  status text not null default 'active' check (status in ('active','paused','completed','archived')),
  paused_reason text,
  pause_periods jsonb not null default '[]',
  created_at timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS public.habits (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  frequency_type text not null default 'daily' check (frequency_type in ('daily','weekdays','weekly_x')),
  weekdays int[] not null default '{}',
  times_per_week int,
  reminder_time text,
  full_version text not null,
  minimum_version text not null,
  status text not null default 'active' check (status in ('active','paused','archived')),
  paused_reason text,
  pause_periods jsonb not null default '[]',
  created_at timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  log_date date not null,
  status text not null check (status in ('full','minimum','skipped','missed')),
  skip_reason text,
  created_at timestamptz not null default now(),
  unique (habit_id, log_date)
);

CREATE TABLE IF NOT EXISTS public.mood_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  entry_date date not null,
  mood int not null check (mood between 1 and 5),
  note text,
  created_at timestamptz not null default now(),
  unique (user_id, entry_date)
);

CREATE TABLE IF NOT EXISTS public.partnerships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  partner_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'active' check (status in ('active','paused','ended')),
  created_at timestamptz not null default now(),
  check (user_id <> partner_id)
);

CREATE TABLE IF NOT EXISTS public.partnership_shared_goals (
  id uuid primary key default gen_random_uuid(),
  partnership_id uuid not null references public.partnerships(id) on delete cascade,
  goal_id uuid not null references public.goals(id) on delete cascade,
  unique (partnership_id, goal_id)
);

CREATE TABLE IF NOT EXISTS public.encouragements (
  id uuid primary key default gen_random_uuid(),
  partnership_id uuid not null references public.partnerships(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('cheer','nudge','thinking_of_you','message')),
  message text,
  created_at timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS public.weekly_reflections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  week_start date not null,
  content text not null,
  created_at timestamptz not null default now(),
  unique (user_id, week_start)
);

CREATE TABLE IF NOT EXISTS public.invites (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  inviter_id uuid not null references public.profiles(id) on delete cascade,
  accepted_by uuid references public.profiles(id),
  status text not null default 'pending' check (status in ('pending','accepted','cancelled')),
  created_at timestamptz not null default now()
);

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.goals TO authenticated;
GRANT ALL ON public.goals TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.habits TO authenticated;
GRANT ALL ON public.habits TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.habit_logs TO authenticated;
GRANT ALL ON public.habit_logs TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mood_entries TO authenticated;
GRANT ALL ON public.mood_entries TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partnerships TO authenticated;
GRANT ALL ON public.partnerships TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partnership_shared_goals TO authenticated;
GRANT ALL ON public.partnership_shared_goals TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.encouragements TO authenticated;
GRANT ALL ON public.encouragements TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.weekly_reflections TO authenticated;
GRANT ALL ON public.weekly_reflections TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invites TO authenticated;
GRANT ALL ON public.invites TO service_role;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnership_shared_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.encouragements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "read own or partner profile" ON public.profiles;
CREATE POLICY "read own or partner profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    id = auth.uid()
    or exists (
      select 1 from public.partnerships p
      where p.status = 'active'
        and ((p.user_id = auth.uid() and p.partner_id = profiles.id)
          or (p.partner_id = auth.uid() and p.user_id = profiles.id))
    )
  );
DROP POLICY IF EXISTS "insert own profile" ON public.profiles;
CREATE POLICY "insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
DROP POLICY IF EXISTS "update own profile" ON public.profiles;
CREATE POLICY "update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
DROP POLICY IF EXISTS "delete own profile" ON public.profiles;
CREATE POLICY "delete own profile" ON public.profiles
  FOR DELETE TO authenticated USING (id = auth.uid());

-- Goals policies
DROP POLICY IF EXISTS "read own or shared goals" ON public.goals;
CREATE POLICY "read own or shared goals" ON public.goals
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    or exists (
      select 1 from public.partnership_shared_goals psg
      join public.partnerships p on p.id = psg.partnership_id
      where psg.goal_id = goals.id and p.status = 'active'
        and (p.user_id = auth.uid() or p.partner_id = auth.uid())
    )
  );
DROP POLICY IF EXISTS "insert own goals" ON public.goals;
CREATE POLICY "insert own goals" ON public.goals
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "update own goals" ON public.goals;
CREATE POLICY "update own goals" ON public.goals
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "delete own goals" ON public.goals;
CREATE POLICY "delete own goals" ON public.goals
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Habits policies
DROP POLICY IF EXISTS "read own or shared habits" ON public.habits;
CREATE POLICY "read own or shared habits" ON public.habits
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    or exists (
      select 1 from public.partnership_shared_goals psg
      join public.partnerships p on p.id = psg.partnership_id
      where psg.goal_id = habits.goal_id and p.status = 'active'
        and (p.user_id = auth.uid() or p.partner_id = auth.uid())
    )
  );
DROP POLICY IF EXISTS "insert own habits" ON public.habits;
CREATE POLICY "insert own habits" ON public.habits
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "update own habits" ON public.habits;
CREATE POLICY "update own habits" ON public.habits
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "delete own habits" ON public.habits;
CREATE POLICY "delete own habits" ON public.habits
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Habit logs policies
DROP POLICY IF EXISTS "read own or shared-goal logs" ON public.habit_logs;
CREATE POLICY "read own or shared-goal logs" ON public.habit_logs
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    or exists (
      select 1 from public.habits h
      join public.partnership_shared_goals psg on psg.goal_id = h.goal_id
      join public.partnerships p on p.id = psg.partnership_id
      where h.id = habit_logs.habit_id and p.status = 'active'
        and (p.user_id = auth.uid() or p.partner_id = auth.uid())
    )
  );
DROP POLICY IF EXISTS "insert own logs" ON public.habit_logs;
CREATE POLICY "insert own logs" ON public.habit_logs
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "update own logs" ON public.habit_logs;
CREATE POLICY "update own logs" ON public.habit_logs
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "delete own logs" ON public.habit_logs;
CREATE POLICY "delete own logs" ON public.habit_logs
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Mood entries policies
DROP POLICY IF EXISTS "read own or opt-in moods" ON public.mood_entries;
CREATE POLICY "read own or opt-in moods" ON public.mood_entries
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    or exists (
      select 1 from public.partnerships p
      join public.profiles pr on pr.id = mood_entries.user_id
      where pr.share_mood = true and p.status = 'active'
        and ((p.user_id = mood_entries.user_id and p.partner_id = auth.uid())
          or (p.partner_id = mood_entries.user_id and p.user_id = auth.uid()))
    )
  );
DROP POLICY IF EXISTS "insert own moods" ON public.mood_entries;
CREATE POLICY "insert own moods" ON public.mood_entries
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "update own moods" ON public.mood_entries;
CREATE POLICY "update own moods" ON public.mood_entries
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "delete own moods" ON public.mood_entries;
CREATE POLICY "delete own moods" ON public.mood_entries
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Partnerships policies
DROP POLICY IF EXISTS "partners see partnership" ON public.partnerships;
CREATE POLICY "partners see partnership" ON public.partnerships
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() or partner_id = auth.uid());
DROP POLICY IF EXISTS "invite partnerships" ON public.partnerships;
CREATE POLICY "invite partnerships" ON public.partnerships
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "update own partnership" ON public.partnerships;
CREATE POLICY "update own partnership" ON public.partnerships
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() or partner_id = auth.uid())
  WITH CHECK (user_id = auth.uid() or partner_id = auth.uid());
DROP POLICY IF EXISTS "end own partnership" ON public.partnerships;
CREATE POLICY "end own partnership" ON public.partnerships
  FOR DELETE TO authenticated
  USING (user_id = auth.uid() or partner_id = auth.uid());

-- Partnership shared goals policies
DROP POLICY IF EXISTS "see shared goals" ON public.partnership_shared_goals;
CREATE POLICY "see shared goals" ON public.partnership_shared_goals
  FOR SELECT TO authenticated
  USING (
    exists (
      select 1 from public.partnerships p
      where p.id = partnership_shared_goals.partnership_id and p.status <> 'ended'
        and (p.user_id = auth.uid() or p.partner_id = auth.uid())
    )
  );
DROP POLICY IF EXISTS "share own goals" ON public.partnership_shared_goals;
CREATE POLICY "share own goals" ON public.partnership_shared_goals
  FOR INSERT TO authenticated
  WITH CHECK (
    exists (select 1 from public.goals g where g.id = partnership_shared_goals.goal_id and g.user_id = auth.uid())
    and exists (
      select 1 from public.partnerships p
      where p.id = partnership_shared_goals.partnership_id
        and (p.user_id = auth.uid() or p.partner_id = auth.uid())
    )
  );
DROP POLICY IF EXISTS "unshare own goals" ON public.partnership_shared_goals;
CREATE POLICY "unshare own goals" ON public.partnership_shared_goals
  FOR DELETE TO authenticated
  USING (
    exists (select 1 from public.goals g where g.id = partnership_shared_goals.goal_id and g.user_id = auth.uid())
    or exists (
      select 1 from public.partnerships p
      where p.id = partnership_shared_goals.partnership_id
        and (p.user_id = auth.uid() or p.partner_id = auth.uid())
    )
  );

-- Encouragements policies
DROP POLICY IF EXISTS "read encouragements in my partnerships" ON public.encouragements;
CREATE POLICY "read encouragements in my partnerships" ON public.encouragements
  FOR SELECT TO authenticated
  USING (
    exists (
      select 1 from public.partnerships p
      where p.id = encouragements.partnership_id and p.status <> 'ended'
        and (p.user_id = auth.uid() or p.partner_id = auth.uid())
    )
  );
DROP POLICY IF EXISTS "send encouragements" ON public.encouragements;
CREATE POLICY "send encouragements" ON public.encouragements
  FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    and exists (
      select 1 from public.partnerships p
      where p.id = encouragements.partnership_id and p.status = 'active'
        and (p.user_id = auth.uid() or p.partner_id = auth.uid())
    )
  );

-- Weekly reflections policies
DROP POLICY IF EXISTS "read own or partner reflections" ON public.weekly_reflections;
CREATE POLICY "read own or partner reflections" ON public.weekly_reflections
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    or exists (
      select 1 from public.partnerships p
      where p.status = 'active'
        and ((p.user_id = auth.uid() and p.partner_id = weekly_reflections.user_id)
          or (p.partner_id = auth.uid() and p.user_id = weekly_reflections.user_id))
    )
  );
DROP POLICY IF EXISTS "write own reflections" ON public.weekly_reflections;
CREATE POLICY "write own reflections" ON public.weekly_reflections
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "update own reflections" ON public.weekly_reflections;
CREATE POLICY "update own reflections" ON public.weekly_reflections
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Invites policies
DROP POLICY IF EXISTS "read invites" ON public.invites;
CREATE POLICY "read invites" ON public.invites
  FOR SELECT TO authenticated
  USING (inviter_id = auth.uid() or status = 'pending');
DROP POLICY IF EXISTS "create invites" ON public.invites;
CREATE POLICY "create invites" ON public.invites
  FOR INSERT TO authenticated WITH CHECK (inviter_id = auth.uid());
DROP POLICY IF EXISTS "accept or cancel invites" ON public.invites;
CREATE POLICY "accept or cancel invites" ON public.invites
  FOR UPDATE TO authenticated
  USING (inviter_id = auth.uid() or status = 'pending')
  WITH CHECK (inviter_id = auth.uid() or status = 'pending');

-- Indexes
CREATE INDEX IF NOT EXISTS habit_logs_user_date_idx ON public.habit_logs (user_id, log_date);
CREATE INDEX IF NOT EXISTS habit_logs_habit_idx ON public.habit_logs (habit_id);
CREATE INDEX IF NOT EXISTS habits_goal_idx ON public.habits (goal_id);
CREATE INDEX IF NOT EXISTS goals_user_idx ON public.goals (user_id);
CREATE INDEX IF NOT EXISTS partnerships_user_idx ON public.partnerships (user_id);
CREATE INDEX IF NOT EXISTS partnerships_partner_idx ON public.partnerships (partner_id);
CREATE INDEX IF NOT EXISTS partnership_shared_goals_p_idx ON public.partnership_shared_goals (partnership_id);
CREATE INDEX IF NOT EXISTS encouragements_partnership_idx ON public.encouragements (partnership_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'full_name',
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
