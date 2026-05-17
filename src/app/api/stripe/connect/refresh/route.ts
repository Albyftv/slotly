export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'

function clean(v: string | undefined) {
  let s = (v ?? '').trim()
  while (s.charCodeAt(0) === 65279) s = s.slice(1)
  return s.trim()
}

export async function GET(req: NextRequest) {
  const appUrl = clean(process.env.NEXT_PUBLIC_APP_URL)
  const accountId = new URL(req.url).searchParams.get('account')

  if (!accountId) return NextResponse.redirect(`${appUrl}/dashboard/perfil`)

  const service = createServiceClient()
  const { data: operator } = await service
    .from('operators')
    .select('id')
    .eq('stripe_account_id', accountId)
    .single()

  if (!operator) return NextResponse.redirect(`${appUrl}/dashboard/perfil`)

  const accountLink = await getStripe().accountLinks.create({
    account: accountId,
    refresh_url: `${appUrl}/api/stripe/connect/refresh?account=${accountId}`,
    return_url: `${appUrl}/api/stripe/connect/return`,
    type: 'account_onboarding',
  })

  return NextResponse.redirect(accountLink.url)
}
