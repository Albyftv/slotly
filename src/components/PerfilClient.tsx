'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Operator {
  id: string
  name: string
  slug: string
  email: string
  city: string | null
  phone: string | null
  whatsapp: string | null
  callmebot_api_key: string | null
  stripe_account_id: string | null
  stripe_account_enabled: boolean
  stripe_customer_id: string | null
  subscription_status: string
  subscription_id: string | null
  created_at: string
}

interface Props {
  operator: Operator
  stripeSuccess: boolean
  billingSuccess: boolean
}

export default function PerfilClient({ operator, stripeSuccess, billingSuccess }: Props) {
  const [form, setForm] = useState({
    name: operator.name,
    city: operator.city ?? '',
    phone: operator.phone ?? '',
    whatsapp: operator.whatsapp ?? '',
    callmebot_api_key: operator.callmebot_api_key ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [saveError, setSaveError] = useState('')
  const [connectingStripe, setConnectingStripe] = useState(false)
  const [dashboardLoading, setDashboardLoading] = useState(false)
  const [billingLoading, setBillingLoading] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)

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

  async function handleActivateBilling() {
    setBillingLoading(true)
    try {
      const res = await fetch('/api/stripe/billing/checkout', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error')
      window.location.href = data.url
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error al activar suscripción')
      setBillingLoading(false)
    }
  }

  async function handleManageBilling() {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/billing/portal', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error')
      window.location.href = data.url
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error al abrir portal')
      setPortalLoading(false)
    }
  }

  const stripeEnabled = operator.stripe_account_enabled
  const stripePartial = !!operator.stripe_account_id && !stripeEnabled

  // Trial days remaining
  const trialEnd = new Date(operator.created_at)
  trialEnd.setDate(trialEnd.getDate() + 14)
  const trialDaysLeft = Math.max(0, Math.ceil((trialEnd.getTime() - Date.now()) / 86400000))

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
              <Link href={`/${operator.slug}`} target="_blank" className="text-sky-500 hover:underline">
                slotly.app/{operator.slug}
              </Link>
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

      {/* WhatsApp Notifications */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-start gap-3 mb-5">
          <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${form.callmebot_api_key ? 'bg-green-100' : 'bg-gray-100'}`}>
            <svg viewBox="0 0 24 24" fill={form.callmebot_api_key ? '#16a34a' : '#9ca3af'} className="w-5 h-5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.523 5.848L.057 23.625a.563.563 0 0 0 .693.693l5.772-1.466A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.796 9.796 0 0 1-5.001-1.367l-.358-.213-3.427.871.887-3.34-.234-.374A9.77 9.77 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Notificaciones WhatsApp</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Recibe un WhatsApp instantáneo cada vez que llega una reserva nueva.
            </p>
          </div>
        </div>

        {!form.callmebot_api_key && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-4 text-xs text-amber-800 leading-relaxed">
            <p className="font-bold mb-1">Activación rápida (gratis, 1 minuto):</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Abre WhatsApp y escribe a <span className="font-mono font-bold">+34 644 55 17 36</span></li>
              <li>Envía el mensaje: <span className="font-mono font-bold">I allow callmebot to send me messages</span></li>
              <li>Recibirás tu API key por WhatsApp en segundos</li>
              <li>Pégala abajo y guarda</li>
            </ol>
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Número de WhatsApp <span className="text-gray-400 font-normal">(con prefijo país, ej: +34600000000)</span>
            </label>
            <input
              type="tel"
              value={form.whatsapp}
              onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
              placeholder="+34600000000"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              API Key de CallMeBot
            </label>
            <input
              type="text"
              value={form.callmebot_api_key}
              onChange={e => setForm(f => ({ ...f, callmebot_api_key: e.target.value }))}
              placeholder="Ej: 123456"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent font-mono"
            />
          </div>
          {form.callmebot_api_key && (
            <div className="flex items-center gap-2 text-xs text-green-700 font-semibold">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Notificaciones activas — guarda los cambios para aplicar
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Powered by <a href="https://www.callmebot.com" target="_blank" rel="noopener" className="hover:underline">CallMeBot</a> · Servicio gratuito
        </p>
      </div>

      {/* Billing success banner */}
      {billingSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 flex items-center gap-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-green-500 flex-shrink-0">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <p className="text-sm font-semibold text-green-700">¡Suscripción activada correctamente! Bienvenido a Slotly.</p>
        </div>
      )}

      {/* Subscription */}
      <div className={`rounded-2xl border p-6 shadow-sm ${
        operator.subscription_status === 'cancelled'
          ? 'bg-red-50 border-red-200'
          : operator.subscription_status === 'active'
          ? 'bg-white border-gray-100'
          : 'bg-amber-50 border-amber-200'
      }`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Suscripción</h2>
            <p className="text-sm text-gray-500 mt-1">
              {operator.subscription_status === 'active'
                ? 'Plan Basic · 19€/mes · Pago automático mensual'
                : operator.subscription_status === 'trialing'
                ? `Prueba gratuita · ${trialDaysLeft} día${trialDaysLeft !== 1 ? 's' : ''} restante${trialDaysLeft !== 1 ? 's' : ''}`
                : 'Suscripción cancelada · El acceso está restringido'}
            </p>
          </div>
          <span className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wide ${
            operator.subscription_status === 'active' ? 'text-green-700 bg-green-100'
            : operator.subscription_status === 'trialing' ? 'text-amber-700 bg-amber-100'
            : 'text-red-700 bg-red-100'
          }`}>
            {operator.subscription_status === 'active' ? 'Activo'
              : operator.subscription_status === 'trialing' ? 'Trial'
              : 'Cancelado'}
          </span>
        </div>

        <div className="mt-5">
          {operator.subscription_status === 'active' ? (
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-700 bg-green-100 px-3 py-1.5 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                Activo
              </span>
              <button onClick={handleManageBilling} disabled={portalLoading}
                className="text-sm font-semibold text-sky-500 hover:text-sky-600 transition-colors disabled:opacity-50">
                {portalLoading ? 'Abriendo...' : 'Gestionar suscripción →'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {operator.subscription_status === 'trialing' && trialDaysLeft <= 3 && (
                <p className="text-xs text-amber-700 font-semibold">
                  ⚠️ Tu periodo de prueba termina pronto. Activa tu suscripción para no perder el acceso.
                </p>
              )}
              <button onClick={handleActivateBilling} disabled={billingLoading}
                className="inline-flex items-center gap-2 bg-sky-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-sky-400 transition-colors disabled:opacity-50">
                {billingLoading ? (
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
                    {operator.subscription_status === 'cancelled' ? 'Reactivar suscripción' : 'Activar por 19€/mes'}
                  </>
                )}
              </button>
              <p className="text-xs text-gray-400">Sin permanencia · Cancela cuando quieras</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
