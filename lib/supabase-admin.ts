/**
 * Server-side only Supabase client using the service role key.
 * This bypasses RLS — only use in API routes / server actions, never in client code.
 * The SUPABASE_SERVICE_ROLE_KEY env var has no NEXT_PUBLIC_ prefix intentionally.
 */
import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars')
  }

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}
