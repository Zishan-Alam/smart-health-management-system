// Wrapper client that provides fallbacks if Vite env vars are not injected
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// NOTE: The anon key is a publishable key. It's safe to embed as a fallback.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://sliyeuqlempfgqeioqjn.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsaXlldXFsZW1wZmdxZWlvcWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0OTE3NTcsImV4cCI6MjA3ODA2Nzc1N30.jT1muXyAochupmBnYaSAZSrRvE6Gc8HdVTmZX_wLjes';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
  // Warn in dev only to avoid noisy logs in production
  if (import.meta.env.DEV) {
    console.warn('[Supabase] Vite env missing; using embedded publishable fallback values.');
  }
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
