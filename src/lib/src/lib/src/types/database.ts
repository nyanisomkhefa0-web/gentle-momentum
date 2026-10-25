export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          photo_url: string | null;
          focus_areas: string[];
          time_per_day: string | null;
          grace_days_per_month: number;
          share_mood: boolean;
          share_streak: boolean;
          onboarding_completed: boolean;
          reminders_enabled: boolean;
          default_reminder_time: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name?: string;
          focus_areas?: string[];
          time_per_day?: string | null;
          onboarding_completed?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          area: string;
          why: string | null;
          target_date: string | null;
          status: "active" | "paused" | "completed" | "archived";
          paused_reason: string | null;
          pause_periods: Json;
          created_at: string;
        };
        Insert: {
          user_id: string;
          name: string;
          area: string;
          why?: string | null;
          status?: "active" | "paused" | "completed" | "archived";
        };
        Update: Partial<Database["public"]["Tables"]["goals"]["Insert"]>;
      };
      habits: {
        Row: {
          id: string;
          goal_id: string;
          user_id: string;
          name: string;
          frequency_type: "daily" | "weekdays" | "weekly_x";
          weekdays: number[];
          times_per_week: number | null;
          reminder_time: string | null;
          full_version: string;
          minimum_version: string;
          status: "active" | "paused" | "archived";
          paused_reason: string | null;
          pause_periods: Json;
          created_at: string;
        };
        Insert: {
          goal_id: string;
          user_id: string;
          name: string;
          full_version: string;
          minimum_version: string;
          frequency_type?: "daily" | "weekdays" | "weekly_x";
          status?: "active" | "paused" | "archived";
        };
        Update: Partial<Database["public"]["Tables"]["habits"]["Insert"]>;
      };
      habit_logs: {
        Row: {
          id: string;
          habit_id: string;
          user_id: string;
          log_date: string;
          status: "full" | "minimum" | "skipped" | "missed";
          skip_reason: string | null;
          created_at: string;
        };
        Insert: {
          habit_id: string;
          user_id: string;
          log_date: string;
          status: "full" | "minimum" | "skipped" | "missed";
          skip_reason?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["habit_logs"]["Insert"]>;
      };
      mood_entries: {
        Row: {
          id: string;
          user_id: string;
          entry_date: string;
          mood: number;
          note: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          entry_date: string;
          mood: number;
          note?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["mood_entries"]["Insert"]>;
      };
    };
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Goal = Database["public"]["Tables"]["goals"]["Row"];
export type Habit = Database["public"]["Tables"]["habits"]["Row"];
export type HabitLog = Database["public"]["Tables"]["habit_logs"]["Row"];
export type MoodEntry = Database["public"]["Tables"]["mood_entries"]["Row"];
