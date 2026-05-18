import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Slotly para operadores turísticos · Reservas online en Canarias',
  description: 'Acepta reservas y pagos online para tus experiencias turísticas. Calendario, confirmaciones automáticas y dashboard de gestión. 14 días gratis.',
}

export default function OperadoresPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 h-16 flex items-center justify-between px-6">
        <Link href="/" className="text-xl font-black tracking-tight">
          slot<span className="text-sky-500">ly</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-gray-900">
            Acceder
          </Link>
          <Link href="/registro"
            className="bg-gray-900 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors">
            Empieza gratis
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-sky-100 text-sky-700 text-xs font-bold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            Para operadores turísticos en Canarias
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-6">
            Acepta reservas online<br />
            <span className="text-sky-500">mientras duermes</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
            Tu escuela de surf, ruta en quad o avistamiento de cetáceos con página de reservas profesional, pagos online y gestión automática. En 30 minutos.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/registro"
              className="bg-sky-500 text-white font-black px-8 py-4 rounded-2xl text-lg hover:bg-sky-400 transition-colors shadow-lg shadow-sky-200">
              Empieza 14 días gratis →
            </Link>
            <a href="https://slotly-zeta.vercel.app/fuerteventura-adventures/clase-surf-corralejo"
              target="_blank" rel="noopener"
              className="bg-white border-2 border-gray-200 text-gray-700 font-bold px-8 py-4 rounded-2xl text-lg hover:border-gray-300 transition-colors">
              Ver demo en vivo
            </a>
          </div>
          <p className="text-gray-400 text-sm mt-4">Sin tarjeta de crédito · Cancela cuando quieras</p>
        </div>
      </section>

      {/* Pain */}
      <section className="py-16 px-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-black mb-4">
            ¿Cuántas reservas pierdes por WhatsApp?
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
            Un turista alemán planifica su viaje a las 11 de la noche. Encuentra tu Instagram, le encanta lo que haces, pero solo ve un número de WhatsApp. Al día siguiente, ya reservó con otro.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { n: '73%', label: 'de los turistas prefieren reservar online antes de llegar a destino' },
              { n: '11pm', label: 'hora más frecuente de búsqueda de experiencias turísticas' },
              { n: '0€', label: 'que cobras por una reserva perdida por no tener sistema' },
            ].map(s => (
              <div key={s.n} className="bg-white/10 rounded-2xl p-6">
                <p className="text-4xl font-black text-sky-400 mb-2">{s.n}</p>
                <p className="text-gray-300 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Listo en 30 minutos</h2>
            <p className="text-gray-500">Sin código, sin técnicos, sin complicaciones.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Crea tu cuenta',
                desc: 'Regístrate con tu email, añade el nombre de tu negocio y listo. 2 minutos.',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                ),
              },
              {
                step: '2',
                title: 'Añade tu experiencia',
                desc: 'Nombre, fotos, precio, horarios disponibles y cuántas personas acepta. 15 minutos.',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ),
              },
              {
                step: '3',
                title: 'Comparte el link',
                desc: 'Pégalo en tu Instagram, Google My Business o WhatsApp. Los clientes reservan solos.',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
                  </svg>
                ),
              },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-sky-500">
                  {item.icon}
                </div>
                <div className="text-xs font-black text-sky-500 mb-2 tracking-widest uppercase">Paso {item.step}</div>
                <h3 className="text-lg font-black text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo screenshot-like mockup */}
      <section className="py-4 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xl">
            {/* Browser bar */}
            <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-white rounded-lg px-3 py-1 text-xs text-gray-400 font-mono text-center">
                slotly.es/tu-negocio/clase-surf
              </div>
            </div>
            {/* Content preview */}
            <div className="p-6 grid sm:grid-cols-2 gap-6">
              {/* Left: info */}
              <div className="space-y-4">
                <div className="h-36 rounded-2xl flex items-end p-4 relative overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80"
                    alt="Clase de surf"
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="relative z-10">
                    <div className="flex gap-2 mb-2">
                      <span className="bg-sky-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">⏱ 2h</span>
                      <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2 py-0.5 rounded-full">👥 Máx 8</span>
                    </div>
                    <p className="text-white font-black text-lg">Clase de Surf</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded-full w-full" />
                  <div className="h-3 bg-gray-100 rounded-full w-4/5" />
                  <div className="h-3 bg-gray-100 rounded-full w-3/5" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {['✅ Tabla incluida', '✅ Neopreno', '✅ Instructor', '✅ Seguro'].map(i => (
                    <div key={i} className="text-xs text-gray-600 bg-gray-50 rounded-lg px-2 py-1.5">{i}</div>
                  ))}
                </div>
              </div>
              {/* Right: booking widget */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <p className="text-2xl font-black text-gray-900 mb-4">45€<span className="text-sm font-normal text-gray-400">/persona</span></p>
                {/* Mini calendar */}
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-400 mb-2">MAYO 2026</p>
                  <div className="grid grid-cols-7 gap-0.5">
                    {['L','M','X','J','V','S','D'].map(d => (
                      <div key={d} className="text-center text-xs text-gray-300 font-bold">{d}</div>
                    ))}
                    {[null,null,null,1,2,3,4,5,6,7,8,9,10,11].map((d, i) => (
                      <div key={i} className={`aspect-square rounded-lg flex items-center justify-center text-xs font-semibold ${
                        d === 8 ? 'bg-sky-500 text-white' :
                        d && [2,3,7,8,9,10].includes(d) ? 'text-gray-700 hover:bg-sky-50' :
                        d ? 'text-gray-300' : ''
                      }`}>{d}</div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {['09:00', '14:00'].map(t => (
                    <div key={t} className={`text-center py-2 rounded-xl text-sm font-bold border-2 ${t === '09:00' ? 'border-sky-500 bg-sky-500 text-white' : 'border-gray-200 text-gray-600'}`}>{t}</div>
                  ))}
                </div>
                <div className="bg-sky-500 text-white font-black py-3 rounded-xl text-center text-sm">
                  Reservar · 45,00€
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-gray-400 text-sm mt-4">Así ve tu cliente la página de reservas</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Todo lo que necesitas</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: '📅', title: 'Calendario de disponibilidad', desc: 'Configura qué días y horarios tienes disponibles. El cliente solo ve fechas reales.' },
              { icon: '💳', title: 'Cobro online garantizado', desc: 'Pago con tarjeta antes de la actividad. Sin no-shows, sin cobros en efectivo.' },
              { icon: '📧', title: 'Confirmaciones automáticas', desc: 'El cliente recibe un email con todos los detalles al instante. Tú no haces nada.' },
              { icon: '📊', title: 'Dashboard de gestión', desc: 'Todas tus reservas en un panel: fecha, cliente, importe, estado. En tiempo real.' },
              { icon: '💰', title: 'Dinero directo a tu cuenta', desc: 'Conectas tu cuenta bancaria y recibes el 98% de cada reserva automáticamente.' },
              { icon: '🌍', title: 'Multiidioma', desc: 'Tus experiencias en español, inglés, alemán y francés para llegar a más turistas.' },
            ].map(f => (
              <div key={f.title} className="flex gap-4 p-5 bg-gray-50 rounded-2xl">
                <span className="text-2xl flex-shrink-0">{f.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-3">Precio simple y justo</h2>
          <p className="text-gray-500 mb-10">Sin sorpresas. Pagas solo cuando funciona.</p>

          <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
            <p className="text-5xl font-black text-gray-900 mb-1">19€<span className="text-lg font-normal text-gray-400">/mes</span></p>
            <p className="text-gray-500 mb-6">+ 2% por reserva completada</p>
            <ul className="text-left space-y-3 mb-8">
              {[
                'Página de reservas ilimitada',
                'Hasta 3 experiencias activas',
                'Cobros online con Stripe',
                'Emails automáticos al cliente',
                'Dashboard de gestión',
                'Soporte directo por WhatsApp',
              ].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                  <svg viewBox="0 0 20 20" fill="#0ea5e9" className="w-5 h-5 flex-shrink-0">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/registro"
              className="block w-full bg-sky-500 text-white font-black py-4 rounded-2xl text-lg hover:bg-sky-400 transition-colors shadow-lg shadow-sky-200 text-center">
              Empezar 14 días gratis →
            </Link>
            <p className="text-xs text-gray-400 mt-3">Sin tarjeta de crédito · Cancela cuando quieras</p>
          </div>

          <p className="text-gray-500 text-sm mt-6">
            ¿Más de 3 experiencias? Plan Pro a <strong>39€/mes</strong> con experiencias ilimitadas.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">Preguntas frecuentes</h2>
          <div className="space-y-6">
            {[
              {
                q: '¿Necesito saber de tecnología?',
                a: 'No. El proceso es: creas una cuenta, rellenas los datos de tu experiencia (nombre, precio, horarios, fotos) y obtienes un link. Sin código, sin configuraciones técnicas.',
              },
              {
                q: '¿Cómo recibo el dinero?',
                a: 'Conectas tu cuenta bancaria española a través de Stripe en menos de 10 minutos. Cada reserva confirmada ingresa directamente en tu cuenta el 98% del importe. El 2% es la comisión de Slotly.',
              },
              {
                q: '¿Qué pasa si el cliente cancela?',
                a: 'Gestionas tú la política de cancelación. Stripe permite hacer devoluciones desde el dashboard con un clic. Te avisamos por email de cada cancelación.',
              },
              {
                q: '¿Puedo usarlo con mis reservas de GetYourGuide o Airbnb?',
                a: 'Sí, son complementarios. Slotly es para tus clientes directos — los que llegan por Instagram, Google, tu web o boca a boca. Sin comisiones del 20-30%.',
              },
              {
                q: '¿Y si no me convence?',
                a: 'Tienes 14 días completamente gratis para probarlo. Sin tarjeta de crédito. Si no ves el valor, no pagas nada.',
              },
            ].map(item => (
              <div key={item.q} className="border-b border-gray-100 pb-6">
                <h3 className="font-bold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-sky-500 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            La próxima reserva que no pierdas ya paga el mes
          </h2>
          <p className="text-sky-100 text-lg mb-8">
            Empieza hoy. En 30 minutos tienes tu página de reservas funcionando.
          </p>
          <Link href="/registro"
            className="inline-block bg-white text-sky-600 font-black px-10 py-4 rounded-2xl text-lg hover:bg-sky-50 transition-colors shadow-xl">
            Crear mi cuenta gratis →
          </Link>
          <p className="text-sky-200 text-sm mt-4">14 días gratis · Sin tarjeta · Cancela cuando quieras</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100 text-center">
        <div className="flex items-center justify-center gap-6 mb-4">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">Inicio</Link>
          <Link href="/login" className="text-sm text-gray-400 hover:text-gray-600">Acceder</Link>
          <Link href="/registro" className="text-sm text-gray-400 hover:text-gray-600">Registro</Link>
        </div>
        <p className="text-xs text-gray-300">© 2026 Slotly · Reservas online para experiencias turísticas en Canarias</p>
      </footer>

    </div>
  )
}
