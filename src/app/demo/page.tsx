'use client'

import { useState } from 'react'
import Link from 'next/link'

// ── FAKE DATA ────────────────────────────────────────────────
const BOOKINGS = [
  { id: 'SL-0041', exp: 'Clase de Surf', date: '2026-05-31', time: '09:00', name: 'Klaus Müller', email: 'klaus@gmail.com', phone: '+49 176 4421 8833', people: 3, total: 135, operator: 90, status: 'confirmed' },
  { id: 'SL-0040', exp: 'Ruta en Quad', date: '2026-05-31', time: '10:00', name: 'Sophie Martin', email: 'sophie.m@orange.fr', phone: '+33 6 12 34 56 78', people: 2, total: 90, operator: 60, status: 'confirmed' },
  { id: 'SL-0039', exp: 'Clase de Surf', date: '2026-06-01', time: '14:00', name: 'Juan García', email: 'juan@hotmail.es', phone: '+34 612 345 678', people: 1, total: 45, operator: 30, status: 'pending' },
  { id: 'SL-0038', exp: 'Avistamiento Cetáceos', date: '2026-06-02', time: '09:00', name: 'Lena Schmidt', email: 'lena.s@web.de', phone: '+49 160 9876 5432', people: 4, total: 220, operator: 147, status: 'confirmed' },
  { id: 'SL-0037', exp: 'Diving Intro', date: '2026-06-03', time: '11:00', name: 'Emma Johnson', email: 'emma.j@gmail.com', phone: '+44 7700 900123', people: 2, total: 160, operator: 107, status: 'confirmed' },
  { id: 'SL-0036', exp: 'Clase de Surf', date: '2026-05-28', time: '09:00', name: 'Marco Rossi', email: 'marco.r@libero.it', phone: '+39 340 123 4567', people: 2, total: 90, operator: 60, status: 'confirmed' },
  { id: 'SL-0035', exp: 'Ruta en Quad', date: '2026-05-27', time: '10:00', name: 'Anna Kowalski', email: 'anna.k@wp.pl', phone: '+48 501 234 567', people: 2, total: 90, operator: 60, status: 'cancelled' },
]

const EXPERIENCES = [
  { id: 1, name: 'Clase de Surf', category: 'Acuático', price: 45, duration: 120, capacity: 8, bookings: 24, revenue: 1080, status: 'active', difficulty: 'Principiante' },
  { id: 2, name: 'Ruta en Quad', category: 'Terrestre', price: 45, duration: 180, capacity: 6, bookings: 12, revenue: 540, status: 'active', difficulty: 'Todos los niveles' },
  { id: 3, name: 'Avistamiento Cetáceos', category: 'Acuático', price: 55, duration: 150, capacity: 12, bookings: 8, revenue: 440, status: 'active', difficulty: 'Todos los niveles' },
  { id: 4, name: 'Diving Intro', category: 'Acuático', price: 80, duration: 180, capacity: 4, bookings: 5, revenue: 400, status: 'paused', difficulty: 'Principiante' },
]

const MONTHS = [
  { label: 'Dic', amount: 480 },
  { label: 'Ene', amount: 620 },
  { label: 'Feb', amount: 390 },
  { label: 'Mar', amount: 810 },
  { label: 'Abr', amount: 960 },
  { label: 'May', amount: 1240 },
]

const maxRevenue = Math.max(...MONTHS.map(m => m.amount))

const STATUS_LABEL: Record<string, string> = {
  confirmed: 'Confirmada',
  pending: 'Pendiente',
  cancelled: 'Cancelada',
}
const STATUS_COLOR: Record<string, string> = {
  confirmed: 'bg-emerald-50 text-emerald-700',
  pending: 'bg-amber-50 text-amber-700',
  cancelled: 'bg-red-50 text-red-600',
}

type Tab = 'panel' | 'reservas' | 'experiencias' | 'analytics'

// ── VIEWS ────────────────────────────────────────────────────

