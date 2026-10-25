// Shared row types for my.GOALs (mirrors the database schema)

export type LifeArea =
  | "health"
  | "study"
  | "career"
  | "relationships"
  | "creativity"
  | "finances"
  | "spiritual"
  | "other";

export const LIFE_AREAS: { value: LifeArea; label: string; emoji: string; color: string }[] = [
  { value: "health", label: "Health", emoji: "🌿", color: "var(--sage)" },
  { value: "study", label: "Study", emoji: "📚", color: "var(--sky)" },
  { value: "career", label: "Career", emoji: "💼", color: "var(--sky)" },
  { value: "relationships", label: "Relationships", emoji: "💛", color: "var(--peach)" },
  { value: "creativity", label: "Creativity", emoji: "🎨", color: "var(--lilac)" },
  { value: "finances", label: "Finances", emoji: "💰", color: "var(--clay)" },
  { value: "spiritual", label: "Spiritual", emoji: "🕊️", color: "var(--lilac)" },
  { value: "other", label: "Other", emoji: "✨", color: "var(--peach)" },
];

export type GoalStatus = "active" | "paused" | "completed" | "archived";
export type HabitStatus = "active" | "paused" | "archived";
export type LogStatus = "full" | "minimum" | "skipped" | "missed";
export type FrequencyType = "daily" | "weekdays" | "weekly_x";
export type PausePeriod = { start: string; end: string | null };
export type TimePerDay = "15" | "30" | "45" | "60";

export interface Profile {
  id: string;
  display_name: string;
  photo_url: string | null;
  focus_areas: string[];
  time_per_day: TimePerDay | null;
  grace_days_per_month: number;
  share_mood: boolean;
  share_streak: boolean;
  onboarding_completed: boolean;
  reminders_enabled: boolean;
  default_reminder_time: string | null;
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  area: LifeArea;
  why: string | null;
  target_date: string | null;
  status: GoalStatus;
  paused_reason: string | null;
  pause_periods: PausePeriod[];
  created_at: string;
}

export interface Habit {
  id: string;
  goal_id: string;
  user_id: string;
  name: string;
  frequency_type: FrequencyType;
  weekdays: number[];
  times_per_week: number | null;
  reminder_time: string | null;
  full_version: string;
  minimum_version: string;
  status: HabitStatus;
  paused_reason: string | null;
  pause_periods: PausePeriod[];
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  log_date: string;
  status: LogStatus;
  skip_reason: string | null;
  created_at: string;
}

export interface MoodEntry {
  id: string;
  user_id: string;
  entry_date: string;
  mood: number; // 1 drained … 5 energised
  note: string | null;
  created_at: string;
}

export interface Partnership {
  id: string;
  user_id: string;
  partner_id: string;
  status: "active" | "paused" | "ended";
  created_at: string;
}

export interface SharedGoal {
  id: string;
  partnership_id: string;
  goal_id: string;
}

export interface Encouragement {
  id: string;
  partnership_id: string;
  sender_id: string;
  receiver_id: string;
  kind: "cheer" | "nudge" | "thinking_of_you" | "message";
  message: string | null;
  created_at: string;
}

export interface WeeklyReflection {
  id: string;
  user_id: string;
  week_start: string;
  content: string;
  created_at: string;
}

export interface Invite {
  id: string;
  code: string;
  inviter_id: string;
  accepted_by: string | null;
  status: "pending" | "accepted" | "cancelled";
  created_at: string;
}

export const SKIP_REASONS = [
  "Rest day",
  "Sick",
  "Life happened",
  "Travel",
  "Low energy",
  "Other",
] as const;

export const TIME_PER_DAY_OPTIONS: { value: TimePerDay; label: string }[] = [
  { value: "15", label: "About 15 minutes" },
  { value: "30", label: "Around 30 minutes" },
  { value: "45", label: "45 minutes or so" },
  { value: "60", label: "An hour or more" },
];
