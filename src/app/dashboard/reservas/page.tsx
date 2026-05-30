import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import CancelBookingButton from '@/components/CancelBookingButton'

const STATUS_LABELS: Record<string, string> = {
  confirmed: 'Confirmada',
  pending: 'Pendiente',
  cancelled: 'Cancelada',
  refunded: 'Reembolsada',
}

const STATUS_STYLES: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-gray-100 text-gray-500',
  refunded: 'bg-red-100 text-red-600',
}

export default async function ReservasPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: operator } = await supabase
    .from('operators')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!operator) redirect('/login')

  const { status } = await searchParams
  const activeTab = status ?? 'all'

  const [bookingsRes, allCountsRes] = await Promise.all([
    (() => {
      const q = supabase
        .from('bookings')
        .select('id, booking_date, start_time, participants, customer_name, customer_email, customer_phone, total_amount, operator_amount, status, confirmation_code, experience:experiences(name)')
        .eq('operator_id', operator.id)
        .order('booking_date', { ascending: false })
      return activeTab !== 'all' ? q.eq('status', activeTab) : q
    })(),
    supabase.from('bookings').select('status').eq('operator_id', operator.id),
  ])

  const bookings = bookingsRes.data ?? []
  const allCounts = allCountsRes.data ?? []

  const countByStatus = allCounts.reduce((acc: Record<string, number>, b) => {
    acc[b.status] = (acc[b.status] ?? 0) + 1
    return acc
  }, {})

  const TABS = [
    { key: 'all', label: 'Todas', count: allCounts.length },
    { key: 'confirmed', label: 'Confirmadas', count: countByStatus.confirmed ?? 0 },
    { key: 'pending', label: 'Pendientes', count: countByStatus.pending ?? 0 },
    { key: 'cancelled', label: 'Canceladas', count: countByStatus.cancelled ?? 0 },
  ]

  return (
    <div className="pt-14 lg:pt-0 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Reservas</h1>
        <p className="text-gray-500 text-sm mt-1">Gestiona todas las reservas de tus experiencias</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {TABS.map(tab => (
          <Link
            key={tab.key}
            href={tab.key === 'all' ? '/dashboard/reservas' : `/dashboard/reservas?status=${tab.key}`}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
              activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {tab.count}
            </span>
          </Link>
        ))}
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <p className="text-4xl mb-3">📅</p>
          <p className="text-gray-700 font-semibold">
            {activeTab === 'all' ? 'Aún no tienes reservas' : `No hay reservas ${STATUS_LABELS[activeTab]?.toLowerCase() ?? ''}`}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {activeTab === 'all'
              ? 'Crea una experiencia y comparte el link para recibir reservas.'
              : 'Prueba con otro filtro.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left text-xs font-semibold text-gray-400 px-6 py-3.5">Cliente</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-4 py-3.5">Experiencia</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-4 py-3.5">Fecha</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-4 py-3.5">Hora</th>
                  <th className="text-center text-xs font-semibold text-gray-400 px-4 py-3.5">Personas</th>
                  <th className="text-right text-xs font-semibold text-gray-400 px-4 py-3.5">Total</th>
                  <th className="text-right text-xs font-semibold text-gray-400 px-6 py-3.5">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map(b => {
                  const exp = (b.experience as unknown) as { name: string } | null
                  return (
                    <tr key={b.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-900">{b.customer_name}</p>
                        <p className="text-xs text-gray-400">{b.customer_email}</p>
                        {b.customer_phone && (
                          <p className="text-xs text-gray-400">{b.customer_phone}</p>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-gray-700">{exp?.name ?? '—'}</p>
                        <p className="text-xs text-gray-400 font-mono">{b.confirmation_code}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-700">
                          {new Date(b.booking_date + 'T00:00:00').toLocaleDateString('es', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-700">{b.start_time?.slice(0, 5)}</p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <p className="text-sm font-semibold text-gray-700">{b.participants}</p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="text-sm font-bold text-gray-900">{Number(b.total_amount).toFixed(0)}€</p>
                        <p className="text-xs text-gray-400">Para ti: {Number(b.operator_amount).toFixed(0)}€</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[b.status] ?? 'bg-gray-100 text-gray-500'}`}>
                          {STATUS_LABELS[b.status] ?? b.status}
                        </span>
                        <div className="mt-1">
                          <CancelBookingButton bookingId={b.id} status={b.status} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Footer summary */}
          {activeTab === 'confirmed' && bookings.length > 0 && (
            <div className="border-t border-gray-100 px-6 py-3 bg-gray-50/50 flex justify-end gap-6">
              <p className="text-xs text-gray-400">
                Total cobrado:{' '}
                <span className="font-bold text-gray-900">
                  {bookings.reduce((s, b) => s + Number(b.total_amount), 0).toFixed(0)}€
                </span>
              </p>
              <p className="text-xs text-gray-400">
                Para ti:{' '}
                <span className="font-bold text-green-700">
                  {bookings.reduce((s, b) => s + Number(b.operator_amount), 0).toFixed(0)}€
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
