create table public.profiles (
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

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  area text not null,
  why text,
  target_date date,
  status text not null default 'active' check (status in ('active','paused','completed')),
  paused_reason text,
  created_at timestamptz not null default now()
);

create table public.habits (
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
  created_at timestamptz not null default now()
);

create table public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  log_date date not null,
  status text not null check (status in ('full','minimum','skipped','missed')),
  skip_reason text,
  created_at timestamptz not null default now(),
  unique (habit_id, log_date)
);

create table public.mood_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  entry_date date not null,
  mood int not null check (mood between 1 and 5),
  note text,
  created_at timestamptz not null default now(),
  unique (user_id, entry_date)
);

create table public.partnerships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  partner_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'active' check (status in ('active','paused','ended')),
  created_at timestamptz not null default now(),
  check (user_id <> partner_id)
);

create table public.partnership_shared_goals (
  id uuid primary key default gen_random_uuid(),
  partnership_id uuid not null references public.partnerships(id) on delete cascade,
  goal_id uuid not null references public.goals(id) on delete cascade,
  unique (partnership_id, goal_id)
);

create table public.encouragements (
  id uuid primary key default gen_random_uuid(),
  partnership_id uuid not null references public.partnerships(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('cheer','nudge','thinking_of_you','message')),
  message text,
  created_at timestamptz not null default now()
);

create table public.weekly_reflections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  week_start date not null,
  content text not null,
  created_at timestamptz not null default now(),
  unique (user_id, week_start)
);

create table public.invites (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  inviter_id uuid not null references public.profiles(id) on delete cascade,
  accepted_by uuid references public.profiles(id),
  status text not null default 'pending' check (status in ('pending','accepted','cancelled')),
  created_at timestamptz not null default now()
);

grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
grant select, insert, update, delete on public.goals to authenticated;
grant all on public.goals to service_role;
grant select, insert, update, delete on public.habits to authenticated;
grant all on public.habits to service_role;
grant select, insert, update, delete on public.habit_logs to authenticated;
grant all on public.habit_logs to service_role;
grant select, insert, update, delete on public.mood_entries to authenticated;
grant all on public.mood_entries to service_role;
grant select, insert, update, delete on public.partnerships to authenticated;
grant all on public.partnerships to service_role;
grant select, insert, update, delete on public.partnership_shared_goals to authenticated;
grant all on public.partnership_shared_goals to service_role;
grant select, insert, update, delete on public.encouragements to authenticated;
grant all on public.encouragements to service_role;
grant select, insert, update, delete on public.weekly_reflections to authenticated;
grant all on public.weekly_reflections to service_role;
grant select, insert, update, delete on public.invites to authenticated;
grant all on public.invites to service_role;

alter table public.profiles enable row level security;
alter table public.goals enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.mood_entries enable row level security;
alter table public.partnerships enable row level security;
alter table public.partnership_shared_goals enable row level security;
alter table public.encouragements enable row level security;
alter table public.weekly_reflections enable row level security;
alter table public.invites enable row level security;

create policy "read own or partner profile" on public.profiles
  for select to authenticated
  using (
    id = auth.uid()
    or exists (
      select 1 from public.partnerships p
      where p.status = 'active'
        and ((p.user_id = auth.uid() and p.partner_id = profiles.id)
          or (p.partner_id = auth.uid() and p.user_id = profiles.id))
    )
  );
create policy "insert own profile" on public.profiles
  for insert to authenticated with check (id = auth.uid());
create policy "update own profile" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "delete own profile" on public.profiles
  for delete to authenticated using (id = auth.uid());

create policy "read own or shared goals" on public.goals
  for select to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.partnership_shared_goals psg
      join public.partnerships p on p.id = psg.partnership_id
      where psg.goal_id = goals.id and p.status = 'active'
        and (p.user_id = auth.uid() or p.partner_id = auth.uid())
    )
  );
create policy "insert own goals" on public.goals
  for insert to authenticated with check (user_id = auth.uid());
create policy "update own goals" on public.goals
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "delete own goals" on public.goals
  for delete to authenticated using (user_id = auth.uid());

create policy "read own or shared habits" on public.habits
  for select to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.partnership_shared_goals psg
      join public.partnerships p on p.id = psg.partnership_id
      where psg.goal_id = habits.goal_id and p.status = 'active'
        and (p.user_id = auth.uid() or p.partner_id = auth.uid())
    )
  );
create policy "insert own habits" on public.habits
  for insert to authenticated with check (user_id = auth.uid());
create policy "update own habits" on public.habits
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "delete own habits" on public.habits
  for delete to authenticated using (user_id = auth.uid());

