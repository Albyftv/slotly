import Link from 'next/link'
import Image from 'next/image'
import RevenueCalculator from './RevenueCalculator'

export const metadata = {
  title: 'Slotly para operadores · Reservas y pagos online en Canarias',
  description: 'Gestiona reservas, cobra online y automatiza confirmaciones. Dashboard profesional para escuelas de surf, rutas, diving y más. 14 días gratis.',
}

export default function OperadoresPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-white/10 h-16 flex items-center justify-between px-6">
        <Link href="/" className="text-xl font-black tracking-tight text-white">
          slot<span className="text-sky-400">ly</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">
            Acceder
          </Link>
          <Link href="/registro"
            className="bg-sky-500 text-white text-sm font-black px-4 py-2 rounded-xl hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/30">
            Empieza gratis →
          </Link>
        </div>
      </nav>

      {/* ── HERO */}
      <section className="relative pt-16 min-h-screen bg-slate-900 overflow-hidden flex flex-col">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-sky-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-start px-6 pt-20 pb-8">
          <span className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold px-4 py-2 rounded-full mb-8 tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            Para operadores turísticos · Islas Canarias
          </span>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white text-center leading-none mb-6 max-w-4xl">
            Tu negocio de<br />
            <span className="text-sky-400">experiencias,</span><br />
            siempre abierto
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl text-center max-w-2xl mb-10 leading-relaxed">
            Reservas online 24/7, cobros automáticos y dashboard profesional. Sin WhatsApps, sin llamadas, sin no-shows.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-16">
            <Link href="/registro"
              className="bg-sky-500 text-white font-black px-8 py-4 rounded-2xl text-lg hover:bg-sky-400 transition-all shadow-2xl shadow-sky-500/40 hover:shadow-sky-500/60 hover:-translate-y-0.5">
              Empieza 14 días gratis →
            </Link>
            <a href="https://slotly-zeta.vercel.app/fuerteventura-adventures/clase-surf-corralejo"
              target="_blank" rel="noopener"
              className="bg-white/10 border border-white/20 text-white font-bold px-8 py-4 rounded-2xl text-lg hover:bg-white/15 transition-all backdrop-blur-sm">
              Ver demo en vivo ↗
            </a>
          </div>

          {/* ── DASHBOARD MOCKUP */}
          <div className="w-full max-w-5xl">
            {/* Browser chrome */}
            <div className="bg-slate-800 rounded-t-2xl border border-white/10 px-4 py-3 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="flex-1 bg-slate-700 rounded-lg px-3 py-1 text-xs text-slate-400 font-mono">
                slotly.es/dashboard
              </div>
            </div>

            {/* Dashboard interior */}
            <div className="bg-slate-100 border border-white/5 border-t-0 rounded-b-2xl overflow-hidden flex" style={{ height: '440px' }}>
              {/* Sidebar */}
              <div className="w-52 bg-white border-r border-gray-100 flex flex-col p-3 flex-shrink-0">
                <div className="flex items-center gap-2 px-2 py-3 mb-4">
                  <div className="w-7 h-7 bg-sky-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-black">S</span>
                  </div>
                  <span className="font-black text-sm text-gray-900">slot<span className="text-sky-500">ly</span></span>
                </div>
                {[
                  { icon: '▦', label: 'Panel', active: true },
                  { icon: '📅', label: 'Reservas', active: false },
                  { icon: '🌊', label: 'Experiencias', active: false },
                  { icon: '📊', label: 'Analytics', active: false },
                  { icon: '👤', label: 'Mi perfil', active: false },
                ].map(item => (
                  <div key={item.label}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-0.5 text-sm ${item.active ? 'bg-sky-50 text-sky-600 font-bold' : 'text-gray-500'}`}>
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </div>
                ))}
                <div className="mt-auto p-2">
                  <div className="bg-sky-50 border border-sky-100 rounded-xl p-3">
                    <p className="text-xs font-bold text-sky-700 mb-1">Plan Basic</p>
                    <div className="h-1.5 bg-sky-100 rounded-full">
                      <div className="h-1.5 bg-sky-500 rounded-full" style={{ width: '40%' }} />
                    </div>
                    <p className="text-xs text-sky-500 mt-1">1 de 3 exp. activas</p>
                  </div>
                </div>
              </div>

              {/* Main content */}
              <div className="flex-1 overflow-hidden p-5 bg-gray-50">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs text-gray-400">Buenos días</p>
                    <h2 className="text-lg font-black text-gray-900">Fuerteventura Adventures</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center text-white text-xs font-black">FA</div>
                  </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-4 gap-3 mb-5">
                  {[
                    { label: 'Ingresos este mes', value: '1.240€', sub: '+18% vs anterior', up: true },
                    { label: 'Reservas totales', value: '24', sub: '3 esta semana', up: true },
                    { label: 'Ticket medio', value: '51,67€', sub: 'por reserva', up: false },
                    { label: 'Próxima reserva', value: 'Hoy', sub: '10:00 · 4 personas', up: true },
                  ].map(k => (
                    <div key={k.label} className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                      <p className="text-xs text-gray-400 mb-1">{k.label}</p>
                      <p className="text-xl font-black text-gray-900">{k.value}</p>
                      <p className={`text-xs mt-0.5 font-medium ${k.up ? 'text-emerald-500' : 'text-gray-400'}`}>{k.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Chart + Bookings */}
                <div className="grid grid-cols-5 gap-3">
                  {/* Mini bar chart */}
                  <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                    <p className="text-xs font-bold text-gray-700 mb-3">Ingresos 6 meses</p>
                    <div className="flex items-end gap-1.5 h-24">
                      {[480, 620, 390, 810, 960, 1240].map((v, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className={`w-full rounded-t-md ${i === 5 ? 'bg-sky-500' : 'bg-gray-200'}`}
                            style={{ height: `${(v / 1240) * 100}%` }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-1">
                      {['D', 'E', 'F', 'M', 'A', 'M'].map(m => (
                        <span key={m} className="text-xs text-gray-300 flex-1 text-center">{m}</span>
                      ))}
                    </div>
                  </div>

                  {/* Recent bookings */}
                  <div className="col-span-3 bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                    <p className="text-xs font-bold text-gray-700 mb-3">Últimas reservas</p>
                    <div className="space-y-2">
                      {[
                        { name: 'Klaus Müller', exp: 'Clase de Surf', date: 'Hoy 10:00', amount: '135€', status: 'confirmed' },
                        { name: 'Sophie Martin', exp: 'Ruta en Quad', date: 'Mañana 09:00', amount: '90€', status: 'confirmed' },
                        { name: 'Juan García', exp: 'Clase de Surf', date: '2 jun · 14:00', amount: '45€', status: 'pending' },
                      ].map(b => (
                        <div key={b.name} className="flex items-center gap-3 py-1.5 border-b border-gray-50 last:border-0">
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                            {b.name[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-800 truncate">{b.name}</p>
                            <p className="text-xs text-gray-400 truncate">{b.exp} · {b.date}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs font-black text-gray-900">{b.amount}</p>
                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                              {b.status === 'confirmed' ? '✓' : '⏳'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-slate-500 text-sm mt-4">Tu panel de control en tiempo real</p>
        </div>
      </section>

      {/* ── PAIN */}
      <section className="py-20 px-6 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sky-400 text-xs font-bold tracking-widest uppercase mb-4">La realidad del sector</p>
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            ¿Cuántas reservas pierdes<br />mientras duermes?
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-12">
            Un turista alemán planifica su viaje a las 11 de la noche. Encuentra tu Instagram, le encanta lo que haces. Solo ve un número de WhatsApp. Al día siguiente, ya reservó con otro.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { n: '73%', label: 'de los turistas prefieren reservar online antes de llegar a destino' },
              { n: '11pm', label: 'hora más frecuente de búsqueda de experiencias turísticas' },
              { n: '0€', label: 'cobras por una reserva perdida por no tener sistema online' },
            ].map(s => (
              <div key={s.n} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <p className="text-5xl font-black text-sky-400 mb-3">{s.n}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sky-500 text-xs font-bold tracking-widest uppercase mb-3">Sin complicaciones</p>
            <h2 className="text-4xl font-black text-gray-900">Listo en 30 minutos</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Crea tu cuenta',
                desc: 'Regístrate con tu email. Añade el nombre de tu negocio, conecta tu cuenta bancaria con Stripe y ya puedes cobrar.',
                color: 'sky',
                detail: '~5 minutos',
              },
              {
                step: '02',
                title: 'Sube tu experiencia',
                desc: 'Nombre, fotos, precio, horarios disponibles y cuántas personas acepta. Aparece en tu página pública al instante.',
                color: 'violet',
                detail: '~15 minutos',
              },
              {
                step: '03',
                title: 'Comparte y cobra',
                desc: 'Pega el link en tu Instagram, Google My Business o WhatsApp. Los clientes reservan y pagan solos. Tú recibes un WhatsApp de confirmación.',
                color: 'emerald',
                detail: '∞ para siempre',
              },
            ].map(item => (
              <div key={item.step} className="relative">
                <div className="text-7xl font-black text-gray-50 mb-4 leading-none">{item.step}</div>
                <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full mb-3 ${
                  item.color === 'sky' ? 'bg-sky-50 text-sky-600' :
                  item.color === 'violet' ? 'bg-violet-50 text-violet-600' :
                  'bg-emerald-50 text-emerald-600'
                }`}>
                  ⏱ {item.detail}
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOOKING PAGE MOCKUP */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sky-500 text-xs font-bold tracking-widest uppercase mb-3">Lo que ve tu cliente</p>
            <h2 className="text-4xl font-black text-gray-900">Tu página de reservas profesional</h2>
            <p className="text-gray-500 mt-3">Lista en minutos, sin código, con tu imagen de marca</p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-2xl">
            {/* Browser bar */}
            <div className="bg-gray-100 px-4 py-3 flex items-center gap-3 border-b border-gray-200">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-white rounded-lg px-3 py-1 text-xs text-gray-400 font-mono text-center max-w-xs mx-auto">
                slotly.es/tu-escuela/clase-surf
              </div>
            </div>

            <div className="p-6 sm:p-10 grid sm:grid-cols-2 gap-8">
              {/* Left: experience info */}
              <div>
                <div className="h-52 rounded-2xl relative overflow-hidden mb-6 shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80"
                    alt="Clase de surf"
                    fill
                    className="object-cover"
                    sizes="500px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3 bg-sky-500 text-white text-sm font-black px-3 py-1 rounded-full shadow-lg">
                    45€/persona
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="flex gap-2 mb-2">
                      <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full">⏱ 2 horas</span>
                      <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full">👥 Máx 8</span>
                      <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full">🌊 Principiante</span>
                    </div>
                    <p className="text-white font-black text-2xl">Clase de Surf</p>
                    <p className="text-white/70 text-sm">📍 Corralejo, Fuerteventura</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {['✅ Tabla incluida', '✅ Neopreno', '✅ Instructor certificado', '✅ Seguro incluido'].map(i => (
                    <div key={i} className="text-sm text-gray-600 bg-gray-50 rounded-xl px-3 py-2">{i}</div>
                  ))}
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Aprende a surfear con nuestros instructores certificados en las mejores olas de Fuerteventura. Apto para todos los niveles, desde cero.
                </p>
              </div>

              {/* Right: booking widget */}
              <div>
                <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm p-6">
                  <div className="flex items-end gap-1 mb-6">
                    <span className="text-4xl font-black text-gray-900">45€</span>
                    <span className="text-gray-400 mb-1 text-sm">/persona</span>
                  </div>

                  <p className="text-xs font-bold text-gray-400 mb-3 tracking-widest uppercase">Elige fecha</p>
                  <div className="mb-4">
                    <p className="text-xs font-bold text-gray-500 mb-2">JUNIO 2026</p>
                    <div className="grid grid-cols-7 gap-1">
                      {['L','M','X','J','V','S','D'].map(d => (
                        <div key={d} className="text-center text-xs text-gray-300 font-bold py-1">{d}</div>
                      ))}
                      {[null,1,2,3,4,5,6,7,8,9,10,11,12,13,14].map((d, i) => (
                        <div key={i} className={`aspect-square rounded-lg flex items-center justify-center text-xs font-semibold transition-colors ${
                          d === 7 ? 'bg-sky-500 text-white shadow-md shadow-sky-200' :
                          d && [2,3,4,7,8,9,10,12,13,14].includes(d) ? 'hover:bg-sky-50 text-gray-700 cursor-pointer' :
                          d ? 'text-gray-300' : ''
                        }`}>{d}</div>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs font-bold text-gray-400 mb-2 tracking-widest uppercase">Horario</p>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {['09:00', '11:00', '14:00'].map((t, i) => (
                      <div key={t} className={`text-center py-2 rounded-xl text-sm font-bold border-2 cursor-pointer transition-all ${i === 0 ? 'border-sky-500 bg-sky-500 text-white shadow-md shadow-sky-200' : 'border-gray-200 text-gray-600 hover:border-sky-200'}`}>{t}</div>
                    ))}
                  </div>

                  <p className="text-xs font-bold text-gray-400 mb-2 tracking-widest uppercase">Personas</p>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-600 font-bold cursor-pointer">−</div>
                    <span className="text-xl font-black text-gray-900 w-6 text-center">3</span>
                    <div className="w-9 h-9 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-600 font-bold cursor-pointer">+</div>
                    <span className="text-gray-400 text-sm ml-2">× 45€</span>
                  </div>

                  <div className="bg-sky-500 text-white font-black py-4 rounded-2xl text-center text-lg shadow-xl shadow-sky-200 cursor-pointer hover:bg-sky-400 transition-colors">
                    Reservar · 135,00€
                  </div>
                  <p className="text-center text-xs text-gray-400 mt-3">🔒 Pago seguro · Stripe · PCI-DSS</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── REVENUE CALCULATOR */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-sky-500 text-xs font-bold tracking-widest uppercase mb-3">Calcula tu potencial</p>
          <h2 className="text-4xl font-black text-gray-900">¿Cuánto puedes ganar?</h2>
          <p className="text-gray-500 mt-3">Mueve los sliders y descubre tu facturación estimada</p>
        </div>
        <RevenueCalculator />
      </section>

      {/* ── FEATURES */}
      <section className="py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sky-400 text-xs font-bold tracking-widest uppercase mb-3">Todo incluido</p>
            <h2 className="text-4xl font-black">Todo lo que necesitas para vender</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: '📅', title: 'Calendario inteligente', desc: 'Configura disponibilidad por días y horarios. El cliente solo ve fechas reales, sin errores.' },
              { icon: '💳', title: 'Cobro online garantizado', desc: 'Pago con tarjeta antes de la actividad. Sin no-shows. El dinero llega directo a tu cuenta.' },
              { icon: '📧', title: 'Confirmaciones automáticas', desc: 'El cliente recibe email con todos los detalles. Tú recibes WhatsApp al instante. Sin hacer nada.' },
              { icon: '📊', title: 'Dashboard en tiempo real', desc: 'Todas tus reservas, ingresos y analytics en un panel limpio y rápido. Desde el móvil.' },
              { icon: '🌍', title: 'Multiidioma incluido', desc: 'Español, inglés, alemán y francés. Llega al turista europeo que nunca te hubiera encontrado.' },
              { icon: '🔗', title: 'Widget embebible', desc: 'Añade el formulario de reservas a tu web existente con una línea de código. Compatible con todo.' },
              { icon: '📵', title: 'Fechas bloqueadas', desc: 'Bloquea días por vacaciones, eventos o mantenimiento. El calendario se actualiza solo.' },
              { icon: '💰', title: '98% para ti', desc: 'Solo cobramos el 2% de cada reserva completada. Sin costes ocultos, sin sorpresas.' },
              { icon: '📱', title: 'WhatsApp al instante', desc: 'Recibe notificación en WhatsApp con los datos del cliente cada vez que alguien reserva.' },
            ].map(f => (
              <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-sky-500/30 transition-all">
                <span className="text-3xl mb-3 block">{f.icon}</span>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <p className="text-sky-500 text-xs font-bold tracking-widest uppercase mb-3">Sin sorpresas</p>
          <h2 className="text-4xl font-black text-gray-900">Precio simple y justo</h2>
          <p className="text-gray-500 mt-3">Pagas solo cuando funciona. Sin permanencia.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Basic */}
          <div className="border-2 border-gray-200 rounded-3xl p-8">
            <p className="text-sm font-black text-gray-400 mb-1 tracking-widest uppercase">Basic</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-5xl font-black text-gray-900">19€</span>
              <span className="text-gray-400 mb-2">/mes</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">+ 2% por reserva completada</p>
            <ul className="space-y-3 mb-8">
              {[
                'Hasta 3 experiencias activas',
                'Página de reservas ilimitada',
                'Cobros online con Stripe',
                'Emails y WhatsApp automáticos',
                'Dashboard de gestión',
                'Soporte por WhatsApp',
              ].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                  <svg viewBox="0 0 20 20" fill="#0ea5e9" className="w-5 h-5 flex-shrink-0">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/registro"
              className="block w-full bg-gray-900 text-white font-black py-4 rounded-2xl text-center hover:bg-gray-700 transition-colors">
              Empezar 14 días gratis →
            </Link>
          </div>

          {/* Pro */}
          <div className="border-2 border-sky-500 rounded-3xl p-8 relative shadow-2xl shadow-sky-100">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sky-500 text-white text-xs font-black px-4 py-1 rounded-full">
              MÁS POPULAR
            </div>
            <p className="text-sm font-black text-sky-500 mb-1 tracking-widest uppercase">Pro</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-5xl font-black text-gray-900">39€</span>
              <span className="text-gray-400 mb-2">/mes</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">+ 2% por reserva completada</p>
            <ul className="space-y-3 mb-8">
              {[
                'Experiencias ilimitadas',
                'Todo lo del plan Basic',
                'Analytics avanzados',
                'Widget embebible en tu web',
                'Dominio personalizado',
                'Soporte prioritario',
              ].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                  <svg viewBox="0 0 20 20" fill="#0ea5e9" className="w-5 h-5 flex-shrink-0">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/registro"
              className="block w-full bg-sky-500 text-white font-black py-4 rounded-2xl text-center hover:bg-sky-400 transition-colors shadow-lg shadow-sky-200">
              Empezar 14 días gratis →
            </Link>
          </div>
        </div>

        <p className="text-center text-gray-400 text-sm mt-8">Sin tarjeta de crédito · Sin permanencia · Cancela cuando quieras</p>
      </section>

      {/* ── FAQ */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-black text-gray-900 text-center mb-12">Preguntas frecuentes</h2>
          <div className="space-y-6">
            {[
              {
                q: '¿Necesito saber de tecnología?',
                a: 'No. El proceso es: creas una cuenta, rellenas los datos de tu experiencia (nombre, precio, horarios, fotos) y obtienes un link listo para compartir. Sin código, sin técnicos.',
              },
              {
                q: '¿Cómo recibo el dinero?',
                a: 'Conectas tu cuenta bancaria española a través de Stripe en menos de 10 minutos. Cada reserva confirmada ingresa directamente en tu cuenta el 98% del importe. El 2% es la comisión de Slotly.',
              },
              {
                q: '¿Puedo usarlo junto a GetYourGuide o Airbnb?',
                a: 'Sí, son complementarios. Slotly es para tus clientes directos — los que llegan por Instagram, Google, tu web o boca a boca. Sin comisiones del 20-30%.',
              },
              {
                q: '¿Qué pasa si el cliente cancela?',
                a: 'Gestionas tú la política de cancelación. Stripe permite hacer devoluciones desde el dashboard con un clic. Te avisamos por email y WhatsApp de cada cancelación.',
              },
              {
                q: '¿Y si no me convence?',
                a: 'Tienes 14 días completamente gratis para probarlo con tus propios clientes. Sin tarjeta de crédito. Si no ves el valor, no pagas nada y no pierdes nada.',
              },
            ].map(item => (
              <div key={item.q} className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA */}
      <section className="py-24 px-6 bg-slate-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-sky-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-2xl mx-auto">
          <p className="text-sky-400 text-xs font-bold tracking-widest uppercase mb-4">Empieza hoy</p>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            La próxima reserva que no<br />pierdas ya paga el mes
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            En 30 minutos tienes tu página de reservas funcionando.
          </p>
          <Link href="/registro"
            className="inline-block bg-sky-500 text-white font-black px-12 py-5 rounded-2xl text-xl hover:bg-sky-400 transition-all shadow-2xl shadow-sky-500/40 hover:-translate-y-0.5">
            Crear mi cuenta gratis →
          </Link>
          <p className="text-slate-500 text-sm mt-5">14 días gratis · Sin tarjeta · Cancela cuando quieras</p>
        </div>
      </section>

      {/* ── FOOTER */}
      <footer className="py-8 px-6 bg-slate-900 border-t border-white/10 text-center">
        <div className="flex items-center justify-center gap-6 mb-4">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Inicio</Link>
          <Link href="/precios" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Precios</Link>
          <Link href="/login" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Acceder</Link>
          <Link href="/registro" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Registro</Link>
        </div>
        <p className="text-xs text-slate-600">© 2026 Slotly · Reservas online para experiencias turísticas en Canarias</p>
      </footer>

    </div>
  )
}
