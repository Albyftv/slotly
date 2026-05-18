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

  const { data: operator } = await createServiceClient()
    .from('operators')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single()

  if (!operator?.stripe_customer_id) {
    return NextResponse.json({ error: 'No hay suscripción activa' }, { status: 400 })
  }

  const appUrl = clean(process.env.NEXT_PUBLIC_APP_URL) || 'https://slotly.es'

  const session = await getStripe().billingPortal.sessions.create({
    customer: operator.stripe_customer_id,
    return_url: `${appUrl}/dashboard/perfil`,
  })

  return NextResponse.json({ url: session.url })
}
