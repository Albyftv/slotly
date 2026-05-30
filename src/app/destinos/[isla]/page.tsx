import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createServiceClient } from '@/lib/supabase/server'
import { ISLANDS, ISLAND_SLUGS, type IslandSlug } from '@/lib/islands'
import { CATEGORY_LABELS, CATEGORY_ICONS, type ExperienceCategory } from '@/lib/types'

interface Props {
  params: Promise<{ isla: string }>
  searchParams: Promise<{ categoria?: string }>
}

export async function generateStaticParams() {
  return ISLAND_SLUGS.map(isla => ({ isla }))
}

export async function generateMetadata({ params }: Props) {
  const { isla } = await params
  const island = ISLANDS[isla as IslandSlug]
  if (!island) return { title: 'Destino no encontrado' }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://slotly-zeta.vercel.app'
  return {
    title: `Experiencias en ${island.name} — Surf, Buceo, Excursiones | Slotly`,
    description: `${island.description}. Reserva online surf, buceo, excursiones y más en ${island.name}. Confirmación inmediata, pago seguro.`,
    openGraph: {
      title: `Experiencias en ${island.name}`,
      description: `${island.description}. Reserva online con confirmación inmediata.`,
      url: `${appUrl}/destinos/${isla}`,
      images: [{ url: island.heroImg, width: 1400, height: 800, alt: island.name }],
    },
  }
}

const CATEGORIES: { key: string; label: string; icon: string }[] = [
  { key: 'all', label: 'Todas', icon: '✨' },
  { key: 'water', label: 'Acuático', icon: '🌊' },
  { key: 'land', label: 'Terrestre', icon: '🏔️' },
  { key: 'air', label: 'Aéreo', icon: '🪂' },
  { key: 'culture', label: 'Cultural', icon: '🎭' },
]

