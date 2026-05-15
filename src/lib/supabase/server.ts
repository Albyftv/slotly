import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

function clean(v: string | undefined) {
  let s = (v ?? '').trim()
  while (s.charCodeAt(0) === 65279) s = s.slice(1)
  return s.trim()
}

const URL  = clean(process.env.NEXT_PUBLIC_SUPABASE_URL)
const ANON = clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
const SVC  = clean(process.env.SUPABASE_SERVICE_ROLE_KEY)

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(URL, ANON, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try { list.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) }
        catch {}
      },
    },
  })
}

export function createServiceClient() {
  return createServerClient(URL, SVC, {
    cookies: { getAll: () => [], setAll: () => {} },
  })
}
