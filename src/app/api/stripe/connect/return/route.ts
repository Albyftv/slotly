export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'

function clean(v: string | undefined) {
  let s = (v ?? '').trim()
  while (s.charCodeAt(0) === 65279) s = s.slice(1)
  return s.trim()
}

export async function GET() {
  const appUrl = clean(process.env.NEXT_PUBLIC_APP_URL)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(`${appUrl}/login`)

  const service = createServiceClient()
  const { data: operator } = await service
    .from('operators')
    .select('id, stripe_account_id')
    .eq('user_id', user.id)
    .single()

  if (operator?.stripe_account_id) {
    const account = await getStripe().accounts.retrieve(operator.stripe_account_id)
    if (account.charges_enabled) {
      await service
        .from('operators')
        .update({ stripe_account_enabled: true })
        .eq('id', operator.id)
    }
  }

  return NextResponse.redirect(`${appUrl}/dashboard/perfil?stripe=success`)
}
