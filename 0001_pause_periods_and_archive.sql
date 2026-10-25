alter table public.goals add column pause_periods jsonb not null default '[]';
alter table public.habits add column pause_periods jsonb not null default '[]';
alter table public.goals drop constraint goals_status_check;
alter table public.goals add constraint goals_status_check check (status in ('active','paused','completed','archived'));
