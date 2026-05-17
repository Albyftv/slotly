export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const service = createServiceClient()
  const { data: operator } = await service
    .from('operators')
    .select('stripe_account_id, stripe_account_enabled')
    .eq('user_id', user.id)
    .single()

  if (!operator?.stripe_account_id || !operator?.stripe_account_enabled) {
    return NextResponse.json({ error: 'Cuenta no conectada' }, { status: 400 })
  }

  const loginLink = await getStripe().accounts.createLoginLink(operator.stripe_account_id)
  return NextResponse.json({ url: loginLink.url })
}