export default async function IslaPage({ params, searchParams }: Props) {
  const { isla } = await params
  const { categoria } = await searchParams
  const island = ISLANDS[isla as IslandSlug]
  if (!island) notFound()

  const activeCategory = categoria ?? 'all'
  const supabase = createServiceClient()

  const { data: operators } = await supabase
    .from('operators')
    .select('id, name, slug, city')
    .in('city', island.cities as unknown as string[])

  const operatorIds = (operators ?? []).map(o => o.id)
  const operatorMap = Object.fromEntries((operators ?? []).map(o => [o.id, o]))

  let query = operatorIds.length > 0
    ? supabase
        .from('experiences')
        .select('*')
        .eq('status', 'active')
        .in('operator_id', operatorIds)
        .order('created_at', { ascending: false })
    : null

  if (query && activeCategory !== 'all') {
    query = query.eq('category', activeCategory)
  }

  const { data: experiences } = query ? await query : { data: [] }
  const list = experiences ?? []

  // Stats
  const allExps = operatorIds.length > 0
    ? (await supabase.from('experiences').select('category').eq('status', 'active').in('operator_id', operatorIds)).data ?? []
    : []
  const categoryCount = allExps.reduce((acc: Record<string, number>, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + 1
    return acc
  }, {})

  const durationFmt = (min: number) => {
    const h = Math.floor(min / 60)
    const m = min % 60
    return h > 0 ? `${h}h${m > 0 ? `${m}m` : ''}` : `${m}min`
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tight text-gray-900">
            slot<span className="text-sky-500">ly</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/precios" className="text-sm text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">Precios</Link>
            <Link href="/registro" className="bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors">
              Añade tu negocio
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative h-80 sm:h-[420px] pt-16">
        <Image
          src={island.heroImg}
          alt={island.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-3">
            <Link href="/" className="text-white/60 text-xs hover:text-white transition-colors">Inicio</Link>
            <span className="text-white/40 text-xs">/</span>
            <span className="text-white/80 text-xs">{island.name}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-2">
            {island.emoji} {island.name}
          </h1>
          <p className="text-white/80 text-lg mb-4">{island.description}</p>
          {/* Quick stats */}
          <div className="flex flex-wrap gap-3">
            <span className="bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              🏢 {(operators ?? []).length} operadores
            </span>
            <span className="bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              🎯 {allExps.length} experiencias
            </span>
            {Object.entries(categoryCount).slice(0, 2).map(([cat, cnt]) => (
              <span key={cat} className="bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                {CATEGORY_ICONS[cat as ExperienceCategory]} {cnt} {CATEGORY_LABELS[cat as ExperienceCategory]?.toLowerCase()}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">

        {allExps.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center">
            <div className="text-6xl mb-4">{island.emoji}</div>
            <h2 className="text-2xl font-black text-gray-900 mb-3">Pronto en {island.name}</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Estamos incorporando operadores en esta isla. Si tienes un negocio de actividades, únete gratis.
            </p>
            <Link href="/registro"
              className="inline-flex items-center gap-2 bg-sky-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-sky-400 transition-colors">
              Añade tu negocio gratis →
            </Link>
          </div>
        ) : (
          <>
            {/* Category filters */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-1 -mx-1 px-1">
              {CATEGORIES.map(cat => {
                const count = cat.key === 'all' ? allExps.length : (categoryCount[cat.key] ?? 0)
                if (cat.key !== 'all' && count === 0) return null
                const active = activeCategory === cat.key
                return (
                  <Link
                    key={cat.key}
                    href={cat.key === 'all' ? `/destinos/${isla}` : `/destinos/${isla}?categoria=${cat.key}`}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors flex-shrink-0 ${
                      active
                        ? 'bg-gray-900 text-white'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    {cat.label}
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                      active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>{count}</span>
                  </Link>
                )
              })}
            </div>

            {/* Results count */}
            <p className="text-sm text-gray-400 mb-6">
              <span className="font-bold text-gray-700">{list.length}</span> experiencia{list.length !== 1 ? 's' : ''}
              {activeCategory !== 'all' && ` · ${CATEGORY_LABELS[activeCategory as ExperienceCategory]}`}
            </p>

            {list.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <p className="text-3xl mb-3">{CATEGORY_ICONS[activeCategory as ExperienceCategory]}</p>
                <p className="text-gray-500">No hay experiencias en esta categoría aún.</p>
                <Link href={`/destinos/${isla}`} className="text-sky-500 text-sm font-semibold hover:underline mt-2 inline-block">
                  Ver todas →
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {list.map(exp => {
                  const op = operatorMap[exp.operator_id]
                  return (
                    <Link
                      key={exp.id}
                      href={op ? `/${op.slug}/${exp.slug}` : '#'}
                      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                      {/* Cover */}
                      <div className="relative h-48">
                        {exp.cover_url ? (
                          <Image
                            src={exp.cover_url}
                            alt={exp.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            unoptimized
                          />
                        ) : (
                          <div className="h-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-5xl">
                            {CATEGORY_ICONS[exp.category as ExperienceCategory]}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-2.5 py-1 rounded-full text-gray-700">
                          {CATEGORY_ICONS[exp.category as ExperienceCategory]} {CATEGORY_LABELS[exp.category as ExperienceCategory]}
                        </span>
                        <span className="absolute bottom-3 right-3 bg-white text-gray-900 text-sm font-black px-3 py-1 rounded-xl shadow-sm">
                          {exp.price}€<span className="text-xs font-normal text-gray-400">/p</span>
                        </span>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <p className="font-black text-gray-900 leading-tight mb-0.5">{exp.name}</p>
                        {op && (
                          <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 flex-shrink-0">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                            </svg>
                            {op.name} · {op.city}
                          </p>
                        )}
                        {exp.description && (
                          <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{exp.description}</p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span className="bg-gray-100 px-2 py-0.5 rounded-full">⏱ {durationFmt(exp.duration_min)}</span>
                          <span className="bg-gray-100 px-2 py-0.5 rounded-full">👥 máx {exp.max_capacity}</span>
                          {exp.difficulty && exp.difficulty !== 'all' && (
                            <span className="bg-gray-100 px-2 py-0.5 rounded-full capitalize">{exp.difficulty}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </>
        )}

        {/* SEO content block */}
        {allExps.length > 0 && (
          <div className="mt-16 bg-white rounded-3xl border border-gray-100 p-8 sm:p-10">
            <h2 className="text-2xl font-black text-gray-900 mb-4">
              Actividades y experiencias en {island.name}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              {island.name} es uno de los destinos más populares de Canarias para el turismo activo.
              {categoryCount['water'] ? ` Con ${categoryCount['water']} actividades acuáticas disponibles, puedes practicar surf, kitesurf, buceo y más directamente desde la playa.` : ''}
              {categoryCount['land'] ? ` Si prefieres la montaña, hay ${categoryCount['land']} experiencias terrestres que te llevarán por los paisajes más espectaculares de la isla.` : ''}
              {' '}Todos los operadores ofrecen reserva online con pago seguro y confirmación inmediata.
            </p>
            <div className="flex flex-wrap gap-2">
              {island.cities.slice(0, 6).map(city => (
                <span key={city} className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                  📍 {city}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA operadores */}
        <div className="mt-8 bg-gray-900 rounded-3xl p-10 text-center text-white">
          <p className="text-sky-400 text-xs font-bold tracking-widest uppercase mb-3">
            ¿Tienes un negocio en {island.name}?
          </p>
          <h2 className="text-3xl font-black mb-3">Aparece aquí gratis</h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto text-sm">
            Crea tu perfil en 10 minutos y empieza a recibir reservas online con pago integrado.
          </p>
          <Link href="/registro"
            className="inline-flex items-center gap-2 bg-sky-500 text-white font-bold px-8 py-4 rounded-2xl hover:bg-sky-400 transition-colors">
            Prueba gratis 14 días →
          </Link>
        </div>
      </div>
    </div>
  )
}
