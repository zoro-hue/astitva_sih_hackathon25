import { createServerClient as createSupabaseServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

function getSupabaseEnv() {
  // Prefer server-side secrets; fall back to NEXT_PUBLIC for dev if needed
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    const missing = [
      !process.env.SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL
        ? "SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL"
        : null,
      !process.env.SUPABASE_ANON_KEY && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ? "SUPABASE_ANON_KEY/NEXT_PUBLIC_SUPABASE_ANON_KEY"
        : null,
    ].filter(Boolean)
    const msg = `Supabase configuration missing: ${missing.join(
      ", ",
    )}. Please set these in your project environment variables.`
    // Throwing here surfaces a clear message to route handlers
    throw new Error(msg)
  }

  return { url, anonKey }
}

export async function createServerClient() {
  const cookieStore = await cookies()
  const { url, anonKey } = getSupabaseEnv()

  return createSupabaseServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Server Component context without mutable cookies; safe to ignore if middleware refreshes sessions.
        }
      },
    },
  })
}
