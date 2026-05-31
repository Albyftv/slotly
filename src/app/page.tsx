import Link from 'next/link'
import Image from 'next/image'

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
      </svg>
    ),
    title: 'Calendario inteligente',
    desc: 'Define tus horarios una vez. El sistema gestiona la disponibilidad en tiempo real y evita el doble booking.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
    ),
    title: 'Cobra online 24/7',
    desc: 'Tus clientes pagan con tarjeta desde cualquier país. El dinero llega a tu cuenta en 2 días hábiles.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.32 2 2 0 0 1 3.62 1.14h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.37a16 16 0 0 0 6 6l1.27-.93a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    title: 'Notificaciones WhatsApp',
    desc: 'Recibe cada reserva al instante en WhatsApp. Tus clientes también reciben confirmación por email automáticamente.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    title: 'Multiidioma',
    desc: 'Tu página de reservas en español, inglés y alemán. Perfecta para turistas de toda Europa.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    title: 'Incrustar en tu web',
    desc: '¿Ya tienes web propia? Añade el widget de reservas con una línea de código. Compatible con WordPress, Wix, Squarespace y cualquier HTML.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/>
      </svg>
    ),
    title: 'Analytics en tiempo real',
    desc: 'Ve cuánto has facturado, qué experiencias convierten mejor y cuándo son tus temporadas altas.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Pagos seguros',
    desc: 'Tecnología Stripe. PCI-DSS compliant. Tus clientes pagan con total confianza desde cualquier dispositivo.',
  },
]

const EXPERIENCE_TYPES = [
  {
    title: 'Surf & Kitesurf',
    desc: 'Escuelas de surf, clases de kite, alquiler de tablas',
    img: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&q=80',
    color: 'from-blue-600 to-cyan-400',
  },
  {
    title: 'Buceo & Snorkel',
    desc: 'Bautismos de buceo, inmersiones guiadas, snorkeling',
    img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80',
    color: 'from-teal-600 to-emerald-400',
  },
  {
    title: 'Excursiones & Quad',
    desc: 'Rutas en quad, jeep safari, trekking por volcanes',
    img: 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=600&q=80',
    color: 'from-orange-600 to-amber-400',
  },
  {
    title: 'Whale Watching',
    desc: 'Avistamiento de cetáceos, paseos en barco, pesca',
    img: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=600&q=80',
    color: 'from-sky-600 to-blue-400',
  },
  {
    title: 'Parapente & Aire',
    desc: 'Vuelos en parapente, ala delta, experiencias aéreas',
    img: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=600&q=80',
    color: 'from-violet-600 to-purple-400',
  },
  {
    title: 'Rutas & Cultura',
    desc: 'Tours guiados, visitas culturales, gastronomía local',
    img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80',
    color: 'from-rose-600 to-pink-400',
  },
]

const PAIN_POINTS = [
  'Recibes reservas por WhatsApp a las 11 de la noche',
  'Tienes que confirmar cada reserva manualmente',
  'No sabes cuántas plazas quedan hasta que miras la libreta',
  'Pierdes clientes extranjeros porque no hablan español',
  'Cobras en efectivo o haces transferencias que tardan días',
  'No puedes irte de vacaciones porque alguien tiene que gestionar',
]

const COMPARISON = [
  { feature: 'Reservas online 24/7', slotly: true, manual: false, airbnb: true },
  { feature: 'Sin comisión del 20%', slotly: true, manual: true, airbnb: false },
  { feature: 'Pago directo a tu cuenta', slotly: true, manual: false, airbnb: false },
  { feature: 'Tu marca, tu dominio', slotly: true, manual: true, airbnb: false },
  { feature: 'Multiidioma (ES/EN/DE/FR)', slotly: true, manual: false, airbnb: true },
  { feature: 'Widget para tu web propia', slotly: true, manual: false, airbnb: false },
  { feature: 'Analytics y datos tuyos', slotly: true, manual: false, airbnb: false },
  { feature: 'Sin contrato, cancela cuando quieras', slotly: true, manual: true, airbnb: false },
]

