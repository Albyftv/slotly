export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'
import { sendBookingConfirmationEmails } from '@/lib/email'
import Stripe from 'stripe'

function clean(v: string | undefined) {
  let s = (v ?? '').trim()
  while (s.charCodeAt(0) === 65279) s = s.slice(1)
  return s.trim()
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  const whSecret = clean(process.env.STRIPE_WEBHOOK_SECRET)

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, whSecret)
  } catch {
    return NextResponse.json({ error: 'Webhook signature inválida' }, { status: 400 })
  }

  const supabase = createServiceClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { booking_id } = session.metadata ?? {}

    if (booking_id) {
      await supabase.from('bookings').update({
        status: 'confirmed',
        stripe_payment_intent_id: session.payment_intent as string,
      }).eq('id', booking_id)

      // Fetch booking + experience + operator for emails
      const { data: booking } = await supabase
        .from('bookings')
        .select('*, experience:experiences(name, meeting_point, operator:operators(name, email, phone))')
        .eq('id', booking_id)
        .single()

      if (booking) {
        const exp = booking.experience as { name: string; meeting_point?: string; operator: { name: string; email: string; phone?: string } } | null
        if (exp?.operator) {
          await sendBookingConfirmationEmails({
            customerName: booking.customer_name,
            customerEmail: booking.customer_email,
            operatorName: exp.operator.name,
            operatorEmail: exp.operator.email,
            operatorPhone: exp.operator.phone,
            experienceName: exp.name,
            bookingDate: booking.booking_date,
            startTime: booking.start_time,
            participants: booking.participants,
            totalAmount: Number(booking.total_amount),
            operatorAmount: Number(booking.operator_amount),
            confirmationCode: booking.confirmation_code,
            meetingPoint: exp.meeting_point,
          }).catch(console.error) // don't fail webhook if email fails
        }
      }
    }
  }

  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session
    const { booking_id } = session.metadata ?? {}
    if (booking_id) {
      await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', booking_id)
    }
  }

  if (event.type === 'account.updated') {
    const account = event.data.object as Stripe.Account
    await supabase
      .from('operators')
      .update({ stripe_account_enabled: account.charges_enabled })
      .eq('stripe_account_id', account.id)
  }

  return NextResponse.json({ received: true })
}
