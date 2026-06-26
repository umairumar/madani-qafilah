import { createClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://esttchhawelalwbawipn.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzdHRjaGhhd2VsYWx3YmF3aXBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NDc2NDgsImV4cCI6MjA5NjQyMzY0OH0.x3OfstXMaBGNwj6zZLdyHcFF-3OoL6GyWwNxVfnzFU4";

const url = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
    autoRefreshToken: true,
  },
});

export const isSupabaseConfigured = true;
