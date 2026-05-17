'use client'

import { useState } from 'react'

interface Operator {
  id: string
  name: string
  slug: string
  email: string
  city: string | null
  phone: string | null
  stripe_account_id: string | null
  stripe_account_enabled: boolean
  subscription_status: string
}

interface Props {
  operator: Operator
  stripeSuccess: boolean
}

export default function PerfilClient({ operator, stripeSuccess }: Props) {
  const [form, setForm] = useState({
    name: operator.name,
    city: operator.city ?? '',
    phone: operator.phone ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [saveError, setSaveError] = useState('')
  const [connectingStripe, setConnectingStripe] = useState(false)
  const [dashboardLoading, setDashboardLoading] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaveMsg('')
    setSaveError('')
    try {
      const res = await fetch('/api/operators/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error al guardar')
      setSaveMsg('Cambios guardados')
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  async function handleConnectStripe() {
    setConnectingStripe(true)
    try {
      const res = await fetch('/api/stripe/connect/onboarding', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error')
      window.location.href = data.url
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error al conectar Stripe')
      setConnectingStripe(false)
    }
  }

  async function handleOpenDashboard() {
    setDashboardLoading(true)
    try {
      const res = await fetch('/api/stripe/connect/dashboard-link', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error')
      window.open(data.url, '_blank')
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error al abrir panel de pagos')
    } finally {
      setDashboardLoading(false)
    }
  }

  const stripeEnabled = operator.stripe_account_enabled
  const stripePartial = !!operator.stripe_account_id && !stripeEnabled

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Perfil</h1>
        <p className="text-gray-500 text-sm mt-1">Gestiona los datos de tu negocio y pagos</p>
      </div>

      {stripeSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 flex items-center gap-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-green-500 flex-shrink-0">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <p className="text-sm font-semibold text-green-700">¡Cuenta bancaria conectada correctamente!</p>
        </div>
      )}

      {/* Business info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-5">Datos del negocio</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre del negocio *</label>
            <input
              type="text" required
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <input
              type="email" disabled value={operator.email}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ciudad</label>
              <input
                type="text"
                value={form.city}
                onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                placeholder="Ej: Corralejo"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Teléfono</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+34 600 000 000"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
          </div>

          {saveError && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3">{saveError}</p>}
          {saveMsg && <p className="text-green-600 text-sm bg-green-50 rounded-xl px-4 py-3">{saveMsg}</p>}

          <div className="flex items-center justify-between pt-1">
            <p className="text-xs text-gray-400">
              Página pública:{' '}
              <a href={`/${operator.slug}`} target="_blank" className="text-sky-500 hover:underline">
                slotly.app/{operator.slug}
              </a>
            </p>
            <button type="submit" disabled={saving}
              className="bg-gray-900 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-gray-700 transition-colors disabled:opacity-50">
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>

      {/* Stripe Connect */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Cuenta bancaria</h2>
            <p className="text-sm text-gray-500 mt-1">
              {stripeEnabled
                ? 'Tu cuenta está conectada. Recibirás los pagos de las reservas automáticamente.'
                : stripePartial
                  ? 'Conecta tu cuenta para completar el proceso y empezar a cobrar.'
                  : 'Conecta tu cuenta bancaria para recibir los pagos de las reservas. Slotly cobra un 2% de comisión por reserva.'}
            </p>
          </div>
          <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${stripeEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
            {stripeEnabled ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-green-600">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-400">
                <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
              </svg>
            )}
          </div>
        </div>

        <div className="mt-5">
          {stripeEnabled ? (
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                Conectada
              </span>
              <button onClick={handleOpenDashboard} disabled={dashboardLoading}
                className="text-sm font-semibold text-sky-500 hover:text-sky-600 transition-colors disabled:opacity-50">
                {dashboardLoading ? 'Abriendo...' : 'Ver panel de pagos →'}
              </button>
            </div>
          ) : (
            <button onClick={handleConnectStripe} disabled={connectingStripe}
              className="inline-flex items-center gap-2 bg-sky-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-sky-400 transition-colors disabled:opacity-50">
              {connectingStripe ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12"/>
                  </svg>
                  Redirigiendo...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
                  </svg>
                  {stripePartial ? 'Completar configuración' : 'Conectar cuenta bancaria'}
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Plan */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">Plan actual</h2>
            <p className="text-sm text-gray-500 mt-1 capitalize">
              {operator.subscription_status === 'trialing'
                ? 'Prueba gratuita (14 días)'
                : operator.subscription_status}
            </p>
          </div>
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1.5 rounded-lg uppercase tracking-wide">
            {operator.subscription_status === 'trialing' ? 'Trial' : 'Activo'}
          </span>
        </div>
      </div>
    </div>
  )
}
