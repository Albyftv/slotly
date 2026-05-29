import Link from 'next/link'

const PLANS = [
  {
    name: 'Basic',
    price: '19',
    desc: 'Para empezar a cobrar online hoy mismo.',
    features: [
      'Hasta 3 experiencias',
      'Reservas ilimitadas',
      'Pago online integrado',
      'Notificaciones por email',
      'Multiidioma ES/EN/DE/FR',
      'Widget embebible',
      'Soporte por email',
    ],
    cta: 'Empezar gratis',
    href: '/registro?plan=basic',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '39',
    desc: 'Para operadores que quieren crecer sin límites.',
    features: [
      'Experiencias ilimitadas',
      'Todo lo del Basic',
      'Analytics avanzado',
      'Dominio personalizado',
      'Soporte prioritario',
      'Exportación de datos',
      'API acceso',
    ],
    cta: 'Empezar gratis',
    href: '/registro?plan=pro',
    highlight: true,
  },
]

export default function PreciosPage() {
  return (
    <div className="min-h-screen">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tight text-gray-900">
            slot<span className="text-sky-500">ly</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/precios" className="text-sm text-gray-900 font-semibold">Precios</Link>
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Acceder</Link>
            <Link href="/registro" className="bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors">
              Prueba gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-36 pb-16 px-6 bg-gradient-to-b from-sky-50 to-white text-center">
        <p className="text-sky-500 text-xs font-bold tracking-widest uppercase mb-3">Precios</p>
        <h1 className="text-5xl font-black text-gray-900 mb-4">Simple y transparente</h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          14 días gratis sin tarjeta de crédito. + 2% por reserva completada. Sin sorpresas.
        </p>
      </section>

      {/* PLANS */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-6">
          {PLANS.map(plan => (
            <div
              key={plan.name}
              className={`rounded-3xl p-8 flex flex-col ${
                plan.highlight
                  ? 'bg-gray-900 text-white relative overflow-hidden'
                  : 'border border-gray-200'
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-4 right-4 bg-sky-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Popular
                </div>
              )}
              <p className={`text-sm font-bold mb-1 ${plan.highlight ? 'text-gray-400' : 'text-gray-500'}`}>
                {plan.name}
              </p>
              <div className="flex items-end gap-1 mb-2">
                <span className={`text-5xl font-black ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                  {plan.price}€
                </span>
                <span className={`mb-1 ${plan.highlight ? 'text-gray-400' : 'text-gray-400'}`}>/mes</span>
              </div>
              <p className={`text-sm mb-6 ${plan.highlight ? 'text-gray-400' : 'text-gray-500'}`}>
                {plan.desc}
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <svg viewBox="0 0 20 20" fill={plan.highlight ? '#38bdf8' : '#22c55e'} className="w-4 h-4 flex-shrink-0">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                    </svg>
                    <span className={plan.highlight ? 'text-gray-300' : 'text-gray-600'}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`block text-center font-bold py-3 rounded-xl transition-colors ${
                  plan.highlight
                    ? 'bg-sky-500 text-white hover:bg-sky-400'
                    : 'border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Commission note */}
        <div className="max-w-3xl mx-auto mt-8 bg-sky-50 border border-sky-100 rounded-2xl p-6 text-center">
          <p className="text-sky-700 font-semibold text-sm">+ 2% por reserva completada</p>
          <p className="text-sky-600 text-xs mt-1">Solo pagamos juntos cuando tú cobras. Si no hay reservas, no hay comisión.</p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          14 días gratis sin tarjeta de crédito · Cancela cuando quieras · Precios sin IVA
        </p>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 text-center mb-10">Preguntas frecuentes</h2>
          <div className="space-y-6">
            {[
              {
                q: '¿Necesito tarjeta de crédito para el período de prueba?',
                a: 'No. Empieza gratis 14 días sin ningún dato de pago. Solo te pedimos tarjeta si decides continuar.',
              },
              {
                q: '¿Qué es el 2% por reserva?',
                a: 'Además de la cuota mensual, Slotly cobra un 2% del valor de cada reserva completada. Si el cliente cancela y se devuelve el pago, no cobramos comisión.',
              },
              {
                q: '¿Puedo cambiar de plan en cualquier momento?',
                a: 'Sí, puedes pasar de Basic a Pro (o viceversa) cuando quieras desde tu panel de control. El cambio se aplica en el próximo ciclo de facturación.',
              },
              {
                q: '¿Cómo llega el dinero de las reservas a mi cuenta?',
                a: 'Usamos Stripe Connect. Conectas tu cuenta bancaria una sola vez y el dinero de las reservas llega directamente en 2 días hábiles.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="bg-white rounded-2xl p-6 border border-gray-100">
                <p className="font-bold text-gray-900 mb-2">{q}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gray-950 text-white text-center">
        <h2 className="text-3xl font-black mb-4">Empieza hoy gratis</h2>
        <p className="text-gray-400 mb-8">14 días sin compromisos. Configura tu primera experiencia en 10 minutos.</p>
        <Link href="/registro" className="inline-block bg-sky-500 text-white font-bold px-10 py-4 rounded-2xl text-lg hover:bg-sky-400 transition-colors">
          Prueba gratis 14 días →
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-400">
          © 2026 Slotly ·{' '}
          <Link href="/" className="hover:text-gray-600">Inicio</Link>
          {' · '}
          <Link href="/login" className="hover:text-gray-600">Acceder</Link>
          {' · '}
          <Link href="/registro" className="hover:text-gray-600">Registro</Link>
        </p>
      </footer>
    </div>
  )
}
