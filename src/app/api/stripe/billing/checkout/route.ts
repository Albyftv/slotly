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
    .select('id, name, email, stripe_customer_id')
    .eq('user_id', user.id)
    .single()

  if (!operator) return NextResponse.json({ error: 'Operador no encontrado' }, { status: 404 })

  const stripe = getStripe()
  const appUrl = clean(process.env.NEXT_PUBLIC_APP_URL) || 'https://slotly.es'

  // Create Stripe customer if not exists
  let customerId = operator.stripe_customer_id
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: operator.email,
      name: operator.name,
      metadata: { operator_id: operator.id },
    })
    customerId = customer.id
    await service.from('operators').update({ stripe_customer_id: customerId }).eq('id', operator.id)
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: clean(process.env.STRIPE_PRICE_BASIC), quantity: 1 }],
    success_url: `${appUrl}/dashboard/perfil?billing=success`,
    cancel_url: `${appUrl}/dashboard/perfil`,
    metadata: { operator_id: operator.id },
    subscription_data: {
      metadata: { operator_id: operator.id },
    },
  })

  return NextResponse.json({ url: session.url })
}
