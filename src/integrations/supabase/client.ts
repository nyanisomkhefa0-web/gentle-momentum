import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { brokeredPreviewStorage } from "./previewAuthStorage";

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL ?? import.meta.env.SUPABASE_URL) as string | undefined;
const SUPABASE_PUBLISHABLE_KEY = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY) as string | undefined;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.warn("[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.");
}

export const supabase = createClient<Database>(
  SUPABASE_URL ?? "https://placeholder.supabase.co",
  SUPABASE_PUBLISHABLE_KEY ?? "placeholder",
  {
    auth: {
      storage: brokeredPreviewStorage(),
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);