const STEPS = [
  { num: '01', title: 'Crea tu perfil', desc: 'Añade tus experiencias con fotos, precios y horarios en menos de 10 minutos.' },
  { num: '02', title: 'Comparte tu link', desc: 'Pon el link en Instagram, WhatsApp, Google o donde tengas presencia.' },
  { num: '03', title: 'Cobra y gestiona', desc: 'Las reservas llegan solas. Tú solo tienes que aparecer y disfrutar.' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">

      {/* ── NAV ──────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-black tracking-tight text-gray-900">
            slot<span className="text-sky-500">ly</span>
          </span>
          <div className="flex items-center gap-6">
            <Link href="/operadores" className="text-sm text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">
              Para operadores
            </Link>
            <Link href="/precios" className="text-sm text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">
              Precios
            </Link>
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Acceder
            </Link>
            <Link href="/registro" className="bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors">
              Prueba gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
            Para operadores turísticos en Canarias
          </div>
          <h1 className="text-5xl sm:text-7xl font-black text-gray-900 leading-none tracking-tight mb-6">
            Tu agenda llena.<br />
            <span className="text-sky-500">Sin WhatsApp.</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Reservas online con pago integrado para surf, diving, excursiones y cualquier experiencia turística.
            Tus clientes reservan solos, en su idioma, desde cualquier país.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/registro"
              className="bg-gray-900 text-white font-bold px-8 py-4 rounded-2xl text-base hover:bg-gray-700 transition-colors shadow-xl shadow-gray-900/20">
              Empieza gratis 14 días →
            </Link>
            <Link href="#como-funciona"
              className="border border-gray-200 text-gray-700 font-semibold px-8 py-4 rounded-2xl text-base hover:bg-gray-50 transition-colors">
              Ver cómo funciona
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-4">Sin tarjeta de crédito · Configuración en 10 minutos</p>

          {/* Social proof logos */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 opacity-40">
            {['Surf School', 'Diving Center', 'Quad Tours', 'Whale Watching', 'Parapente'].map(t => (
              <span key={t} className="text-xs font-bold tracking-widest uppercase text-gray-500">{t}</span>
            ))}
          </div>
        </div>

        {/* Mockup booking card */}
        <div className="max-w-sm mx-auto mt-16">
          <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200 overflow-hidden border border-gray-100">
            <div className="h-40 relative flex items-end p-5 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&q=80"
                alt="Surf Lesson"
                fill
                unoptimized
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="relative">
                <p className="text-white/70 text-xs font-semibold tracking-widest uppercase">Experiencia</p>
                <p className="text-white text-xl font-black">Surf Lesson — 50€</p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mayo 2026</p>
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {['L','M','X','J','V','S','D'].map(d => (
                    <div key={d} className="text-gray-400 font-semibold py-1">{d}</div>
                  ))}
                  {[null,null,null,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18].map((n, i) => (
                    <div key={i} className={`py-1.5 rounded-lg text-xs font-semibold ${
                      n === 15 ? 'bg-sky-500 text-white' :
                      n && [12,13,16,17,18].includes(n) ? 'text-gray-700 hover:bg-gray-100 cursor-pointer' :
                      n ? 'text-gray-300' : ''
                    }`}>{n ?? ''}</div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Horario</p>
                <div className="flex gap-2">
                  {['09:00','11:00','14:00'].map((t, i) => (
                    <button key={t} className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                      i === 1 ? 'bg-sky-500 text-white border-sky-500' : 'border-gray-200 text-gray-600'
                    }`}>{t}</button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-xs text-gray-400">Total · 2 personas</p>
                  <p className="text-lg font-black text-gray-900">100 €</p>
                </div>
                <button className="bg-sky-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm">
                  Reservar →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCIAS ─────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sky-500 text-xs font-bold tracking-widest uppercase mb-3">Sectores</p>
            <h2 className="text-4xl font-black text-gray-900">Para todo tipo de experiencias</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Si se puede reservar, Slotly lo gestiona. Surf, buceo, excursiones, avistamiento de cetáceos y mucho más.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {EXPERIENCE_TYPES.map(exp => (
              <div key={exp.title} className="group relative rounded-3xl overflow-hidden aspect-[4/3] cursor-pointer">
                <Image
                  src={exp.img}
                  alt={exp.title}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent`} />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-white font-black text-lg leading-tight">{exp.title}</h3>
                  <p className="text-white/70 text-sm mt-1">{exp.desc}</p>
                </div>
                <div className={`absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br ${exp.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESTINOS ─────────────────────────────────────── */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sky-500 text-xs font-bold tracking-widest uppercase mb-3">Destinos</p>
            <h2 className="text-4xl font-black text-gray-900">Explora por isla</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Encuentra experiencias en cada rincón de Canarias.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { slug: 'fuerteventura', name: 'Fuerteventura', emoji: '🏄' },
              { slug: 'tenerife', name: 'Tenerife', emoji: '🌋' },
              { slug: 'gran-canaria', name: 'Gran Canaria', emoji: '🌊' },
              { slug: 'lanzarote', name: 'Lanzarote', emoji: '🌋' },
              { slug: 'la-palma', name: 'La Palma', emoji: '⭐' },
            ].map(d => (
              <Link key={d.slug} href={`/destinos/${d.slug}`}
                className="bg-white border border-gray-100 rounded-2xl p-6 text-center hover:shadow-md hover:border-sky-200 hover:-translate-y-0.5 transition-all group">
                <div className="text-4xl mb-3">{d.emoji}</div>
                <p className="font-black text-gray-900 text-sm group-hover:text-sky-600 transition-colors">{d.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PAIN POINTS ──────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sky-500 text-xs font-bold tracking-widest uppercase mb-4">¿Te suena esto?</p>
            <h2 className="text-4xl font-black text-gray-900 mb-6 leading-tight">
              Gestionar reservas no debería<br />
              <span className="text-gray-400 line-through decoration-red-400">robarte el tiempo</span>
            </h2>
            <ul className="space-y-3">
              {PAIN_POINTS.map(p => (
                <li key={p} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="text-red-400 font-bold flex-shrink-0 mt-0.5">✕</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-950 rounded-3xl p-8 text-white">
            <p className="text-sky-400 text-xs font-bold tracking-widest uppercase mb-4">Con Slotly</p>
            <h3 className="text-2xl font-black mb-6">Tu negocio funciona solo</h3>
            <ul className="space-y-4">
              {[
                ['🌙', 'Reservas mientras duermes — el sistema no para nunca'],
                ['✅', 'Confirmación automática — sin un solo WhatsApp'],
                ['📊', 'Disponibilidad en tiempo real — sin libreta ni Excel'],
                ['🌍', 'Clientes de todo el mundo — en su idioma, con su tarjeta'],
                ['💳', 'Cobro instantáneo — en tu cuenta en 2 días hábiles'],
                ['🏖️', 'Descansa sin culpa — tu negocio sigue funcionando'],
              ].map(([icon, text]) => (
                <li key={text as string} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="flex-shrink-0 text-base">{icon}</span>
                  {text}
                </li>
              ))}
            </ul>
            <Link href="/registro"
              className="mt-6 block text-center bg-sky-500 text-white font-bold py-3 rounded-xl hover:bg-sky-400 transition-colors text-sm">
              Empieza gratis →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ────────────────────────────────── */}
      <section id="como-funciona" className="py-24 px-6 bg-gray-950 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sky-400 text-xs font-bold tracking-widest uppercase mb-3">Proceso</p>
            <h2 className="text-4xl font-black">Funcionando en 10 minutos</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {STEPS.map(s => (
              <div key={s.num} className="relative">
                <div className="text-7xl font-black text-white/5 absolute -top-4 -left-2">{s.num}</div>
                <div className="relative">
                  <div className="text-sky-400 text-sm font-bold mb-2">{s.num}</div>
                  <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sky-500 text-xs font-bold tracking-widest uppercase mb-3">Funcionalidades</p>
            <h2 className="text-4xl font-black text-gray-900">Todo lo que necesitas</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={f.title} className={`p-6 rounded-2xl border border-gray-100 hover:border-sky-200 hover:shadow-lg hover:shadow-sky-50 transition-all group${i === FEATURES.length - 1 && FEATURES.length % 3 === 1 ? ' lg:col-start-2' : ''}`}>
                <div className="w-10 h-10 bg-sky-50 text-sky-500 rounded-xl flex items-center justify-center mb-4 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRECIOS ──────────────────────────────────────── */}
      <section id="precios" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sky-500 text-xs font-bold tracking-widest uppercase mb-3">Precios</p>
            <h2 className="text-4xl font-black text-gray-900">Simple y transparente</h2>
            <p className="text-gray-500 mt-3">+ 2% por reserva completada. Sin sorpresas.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="border border-gray-200 rounded-3xl p-8">
              <p className="text-sm font-bold text-gray-500 mb-1">Basic</p>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-black text-gray-900">19€</span>
                <span className="text-gray-400 mb-1">/mes</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Hasta 3 experiencias', 'Reservas ilimitadas', 'Pago online integrado', 'Notificaciones WhatsApp', 'Multiidioma ES/EN/DE'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg viewBox="0 0 20 20" fill="#22c55e" className="w-4 h-4 flex-shrink-0">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/registro?plan=basic"
                className="block text-center border-2 border-gray-900 text-gray-900 font-bold py-3 rounded-xl hover:bg-gray-900 hover:text-white transition-colors">
                Empezar gratis
              </Link>
            </div>
            <div className="bg-gray-900 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-sky-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Popular
              </div>
              <p className="text-sm font-bold text-gray-400 mb-1">Pro</p>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-black text-white">39€</span>
                <span className="text-gray-400 mb-1">/mes</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Experiencias ilimitadas', 'Todo lo del Basic', 'Analytics avanzado', 'Dominio personalizado', 'Soporte prioritario'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <svg viewBox="0 0 20 20" fill="#38bdf8" className="w-4 h-4 flex-shrink-0">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/registro?plan=pro"
                className="block text-center bg-sky-500 text-white font-bold py-3 rounded-xl hover:bg-sky-400 transition-colors">
                Empezar gratis
              </Link>
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">
            14 días gratis sin tarjeta de crédito. Cancela cuando quieras.
          </p>
        </div>
      </section>

      {/* ── COMPARATIVA ──────────────────────────────────── */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sky-500 text-xs font-bold tracking-widest uppercase mb-3">Comparativa</p>
            <h2 className="text-4xl font-black text-gray-900">¿Por qué Slotly?</h2>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="grid grid-cols-4 text-center text-xs font-bold border-b border-gray-100">
              <div className="p-4 text-left text-gray-400">Característica</div>
              <div className="p-4 bg-sky-50 text-sky-700 border-x border-sky-100">Slotly</div>
              <div className="p-4 text-gray-400">Manual / WhatsApp</div>
              <div className="p-4 text-gray-400">Airbnb Experiences</div>
            </div>
            {COMPARISON.map((row, i) => (
              <div key={row.feature} className={`grid grid-cols-4 text-center text-sm border-b border-gray-50 last:border-0 ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                <div className="p-4 text-left text-gray-700 font-medium text-xs">{row.feature}</div>
                <div className="p-4 bg-sky-50/50 border-x border-sky-100/50">
                  {row.slotly
                    ? <span className="text-green-500 font-bold text-base">✓</span>
                    : <span className="text-gray-300 font-bold">—</span>}
                </div>
                <div className="p-4">
                  {row.manual
                    ? <span className="text-green-500 font-bold text-base">✓</span>
                    : <span className="text-red-400 font-bold text-base">✕</span>}
                </div>
                <div className="p-4">
                  {row.airbnb
                    ? <span className="text-green-500 font-bold text-base">✓</span>
                    : <span className="text-red-400 font-bold text-base">✕</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sky-500 text-xs font-bold tracking-widest uppercase mb-3">FAQ</p>
            <h2 className="text-4xl font-black text-gray-900">Preguntas frecuentes</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: '¿Necesito saber de tecnología?',
                a: 'No. Configuras tu perfil en 10 minutos con un formulario sencillo. Si tienes web propia, añades el widget con una línea de código. Si no, tu página de Slotly es tu web de reservas.',
              },
              {
                q: '¿Cómo llega el dinero de las reservas?',
                a: 'Usamos Stripe Connect. Conectas tu cuenta bancaria una sola vez y el dinero de cada reserva llega directamente a ti en 2 días hábiles. Slotly cobra el 2% de comisión automáticamente en cada transacción.',
              },
              {
                q: '¿Puedo usarlo si ya tengo web propia?',
                a: 'Sí. El widget embebible funciona en cualquier web: WordPress, Wix, Squarespace o cualquier HTML. Copias una línea de código y listo.',
              },
              {
                q: '¿Qué pasa después de los 14 días de prueba?',
                a: 'Te pedimos los datos de tarjeta y sigues con el plan que hayas elegido. Si decides no continuar, simplemente no introduces ningún dato y tu cuenta se desactiva sin cargos.',
              },
              {
                q: '¿Mis clientes pueden reservar en inglés o alemán?',
                a: 'Sí. El widget de reservas está disponible en español, inglés, alemán y francés. Tus clientes ven el idioma automáticamente o pueden cambiarlo.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="border border-gray-100 rounded-2xl p-6 hover:border-sky-100 transition-colors">
                <p className="font-bold text-gray-900 mb-2 text-sm">{q}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────── */}
      <section className="py-24 px-6 bg-gray-950 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-black mb-4">¿Listo para llenar tu agenda?</h2>
          <p className="text-gray-400 mb-8">Únete a los operadores turísticos que ya gestionan sus reservas con Slotly.</p>
          <Link href="/registro"
            className="inline-block bg-sky-500 text-white font-bold px-10 py-4 rounded-2xl text-lg hover:bg-sky-400 transition-colors">
            Empieza gratis 14 días →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="py-8 px-6 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-400">
          © 2026 Slotly ·{' '}
          <Link href="/login" className="hover:text-gray-600">Acceder</Link>
          {' · '}
          <Link href="/registro" className="hover:text-gray-600">Registro</Link>
        </p>
      </footer>
    </div>
  )
}
