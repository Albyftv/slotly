'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Suspense } from 'react'

function RegistroForm() {
  const router = useRouter()
  const params = useSearchParams()
  const plan = params.get('plan') ?? 'basic'

  const [step, setStep] = useState<'account' | 'business'>('account')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [account, setAccount] = useState({ email: '', password: '', confirmPassword: '' })
  const [business, setBusiness] = useState({ name: '', city: '', phone: '', whatsapp: '' })

  async function handleAccount(e: React.FormEvent) {
    e.preventDefault()
    if (account.password !== account.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (account.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }
    setError('')
    setStep('business')
  }

  async function handleBusiness(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()

      // Crear usuario + operador vía API (service_role bypasa RLS)
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: account.email,
          password: account.password,
          name: business.name,
          city: business.city || null,
          phone: business.phone || null,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error al crear la cuenta')

      // Login automático tras registro
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: account.email,
        password: account.password,
      })
      if (loginError) throw loginError

      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-100 px-6 h-16 flex items-center">
        <Link href="/" className="text-xl font-black tracking-tight">
          slot<span className="text-sky-500">ly</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Progress */}
          <div className="flex items-center gap-3 mb-8">
            <div className={`flex-1 h-1.5 rounded-full ${step === 'account' ? 'bg-sky-500' : 'bg-sky-500'}`} />
            <div className={`flex-1 h-1.5 rounded-full ${step === 'business' ? 'bg-sky-500' : 'bg-gray-200'}`} />
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            {step === 'account' ? (
              <>
                <h1 className="text-2xl font-black text-gray-900 mb-1">Crea tu cuenta</h1>
                <p className="text-gray-500 text-sm mb-6">Plan {plan === 'pro' ? 'Pro · 39€/mes' : 'Basic · 19€/mes'} · 14 días gratis</p>

                <form onSubmit={handleAccount} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                    <input
                      type="email" required
                      value={account.email}
                      onChange={e => setAccount(a => ({ ...a, email: e.target.value }))}
                      placeholder="tu@email.com"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contraseña</label>
                    <input
                      type="password" required
                      value={account.password}
                      onChange={e => setAccount(a => ({ ...a, password: e.target.value }))}
                      placeholder="Mínimo 8 caracteres"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirmar contraseña</label>
                    <input
                      type="password" required
                      value={account.confirmPassword}
                      onChange={e => setAccount(a => ({ ...a, confirmPassword: e.target.value }))}
                      placeholder="Repite la contraseña"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3">{error}</p>}
                  <button type="submit"
                    className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-gray-700 transition-colors">
                    Continuar →
                  </button>
                </form>
              </>
            ) : (
              <>
                <button onClick={() => setStep('account')} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-4">
                  ← Volver
                </button>
                <h1 className="text-2xl font-black text-gray-900 mb-1">Tu negocio</h1>
                <p className="text-gray-500 text-sm mb-6">Puedes completar estos datos después</p>

                <form onSubmit={handleBusiness} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre del negocio *</label>
                    <input
                      type="text" required
                      value={business.name}
                      onChange={e => setBusiness(b => ({ ...b, name: e.target.value }))}
                      placeholder="Ej: Corralejo Surf School"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ciudad</label>
                    <input
                      type="text"
                      value={business.city}
                      onChange={e => setBusiness(b => ({ ...b, city: e.target.value }))}
                      placeholder="Ej: Corralejo, Fuerteventura"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Teléfono</label>
                    <input
                      type="tel"
                      value={business.phone}
                      onChange={e => setBusiness(b => ({ ...b, phone: e.target.value }))}
                      placeholder="+34 600 000 000"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3">{error}</p>}
                  <button type="submit" disabled={loading}
                    className="w-full bg-sky-500 text-white font-bold py-3.5 rounded-xl hover:bg-sky-400 transition-colors disabled:opacity-50">
                    {loading ? 'Creando cuenta...' : 'Crear cuenta gratis →'}
                  </button>
                </form>
              </>
            )}

            <p className="text-center text-xs text-gray-400 mt-6">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-sky-500 hover:underline font-semibold">Acceder</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RegistroPage() {
  return (
    <Suspense>
      <RegistroForm />
    </Suspense>
  )
}