function Panel() {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Ingresos este mes', value: '1.240€', sub: '+29% vs anterior', up: true },
          { label: 'Reservas totales', value: '24', sub: '7 este mes', up: true },
          { label: 'Ticket medio', value: '51,67€', sub: 'por reserva', up: false },
          { label: 'Próxima reserva', value: 'Hoy', sub: '09:00 · Klaus M. · 3p', up: true },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-xs text-gray-400 mb-1">{k.label}</p>
            <p className="text-2xl font-black text-gray-900">{k.value}</p>
            <p className={`text-xs mt-1 font-medium ${k.up ? 'text-emerald-500' : 'text-gray-400'}`}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Chart + upcoming */}
      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="font-bold text-gray-900">Ingresos últimos 6 meses</p>
            <span className="text-xs text-gray-400">Para ti (98%)</span>
          </div>
          <div className="flex items-end gap-3 h-36">
            {MONTHS.map((m, i) => (
              <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-400 font-medium">{i === 5 ? `${m.amount}€` : ''}</span>
                <div
                  className={`w-full rounded-t-lg transition-all ${i === 5 ? 'bg-sky-500' : 'bg-gray-100 hover:bg-sky-200'}`}
                  style={{ height: `${(m.amount / maxRevenue) * 120}px` }}
                />
                <span className="text-xs text-gray-400">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="font-bold text-gray-900 mb-4">Próximas reservas</p>
          <div className="space-y-3">
            {BOOKINGS.filter(b => b.status !== 'cancelled').slice(0, 4).map(b => (
              <div key={b.id} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0">
                  {b.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{b.name}</p>
                  <p className="text-xs text-gray-400 truncate">{b.exp} · {b.time}</p>
                </div>
                <span className="text-sm font-black text-gray-900 flex-shrink-0">{b.total}€</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent bookings table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <p className="font-bold text-gray-900">Últimas reservas</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400">CÓDIGO</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400">EXPERIENCIA</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400">CLIENTE</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400">FECHA</th>
                <th className="text-right px-5 py-3 text-xs font-bold text-gray-400">TOTAL</th>
                <th className="text-right px-5 py-3 text-xs font-bold text-gray-400">ESTADO</th>
              </tr>
            </thead>
            <tbody>
              {BOOKINGS.slice(0, 5).map((b, i) => (
                <tr key={b.id} className={`border-b border-gray-50 last:border-0 ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                  <td className="px-5 py-3 text-xs font-mono text-gray-400">{b.id}</td>
                  <td className="px-5 py-3 font-medium text-gray-700">{b.exp}</td>
                  <td className="px-5 py-3 text-gray-600">{b.name}</td>
                  <td className="px-5 py-3 text-gray-500">{b.date} {b.time}</td>
                  <td className="px-5 py-3 text-right font-black text-gray-900">{b.total}€</td>
                  <td className="px-5 py-3 text-right">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${STATUS_COLOR[b.status]}`}>
                      {STATUS_LABEL[b.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Reservas() {
  const [filter, setFilter] = useState<string>('all')
  const filtered = filter === 'all' ? BOOKINGS : BOOKINGS.filter(b => b.status === filter)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'Todas' },
            { key: 'confirmed', label: 'Confirmadas' },
            { key: 'pending', label: 'Pendientes' },
            { key: 'cancelled', label: 'Canceladas' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`text-sm font-bold px-3 py-1.5 rounded-xl transition-all ${filter === f.key ? 'bg-sky-500 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-sky-200'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 text-sm font-bold text-sky-600 bg-sky-50 border border-sky-100 px-3 py-1.5 rounded-xl hover:bg-sky-100 transition-colors">
          ↓ Exportar CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400">CÓDIGO</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400">EXPERIENCIA</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400">CLIENTE</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400">FECHA · HORA</th>
                <th className="text-center px-5 py-3 text-xs font-bold text-gray-400">PERS.</th>
                <th className="text-right px-5 py-3 text-xs font-bold text-gray-400">TOTAL</th>
                <th className="text-right px-5 py-3 text-xs font-bold text-gray-400">PARA TI</th>
                <th className="text-right px-5 py-3 text-xs font-bold text-gray-400">ESTADO</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => (
                <tr key={b.id} className={`border-b border-gray-50 last:border-0 hover:bg-sky-50/30 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                  <td className="px-5 py-3.5 text-xs font-mono text-gray-400">{b.id}</td>
                  <td className="px-5 py-3.5 font-medium text-gray-800">{b.exp}</td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-800">{b.name}</p>
                    <p className="text-xs text-gray-400">{b.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">{b.date} · {b.time}</td>
                  <td className="px-5 py-3.5 text-center text-gray-600">{b.people}</td>
                  <td className="px-5 py-3.5 text-right font-black text-gray-900">{b.total}€</td>
                  <td className="px-5 py-3.5 text-right font-bold text-emerald-600">{b.operator}€</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${STATUS_COLOR[b.status]}`}>
                      {STATUS_LABEL[b.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Experiencias() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">{EXPERIENCES.length} experiencias</p>
        <button className="bg-sky-500 text-white text-sm font-black px-4 py-2 rounded-xl hover:bg-sky-400 transition-colors">
          + Nueva experiencia
        </button>
      </div>

      <div className="grid gap-4">
        {EXPERIENCES.map(exp => (
          <div key={exp.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center text-2xl flex-shrink-0">
              {exp.category === 'Acuático' ? '🌊' : exp.category === 'Terrestre' ? '🏔️' : '🎭'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-black text-gray-900">{exp.name}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${exp.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                  {exp.status === 'active' ? 'Activa' : 'Pausada'}
                </span>
              </div>
              <p className="text-sm text-gray-500">{exp.category} · {exp.duration} min · Máx {exp.capacity} personas · {exp.difficulty}</p>
            </div>
            <div className="text-right flex-shrink-0 space-y-1">
              <p className="text-xl font-black text-gray-900">{exp.price}€<span className="text-sm font-normal text-gray-400">/p</span></p>
              <p className="text-sm text-gray-500">{exp.bookings} reservas · {exp.revenue}€</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button className="text-xs font-bold text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-sky-300 hover:text-sky-600 transition-colors">
                Editar
              </button>
              <button className="text-xs font-bold text-sky-600 bg-sky-50 border border-sky-100 px-3 py-1.5 rounded-lg hover:bg-sky-100 transition-colors">
                Ver pública ↗
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Analytics() {
  const totalRevenue = BOOKINGS.filter(b => b.status === 'confirmed').reduce((s, b) => s + b.operator, 0)
  const totalBookings = BOOKINGS.filter(b => b.status === 'confirmed').length
  const cancelled = BOOKINGS.filter(b => b.status === 'cancelled').length
  const cancelRate = Math.round((cancelled / BOOKINGS.length) * 100)
  const avgTicket = Math.round(totalRevenue / totalBookings)

  const byExp: Record<string, { bookings: number; revenue: number }> = {}
  BOOKINGS.filter(b => b.status === 'confirmed').forEach(b => {
    if (!byExp[b.exp]) byExp[b.exp] = { bookings: 0, revenue: 0 }
    byExp[b.exp].bookings++
    byExp[b.exp].revenue += b.operator
  })
  const maxRev = Math.max(...Object.values(byExp).map(v => v.revenue))

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Ingresos totales (para ti)', value: `${totalRevenue}€` },
          { label: 'Reservas confirmadas', value: totalBookings },
          { label: 'Tasa de cancelación', value: `${cancelRate}%` },
          { label: 'Ticket medio', value: `${avgTicket}€` },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-xs text-gray-400 mb-1">{k.label}</p>
            <p className="text-2xl font-black text-gray-900">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <p className="font-bold text-gray-900 mb-6">Ingresos mensuales (€ para ti)</p>
        <div className="flex items-end gap-4 h-40">
          {MONTHS.map((m, i) => (
            <div key={m.label} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-gray-500">{m.amount}€</span>
              <div
                className={`w-full rounded-t-xl ${i === 5 ? 'bg-sky-500' : 'bg-gray-100'}`}
                style={{ height: `${(m.amount / maxRevenue) * 130}px` }}
              />
              <span className="text-xs text-gray-400">{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* By experience */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <p className="font-bold text-gray-900 mb-4">Ingresos por experiencia</p>
        <div className="space-y-4">
          {Object.entries(byExp).map(([name, data]) => (
            <div key={name}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-gray-700">{name}</span>
                <span className="font-black text-gray-900">{data.revenue}€ · {data.bookings} reservas</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div
                  className="h-2 bg-sky-500 rounded-full"
                  style={{ width: `${(data.revenue / maxRev) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── MAIN ─────────────────────────────────────────────────────

const NAV_ITEMS = [
  { key: 'panel', label: 'Panel', icon: '▦' },
  { key: 'reservas', label: 'Reservas', icon: '📅' },
  { key: 'experiencias', label: 'Experiencias', icon: '🌊' },
  { key: 'analytics', label: 'Analytics', icon: '📊' },
] as const

export default function DemoPage() {
  const [tab, setTab] = useState<Tab>('panel')

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── DEMO BANNER */}
      <div className="bg-sky-500 text-white text-center py-2.5 px-4 z-50 sticky top-0">
        <span className="text-sm font-bold">
          👋 Esto es una demo interactiva — los datos son ficticios.{' '}
          <Link href="/registro" className="underline font-black hover:text-sky-100 transition-colors">
            Empieza gratis con tus propios datos →
          </Link>
        </span>
      </div>

      <div className="flex flex-1">
        {/* ── SIDEBAR */}
        <aside className="w-56 bg-white border-r border-gray-100 flex flex-col p-3 sticky top-10 h-[calc(100vh-40px)]">
          <div className="flex items-center gap-2 px-2 py-3 mb-6">
            <div className="w-8 h-8 bg-sky-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm font-black">FA</span>
            </div>
            <div>
              <p className="font-black text-sm text-gray-900 leading-none">Fuerteventura</p>
              <p className="text-xs text-gray-400">Adventures</p>
            </div>
          </div>

          <nav className="space-y-0.5 flex-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                  tab === item.key
                    ? 'bg-sky-50 text-sky-600 font-bold'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="border-t border-gray-100 pt-3 space-y-2">
            <div className="px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
              <p className="text-xs font-bold text-emerald-700 mb-0.5">Stripe conectado ✓</p>
              <p className="text-xs text-emerald-600">Cuenta verificada</p>
            </div>
            <Link href="/registro"
              className="block w-full bg-sky-500 text-white text-sm font-black py-2.5 rounded-xl text-center hover:bg-sky-400 transition-colors shadow-md shadow-sky-200">
              Crear mi cuenta →
            </Link>
          </div>
        </aside>

        {/* ── MAIN CONTENT */}
        <main className="flex-1 p-6 max-w-5xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Buenos días</p>
              <h1 className="text-xl font-black text-gray-900">
                {tab === 'panel' && 'Panel de control'}
                {tab === 'reservas' && 'Reservas'}
                {tab === 'experiencias' && 'Mis experiencias'}
                {tab === 'analytics' && 'Analytics'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900">Demo interactiva</p>
                <p className="text-xs text-gray-400">Fuerteventura Adventures</p>
              </div>
              <div className="w-9 h-9 bg-sky-500 rounded-full flex items-center justify-center text-white text-sm font-black">FA</div>
            </div>
          </div>

          {tab === 'panel' && <Panel />}
          {tab === 'reservas' && <Reservas />}
          {tab === 'experiencias' && <Experiencias />}
          {tab === 'analytics' && <Analytics />}
        </main>
      </div>
    </div>
  )
}
