import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createServiceClient } from '@/lib/supabase/server'
import { ISLANDS, ISLAND_SLUGS, type IslandSlug } from '@/lib/islands'
import { CATEGORY_LABELS, CATEGORY_ICONS, type ExperienceCategory } from '@/lib/types'

interface Props {
  params: Promise<{ isla: string }>
}

export async function generateStaticParams() {
  return ISLAND_SLUGS.map(isla => ({ isla }))
}

export async function generateMetadata({ params }: Props) {
  const { isla } = await params
  const island = ISLANDS[isla as IslandSlug]
  if (!island) return { title: 'Destino no encontrado' }
  return {
    title: `Experiencias en ${island.name} — Slotly`,
    description: `${island.description}. Reserva online surf, buceo, excursiones y más en ${island.name}.`,
  }
}

export default async function IslaPage({ params }: Props) {
  const { isla } = await params
  const island = ISLANDS[isla as IslandSlug]
  if (!island) notFound()

  const supabase = createServiceClient()

  // Step 1: get operator IDs in this island
  const { data: operators } = await supabase
    .from('operators')
    .select('id, name, slug, city')
    .in('city', island.cities as unknown as string[])

  const operatorIds = (operators ?? []).map(o => o.id)
  const operatorMap = Object.fromEntries((operators ?? []).map(o => [o.id, o]))

  // Step 2: get active experiences for those operators
  const { data: experiences } = operatorIds.length > 0
    ? await supabase
        .from('experiences')
        .select('*')
        .eq('status', 'active')
        .in('operator_id', operatorIds)
        .order('created_at', { ascending: false })
    : { data: [] }

  const list = experiences ?? []

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tight text-gray-900">
            slot<span className="text-sky-500">ly</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/operadores" className="text-sm text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">
              Para operadores
            </Link>
            <Link href="/registro" className="bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors">
              Añade tu negocio
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative h-72 sm:h-96 pt-16">
        <Image
          src={island.heroImg}
          alt={island.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Link href="/" className="text-white/60 text-sm hover:text-white transition-colors">Inicio</Link>
            <span className="text-white/40 text-sm">/</span>
            <span className="text-white/80 text-sm">{island.name}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white">
            {island.emoji} {island.name}
          </h1>
          <p className="text-white/80 mt-2 text-lg">{island.description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">

        {list.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center">
            <div className="text-6xl mb-4">{island.emoji}</div>
            <h2 className="text-2xl font-black text-gray-900 mb-3">
              Pronto en {island.name}
            </h2>
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
            <div className="flex items-center justify-between mb-8">
              <p className="text-gray-500 text-sm">
                <span className="font-bold text-gray-900">{list.length}</span> experiencia{list.length !== 1 ? 's' : ''} disponible{list.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.map(exp => {
                const op = operatorMap[exp.operator_id]
                return (
                  <Link
                    key={exp.id}
                    href={op ? `/${op.slug}/${exp.slug}` : '#'}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    <div className="relative h-48">
                      {exp.cover_url ? (
                        <Image src={exp.cover_url} alt={exp.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" unoptimized />
                      ) : (
                        <div className="h-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-5xl">
                          {CATEGORY_ICONS[exp.category as ExperienceCategory]}
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur-sm text-xs font-bold px-2.5 py-1 rounded-full text-gray-700">
                          {CATEGORY_LABELS[exp.category as ExperienceCategory]}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="font-black text-gray-900">{exp.name}</p>
                      {op && (
                        <p className="text-xs text-gray-400 mt-0.5">{op.name} · {op.city}</p>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <div className="text-xs text-gray-400">{exp.duration_min} min · máx {exp.max_capacity} personas</div>
                        <p className="text-lg font-black text-sky-600">{exp.price}€</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )}

        {/* CTA operadores */}
        <div className="mt-16 bg-gray-900 rounded-3xl p-10 text-center text-white">
          <p className="text-sky-400 text-xs font-bold tracking-widest uppercase mb-3">¿Tienes un negocio en {island.name}?</p>
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
