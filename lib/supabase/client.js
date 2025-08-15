import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    // Return a minimal safe stub client on the browser to avoid hard crashes when env vars are missing
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.error('Supabase env vars are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
    }
    return {
      auth: {
        async signInWithPassword() {
          return { data: null, error: { message: 'Supabase credentials missing on client.' } }
        },
        async signUp() {
          return { data: null, error: { message: 'Supabase credentials missing on client.' } }
        },
        async signOut() { return { error: null } },
        async getUser() { return { data: { user: null }, error: null } },
      },
      from() {
        return {
          select: async () => ({ data: [], error: null }),
        }
      },
    }
  }

  return createBrowserClient(url, anonKey)
}
