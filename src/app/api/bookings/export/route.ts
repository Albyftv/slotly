import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: operator } = await supabase
    .from('operators')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!operator) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: bookings } = await supabase
    .from('bookings')
    .select('confirmation_code, booking_date, start_time, customer_name, customer_email, customer_phone, participants, total_amount, operator_amount, platform_fee, status, experience:experiences(name), created_at')
    .eq('operator_id', operator.id)
    .order('booking_date', { ascending: false })

  const rows = (bookings ?? []).map(b => {
    const exp = (b.experience as unknown) as { name: string } | null
    return [
      b.confirmation_code,
      b.booking_date,
      b.start_time?.slice(0, 5) ?? '',
      exp?.name ?? '',
      b.customer_name,
      b.customer_email,
      b.customer_phone ?? '',
      b.participants,
      Number(b.total_amount).toFixed(2),
      Number(b.operator_amount).toFixed(2),
      Number(b.platform_fee).toFixed(2),
      b.status,
      new Date(b.created_at).toISOString().slice(0, 10),
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')
  })

  const headers = [
    'Código', 'Fecha', 'Hora', 'Experiencia', 'Cliente', 'Email', 'Teléfono',
    'Personas', 'Total (€)', 'Para ti (€)', 'Comisión Slotly (€)', 'Estado', 'Creada el',
  ].map(h => `"${h}"`).join(',')

  const csv = [headers, ...rows].join('\n')
  const filename = `reservas-slotly-${new Date().toISOString().slice(0, 10)}.csv`

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
