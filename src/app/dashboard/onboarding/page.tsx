import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: operator } = await supabase
    .from('operators')
    .select('id, name, slug, stripe_account_enabled, stripe_account_id')
    .eq('user_id', user.id)
    .single()
  if (!operator) redirect('/login')

  const { data: experiences } = await supabase
    .from('experiences')
    .select('id')
    .eq('operator_id', operator.id)
    .limit(1)

  const hasExperience = (experiences ?? []).length > 0
  const hasStripe = operator.stripe_account_enabled === true

  const steps = [
    {
      id: 'cuenta',
      label: 'Cuenta creada',
      desc: 'Tu cuenta de Slotly está lista.',
      done: true,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      ),
      action: null,
    },
    {
      id: 'stripe',
      label: 'Conecta tu cuenta bancaria',
      desc: hasStripe
        ? 'Stripe Connect activo. Recibirás pagos directamente.'
        : 'Conecta Stripe para cobrar las reservas online. Solo tarda 5 minutos.',
      done: hasStripe,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
      ),
      action: hasStripe ? null : { label: 'Conectar Stripe →', href: '/dashboard/perfil' },
    },
    {
      id: 'experiencia',
      label: 'Crea tu primera experiencia',
      desc: hasExperience
        ? 'Ya tienes al menos una experiencia publicada.'
        : 'Añade los detalles de tu actividad: precio, horarios, capacidad máxima.',
      done: hasExperience,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ),
      action: hasExperience ? null : { label: 'Crear experiencia →', href: '/dashboard/experiencias/nueva' },
    },
    {
      id: 'compartir',
      label: 'Comparte tu página',
      desc: 'Copia tu link y compártelo con tus clientes. Pueden reservar al instante.',
      done: hasExperience && hasStripe,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
      ),
      action: hasExperience && hasStripe
        ? { label: `Ver página pública →`, href: `/${operator.slug}`, external: true }
        : null,
    },
  ]

  const completedCount = steps.filter(s => s.done).length
  const allDone = completedCount === steps.length
  const pct = Math.round((completedCount / steps.length) * 100)

  return (
    <div className="pt-14 lg:pt-0 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">
          {allDone ? '🎉 ¡Todo listo!' : `Bienvenido, ${operator.name.split(' ')[0]}`}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {allDone
            ? 'Tu negocio está configurado y listo para recibir reservas.'
            : 'Completa estos pasos para empezar a recibir reservas online.'}
        </p>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-gray-900">{completedCount} de {steps.length} pasos completados</span>
          <span className="text-sm font-black text-sky-500">{pct}%</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-2.5 bg-sky-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, i) => (
          <div
            key={step.id}
            className={`bg-white rounded-2xl border p-5 flex items-start gap-4 transition-all ${
              step.done ? 'border-green-100 bg-green-50/30' : 'border-gray-100'
            }`}
          >
            {/* Step number / check */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
              step.done
                ? 'bg-green-100 text-green-600'
                : 'bg-gray-100 text-gray-400'
            }`}>
              {step.done ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : (
                <span>{i + 1}</span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className={`font-bold text-sm ${step.done ? 'text-green-800' : 'text-gray-900'}`}>
                {step.label}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.desc}</p>
              {step.action && (
                <div className="mt-3">
                  {'external' in step.action && step.action.external ? (
                    <Link
                      href={step.action.href}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 bg-sky-500 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-sky-400 transition-colors"
                    >
                      {step.action.label}
                    </Link>
                  ) : (
                    <Link
                      href={step.action.href}
                      className="inline-flex items-center gap-1.5 bg-sky-500 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-sky-400 transition-colors"
                    >
                      {step.action.label}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CTA final */}
      {allDone && (
        <div className="mt-6 bg-gray-900 rounded-2xl p-6 text-center">
          <p className="text-white font-bold mb-1">¡Tu negocio está online!</p>
          <p className="text-gray-400 text-sm mb-4">Comparte este link con tus clientes para recibir reservas.</p>
          <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2.5 mb-4 max-w-sm mx-auto">
            <span className="text-white text-xs font-mono truncate flex-1">
              {process.env.NEXT_PUBLIC_APP_URL ?? 'https://slotly-zeta.vercel.app'}/{operator.slug}
            </span>
          </div>
          <Link
            href="/dashboard"
            className="inline-block bg-sky-500 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-sky-400 transition-colors text-sm"
          >
            Ir al dashboard →
          </Link>
        </div>
      )}

      {!allDone && (
        <div className="mt-4 text-center">
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            Hacer esto después →
          </Link>
        </div>
      )}
    </div>
  )
}
