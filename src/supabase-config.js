// Supabase configuration for Left Wordle cloud sync.
// Keep sync disabled until schema, auth flow, and UI are fully ready.
window.SUPABASE_SYNC_ENABLED = false;
window.SUPABASE_URL = "https://pxzmjxjbfggbvjwattky.supabase.co";
window.SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4em1qeGpiZmdnYnZqd2F0dGt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0ODg4NjYsImV4cCI6MjA4NjA2NDg2Nn0.7Fh8ygvg2SVOLwCHye1DM0aUH1PBvLcS5-aoCeWsmDA";

// Magic link delivery strategy:
// false: use client.auth.signInWithOtp (Supabase default mail flow)
// true: invoke edge function (supports custom email templates)
window.SUPABASE_MAGIC_LINK_USE_EDGE_FUNCTION = false;
window.SUPABASE_MAGIC_LINK_FUNCTION_NAME = "send-magic-link";
window.SUPABASE_MAGIC_LINK_REDIRECT_PATH = "/sync-resolve";