create policy "read own or shared-goal logs" on public.habit_logs
  for select to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.habits h
      join public.partnership_shared_goals psg on psg.goal_id = h.goal_id
      join public.partnerships p on p.id = psg.partnership_id
      where h.id = habit_logs.habit_id and p.status = 'active'
        and (p.user_id = auth.uid() or p.partner_id = auth.uid())
    )
  );
create policy "insert own logs" on public.habit_logs
  for insert to authenticated with check (user_id = auth.uid());
create policy "update own logs" on public.habit_logs
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "delete own logs" on public.habit_logs
  for delete to authenticated using (user_id = auth.uid());

create policy "read own or opt-in moods" on public.mood_entries
  for select to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.partnerships p
      join public.profiles pr on pr.id = mood_entries.user_id
      where pr.share_mood = true and p.status = 'active'
        and ((p.user_id = mood_entries.user_id and p.partner_id = auth.uid())
          or (p.partner_id = mood_entries.user_id and p.user_id = auth.uid()))
    )
  );
create policy "insert own moods" on public.mood_entries
  for insert to authenticated with check (user_id = auth.uid());
create policy "update own moods" on public.mood_entries
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "delete own moods" on public.mood_entries
  for delete to authenticated using (user_id = auth.uid());

create policy "partners see partnership" on public.partnerships
  for select to authenticated
  using (user_id = auth.uid() or partner_id = auth.uid());
create policy "invite partnerships" on public.partnerships
  for insert to authenticated with check (user_id = auth.uid());
create policy "update own partnership" on public.partnerships
  for update to authenticated
  using (user_id = auth.uid() or partner_id = auth.uid())
  with check (user_id = auth.uid() or partner_id = auth.uid());
create policy "end own partnership" on public.partnerships
  for delete to authenticated
  using (user_id = auth.uid() or partner_id = auth.uid());

create policy "see shared goals" on public.partnership_shared_goals
  for select to authenticated
  using (
    exists (
      select 1 from public.partnerships p
      where p.id = partnership_shared_goals.partnership_id and p.status <> 'ended'
        and (p.user_id = auth.uid() or p.partner_id = auth.uid())
    )
  );
create policy "share own goals" on public.partnership_shared_goals
  for insert to authenticated
  with check (
    exists (select 1 from public.goals g where g.id = partnership_shared_goals.goal_id and g.user_id = auth.uid())
    and exists (
      select 1 from public.partnerships p
      where p.id = partnership_shared_goals.partnership_id
        and (p.user_id = auth.uid() or p.partner_id = auth.uid())
    )
  );
create policy "unshare own goals" on public.partnership_shared_goals
  for delete to authenticated
  using (
    exists (select 1 from public.goals g where g.id = partnership_shared_goals.goal_id and g.user_id = auth.uid())
    or exists (
      select 1 from public.partnerships p
      where p.id = partnership_shared_goals.partnership_id
        and (p.user_id = auth.uid() or p.partner_id = auth.uid())
    )
  );

create policy "read encouragements in my partnerships" on public.encouragements
  for select to authenticated
  using (
    exists (
      select 1 from public.partnerships p
      where p.id = encouragements.partnership_id and p.status <> 'ended'
        and (p.user_id = auth.uid() or p.partner_id = auth.uid())
    )
  );
create policy "send encouragements" on public.encouragements
  for insert to authenticated
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.partnerships p
      where p.id = encouragements.partnership_id and p.status = 'active'
        and (p.user_id = auth.uid() or p.partner_id = auth.uid())
    )
  );

create policy "read own or partner reflections" on public.weekly_reflections
  for select to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.partnerships p
      where p.status = 'active'
        and ((p.user_id = auth.uid() and p.partner_id = weekly_reflections.user_id)
          or (p.partner_id = auth.uid() and p.user_id = weekly_reflections.user_id))
    )
  );
create policy "write own reflections" on public.weekly_reflections
  for insert to authenticated with check (user_id = auth.uid());
create policy "update own reflections" on public.weekly_reflections
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "read invites" on public.invites
  for select to authenticated
  using (inviter_id = auth.uid() or status = 'pending');
create policy "create invites" on public.invites
  for insert to authenticated with check (inviter_id = auth.uid());
create policy "accept or cancel invites" on public.invites
  for update to authenticated
  using (inviter_id = auth.uid() or status = 'pending')
  with check (inviter_id = auth.uid() or status = 'pending');

create index habit_logs_user_date_idx on public.habit_logs (user_id, log_date);
create index habit_logs_habit_idx on public.habit_logs (habit_id);
create index habits_goal_idx on public.habits (goal_id);
create index goals_user_idx on public.goals (user_id);
create index partnerships_user_idx on public.partnerships (user_id);
create index partnerships_partner_idx on public.partnerships (partner_id);
create index partnership_shared_goals_p_idx on public.partnership_shared_goals (partnership_id);
create index encouragements_partnership_idx on public.encouragements (partnership_id);

create or replace function public.handle_new_user()
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
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
