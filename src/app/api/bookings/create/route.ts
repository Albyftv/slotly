export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { getStripe, PLATFORM_FEE_PERCENT } from '@/lib/stripe'

function cleanUrl(v: string | undefined) {
  let s = (v ?? '').trim()
  while (s.charCodeAt(0) === 65279) s = s.slice(1)
  return s.trim()
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    experience_id, operator_id, booking_date, start_time,
    participants, unit_price, customer_name, customer_email,
    customer_phone, special_requests,
  } = body

  if (!experience_id || !booking_date || !start_time || !customer_email || !customer_name) {
    return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 })
  }

  const supabase = createServiceClient()

  // Verify experience exists and is active
  const { data: experience } = await supabase
    .from('experiences')
    .select('id, name, price, max_capacity, operator_id')
    .eq('id', experience_id)
    .eq('status', 'active')
    .single()

  if (!experience) {
    return NextResponse.json({ error: 'Experiencia no encontrada' }, { status: 404 })
  }

  // Check capacity for this slot
  const { count } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('experience_id', experience_id)
    .eq('booking_date', booking_date)
    .eq('start_time', start_time + ':00')
    .in('status', ['confirmed', 'pending'])

  const booked = count ?? 0
  const remaining = experience.max_capacity - booked
  if (participants > remaining) {
    return NextResponse.json({ error: `Solo quedan ${remaining} plazas disponibles` }, { status: 409 })
  }

  // Get operator's Stripe account
  const { data: operator } = await supabase
    .from('operators')
    .select('stripe_account_id, stripe_account_enabled, name')
    .eq('id', operator_id)
    .single()

  const totalAmount = unit_price * participants
  const platformFee = Math.round(totalAmount * (PLATFORM_FEE_PERCENT / 100) * 100)
  const operatorAmount = totalAmount - platformFee / 100

  const appUrl = cleanUrl(process.env.NEXT_PUBLIC_APP_URL)

  // Create booking record (pending)
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      experience_id,
      operator_id,
      booking_date,
      start_time: start_time + ':00',
      participants,
      customer_name,
      customer_email,
      customer_phone: customer_phone ?? null,
      special_requests: special_requests ?? null,
      unit_price,
      total_amount: totalAmount,
      platform_fee: platformFee / 100,
      operator_amount: operatorAmount,
      status: 'pending',
    })
    .select()
    .single()

  if (bookingError) {
    return NextResponse.json({ error: bookingError.message }, { status: 500 })
  }

  // Create Stripe Checkout session
  const stripe = getStripe()

  const sessionParams: Parameters<typeof stripe.checkout.sessions.create>[0] = {
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email,
    line_items: [{
      price_data: {
        currency: 'eur',
        product_data: {
          name: experience.name,
          description: `${booking_date} · ${start_time} · ${participants} persona${participants !== 1 ? 's' : ''}`,
        },
        unit_amount: Math.round(totalAmount * 100),
      },
      quantity: 1,
    }],
    metadata: {
      booking_id: booking.id,
      confirmation_code: booking.confirmation_code,
    },
    success_url: `${appUrl}/reserva/confirmada?code=${booking.confirmation_code}`,
    cancel_url: `${appUrl}/reserva/cancelada?booking=${booking.id}`,
  }

  // Use Stripe Connect if operator has connected account
  if (operator?.stripe_account_id && operator?.stripe_account_enabled) {
    sessionParams.payment_intent_data = {
      application_fee_amount: platformFee,
      transfer_data: { destination: operator.stripe_account_id },
    }
  }

  const session = await stripe.checkout.sessions.create(sessionParams)

  return NextResponse.json({ url: session.url })
}
