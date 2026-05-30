import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import RevenueChart from '@/components/RevenueChart'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: operator } = await supabase
    .from('operators')
    .select('id, name')
    .eq('user_id', user.id)
    .single()

  if (!operator) redirect('/login')

  const [{ data: experiences }, { data: bookings }] = await Promise.all([
    supabase.from('experiences').select('id, name, status, price').eq('operator_id', operator.id),
    supabase.from('bookings').select('id, total_amount, operator_amount, status, booking_date, customer_name, created_at')
      .eq('operator_id', operator.id)
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const confirmedBookings = (bookings ?? []).filter(b => b.status === 'confirmed')
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + Number(b.operator_amount), 0)
  const now = new Date()
  const thisMonth = now.toISOString().slice(0, 7)
  const monthRevenue = confirmedBookings
    .filter(b => b.booking_date?.startsWith(thisMonth))
    .reduce((sum, b) => sum + Number(b.operator_amount), 0)

  // Últimos 6 meses para el gráfico
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    const key = d.toISOString().slice(0, 7)
    const label = d.toLocaleString('es', { month: 'short' })
    const amount = confirmedBookings
      .filter(b => b.booking_date?.startsWith(key))
      .reduce((sum, b) => sum + Number(b.operator_amount), 0)
    return { label, amount }
  })

  const hour = now.getHours()
  const greeting = hour < 13 ? 'Buenos días' : hour < 20 ? 'Buenas tardes' : 'Buenas noches'

  const stats = [
    { label: 'Ingresos totales', value: `${totalRevenue.toFixed(0)}€`, sub: 'después de comisión Slotly' },
    { label: 'Este mes', value: `${monthRevenue.toFixed(0)}€`, sub: new Date().toLocaleString('es', { month: 'long', year: 'numeric' }) },
    { label: 'Reservas confirmadas', value: confirmedBookings.length.toString(), sub: 'total histórico' },
    { label: 'Experiencias activas', value: (experiences ?? []).filter(e => e.status === 'active').length.toString(), sub: `de ${(experiences ?? []).length} en total` },
  ]

  const recentBookings = (bookings ?? []).slice(0, 5)

  return (
    <div className="pt-14 lg:pt-0 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">{greeting}, {operator.name.split(' ')[0]} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Aquí tienes el resumen de tu negocio</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs text-gray-400 font-semibold mb-1">{s.label}</p>
            <p className="text-2xl font-black text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="mb-6">
        <RevenueChart months={last6Months} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Reservas recientes */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900">Reservas recientes</h2>
            <Link href="/dashboard/reservas" className="text-xs text-sky-500 font-semibold hover:underline">
              Ver todas →
            </Link>
          </div>
          {recentBookings.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-3">📅</p>
              <p className="text-gray-500 text-sm">Aún no tienes reservas.</p>
              <p className="text-gray-400 text-xs mt-1">Crea tu primera experiencia y comparte el link.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map(b => (
                <div key={b.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{b.customer_name}</p>
                    <p className="text-xs text-gray-400">{new Date(b.booking_date).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{Number(b.operator_amount).toFixed(0)}€</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      b.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>{b.status === 'confirmed' ? 'Confirmada' : b.status === 'pending' ? 'Pendiente' : 'Cancelada'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Acciones rápidas */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4">Acciones rápidas</h2>
            <div className="space-y-2">
              <Link href="/dashboard/experiencias/nueva"
                className="flex items-center gap-3 p-3 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors text-sm font-semibold">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 flex-shrink-0">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
                Nueva experiencia
              </Link>
              <Link href="/dashboard/experiencias"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-600">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 flex-shrink-0">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                Mis experiencias
              </Link>
              <Link href="/dashboard/reservas"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-600">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 flex-shrink-0">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
                Ver reservas
              </Link>
            </div>
          </div>

          {/* Mis experiencias resumen */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Experiencias</h2>
              <Link href="/dashboard/experiencias" className="text-xs text-sky-500 font-semibold hover:underline">Ver →</Link>
            </div>
            {(experiences ?? []).length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-400 text-xs">Sin experiencias aún.</p>
                <Link href="/dashboard/experiencias/nueva" className="text-sky-500 text-xs font-semibold hover:underline mt-1 block">
                  Crear la primera →
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {(experiences ?? []).slice(0, 3).map(e => (
                  <div key={e.id} className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-700 truncate">{e.name}</p>
                    <span className="text-sm font-bold text-gray-900 ml-2 flex-shrink-0">{e.price}€</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
