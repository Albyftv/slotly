export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'

function clean(v: string | undefined) {
  let s = (v ?? '').trim()
  while (s.charCodeAt(0) === 65279) s = s.slice(1)
  return s.trim()
}

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const service = createServiceClient()
  const { data: operator } = await service
    .from('operators')
    .select('id, email, stripe_account_id')
    .eq('user_id', user.id)
    .single()

  if (!operator) return NextResponse.json({ error: 'Operador no encontrado' }, { status: 404 })

  const stripe = getStripe()
  const appUrl = clean(process.env.NEXT_PUBLIC_APP_URL)
  let accountId = operator.stripe_account_id

  if (!accountId) {
    const account = await stripe.accounts.create({
      type: 'express',
      email: operator.email,
      country: 'ES',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    })
    accountId = account.id
    await service
      .from('operators')
      .update({ stripe_account_id: accountId })
      .eq('id', operator.id)
  }

  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${appUrl}/api/stripe/connect/refresh?account=${accountId}`,
    return_url: `${appUrl}/api/stripe/connect/return`,
    type: 'account_onboarding',
  })

  return NextResponse.json({ url: accountLink.url })
}
