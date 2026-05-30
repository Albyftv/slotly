import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

function MiniBar({ value, max, color = '#0ea5e9' }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: operator } = await supabase
    .from('operators')
    .select('id')
    .eq('user_id', user.id)
    .single()
  if (!operator) redirect('/login')

  // Fetch all bookings + experience names
  const { data: bookings } = await supabase
    .from('bookings')
    .select('id, status, total_amount, operator_amount, booking_date, participants, experience:experiences(id, name)')
    .eq('operator_id', operator.id)

  const all = bookings ?? []
  const confirmed = all.filter(b => b.status === 'confirmed')
  const cancelled = all.filter(b => b.status === 'cancelled' || b.status === 'refunded')

  // --- KPIs ---
  const totalRevenue = confirmed.reduce((s, b) => s + Number(b.operator_amount), 0)
  const totalBookings = all.length
  const cancelRate = totalBookings > 0 ? (cancelled.length / totalBookings) * 100 : 0
  const avgTicket = confirmed.length > 0
    ? confirmed.reduce((s, b) => s + Number(b.total_amount), 0) / confirmed.length
    : 0
  const totalParticipants = confirmed.reduce((s, b) => s + (b.participants ?? 0), 0)

  // --- Por experiencia ---
  const expMap = new Map<string, { name: string; revenue: number; bookings: number; participants: number }>()
  for (const b of confirmed) {
    const exp = (b.experience as unknown) as { id: string; name: string } | null
    if (!exp) continue
    const cur = expMap.get(exp.id) ?? { name: exp.name, revenue: 0, bookings: 0, participants: 0 }
    cur.revenue += Number(b.operator_amount)
    cur.bookings += 1
    cur.participants += b.participants ?? 0
    expMap.set(exp.id, cur)
  }
  const byExp = [...expMap.values()].sort((a, b) => b.revenue - a.revenue)
  const maxExpRevenue = byExp[0]?.revenue ?? 1

  // --- Por día de la semana (confirmed bookings) ---
  const byDow = Array(7).fill(0) as number[]
  for (const b of confirmed) {
    if (!b.booking_date) continue
    const dow = new Date(b.booking_date + 'T00:00:00').getDay()
    byDow[dow]++
  }
  const maxDow = Math.max(...byDow, 1)

  // --- Últimos 6 meses ---
  const now = new Date()
  const last6 = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    const key = d.toISOString().slice(0, 7)
    const label = d.toLocaleString('es', { month: 'short' })
    const rev = confirmed
      .filter(b => b.booking_date?.startsWith(key))
      .reduce((s, b) => s + Number(b.operator_amount), 0)
    const cnt = confirmed.filter(b => b.booking_date?.startsWith(key)).length
    return { label, rev, cnt }
  })
  const maxRev = Math.max(...last6.map(m => m.rev), 1)

  const kpis = [
    { label: 'Ingresos netos', value: `${totalRevenue.toFixed(0)}€`, sub: 'después de comisión' },
    { label: 'Reservas totales', value: totalBookings.toString(), sub: `${confirmed.length} confirmadas` },
    { label: 'Tasa de cancelación', value: `${cancelRate.toFixed(1)}%`, sub: `${cancelled.length} canceladas` },
    { label: 'Ticket medio', value: `${avgTicket.toFixed(0)}€`, sub: 'por reserva confirmada' },
    { label: 'Participantes', value: totalParticipants.toString(), sub: 'total histórico' },
  ]

  return (
    <div className="pt-14 lg:pt-0 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Datos históricos de tu negocio</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {kpis.map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-xs text-gray-400 font-semibold mb-1 leading-tight">{k.label}</p>
            <p className="text-xl font-black text-gray-900">{k.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">

        {/* Ingresos por mes */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-5">Ingresos por mes</h2>
          <div className="flex items-end gap-1.5 h-28">
            {last6.map((m, i) => {
              const barH = Math.max((m.rev / maxRev) * 96, m.rev > 0 ? 4 : 2)
              const isLast = i === last6.length - 1
              return (
                <div key={m.label} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-xs font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {m.rev.toFixed(0)}€
                  </span>
                  <div className="w-full flex items-end justify-center" style={{ height: 96 }}>
                    <div
                      className={`w-full rounded-t-lg ${isLast ? 'bg-sky-500' : 'bg-gray-200 group-hover:bg-sky-300'} transition-colors`}
                      style={{ height: barH }}
                    />
                  </div>
                  <span className={`text-xs font-semibold ${isLast ? 'text-sky-600' : 'text-gray-400'}`}>{m.label}</span>
                  <span className="text-xs text-gray-300">{m.cnt}res</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Reservas por día de semana */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-5">Reservas por día de la semana</h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6, 0].map(dow => (
              <div key={dow} className="flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-500 w-7">{DAY_LABELS[dow]}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-sky-400 transition-all"
                    style={{ width: `${maxDow > 0 ? (byDow[dow] / maxDow) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-gray-700 w-5 text-right">{byDow[dow]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Por experiencia */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-5">Rendimiento por experiencia</h2>
        {byExp.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Sin datos aún. Las estadísticas aparecerán cuando tengas reservas confirmadas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-400 pb-3">Experiencia</th>
                  <th className="text-right text-xs font-semibold text-gray-400 pb-3">Reservas</th>
                  <th className="text-right text-xs font-semibold text-gray-400 pb-3">Participantes</th>
                  <th className="text-right text-xs font-semibold text-gray-400 pb-3 pr-4">Ingresos</th>
                  <th className="w-32 text-xs font-semibold text-gray-400 pb-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {byExp.map((exp, i) => (
                  <tr key={exp.name} className="group">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-300 w-4">{i + 1}</span>
                        <span className="text-sm font-semibold text-gray-900">{exp.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-right text-sm font-semibold text-gray-700">{exp.bookings}</td>
                    <td className="py-3 text-right text-sm font-semibold text-gray-700">{exp.participants}</td>
                    <td className="py-3 text-right text-sm font-bold text-gray-900 pr-4">{exp.revenue.toFixed(0)}€</td>
                    <td className="py-3 w-32">
                      <MiniBar value={exp.revenue} max={maxExpRevenue} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
