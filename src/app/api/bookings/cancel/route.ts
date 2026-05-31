export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { sendCancellationEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })

  const { data: operator } = await supabase
    .from('operators')
    .select('id, name, email, phone')
    .eq('user_id', user.id)
    .single()
  if (!operator) return NextResponse.json({ error: 'Operador no encontrado' }, { status: 404 })

  const service = createServiceClient()

  // Fetch booking before cancelling to have data for the email
  const { data: booking } = await service
    .from('bookings')
    .select('*, experience:experiences(name)')
    .eq('id', id)
    .eq('operator_id', operator.id)
    .in('status', ['pending', 'confirmed'])
    .single()

  if (!booking) return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 })

  const { error } = await service
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Send cancellation email to customer
  const exp = booking.experience as { name: string } | null
  sendCancellationEmail({
    customerName: booking.customer_name,
    customerEmail: booking.customer_email,
    operatorName: operator.name,
    operatorEmail: operator.email,
    operatorPhone: operator.phone,
    experienceName: exp?.name ?? 'Experiencia',
    bookingDate: booking.booking_date,
    startTime: booking.start_time,
    participants: booking.participants,
    totalAmount: Number(booking.total_amount),
    confirmationCode: booking.confirmation_code,
  }).catch(console.error)

  return NextResponse.json({ ok: true })
}
