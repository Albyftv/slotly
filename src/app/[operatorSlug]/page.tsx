import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import type { Operator, Experience } from '@/lib/types'
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/lib/types'

export const revalidate = 60

interface Props {
  params: Promise<{ operatorSlug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { operatorSlug } = await params
  const supabase = createServiceClient()
  const { data: op } = await supabase
    .from('operators')
    .select('name, city')
    .eq('slug', operatorSlug)
    .single()
  if (!op) return { title: 'Operador no encontrado' }
  return {
    title: `${op.name}${op.city ? ` · ${op.city}` : ''} — Reserva online`,
    description: `Reserva tus experiencias con ${op.name}. Pago online seguro, confirmación inmediata.`,
  }
}

export default async function OperatorPublicPage({ params }: Props) {
  const { operatorSlug } = await params
  const supabase = createServiceClient()

  const { data: operator } = await supabase
    .from('operators')
    .select('*')
    .eq('slug', operatorSlug)
    .single()

  if (!operator) notFound()

  const { data: experiences } = await supabase
    .from('experiences')
    .select('*')
    .eq('operator_id', operator.id)
    .eq('status', 'active')
    .order('created_at', { ascending: true })

  const op = operator as Operator
  const exps = (experiences ?? []) as Experience[]

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Header del operador */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-black text-2xl flex-shrink-0">
              {op.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">{op.name}</h1>
              {op.city && (
                <p className="text-gray-500 text-sm flex items-center gap-1 mt-0.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {op.city}
                </p>
              )}
            </div>
            {op.phone && (
              <div className="ml-auto flex gap-2">
                {op.whatsapp && (
                  <a href={`https://wa.me/${op.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener"
                    className="flex items-center gap-2 bg-green-500 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-green-600 transition-colors">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.523 5.848L.057 23.625a.563.563 0 0 0 .693.693l5.772-1.466A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.796 9.796 0 0 1-5.001-1.367l-.358-.213-3.427.871.887-3.34-.234-.374A9.77 9.77 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                    </svg>
                    WhatsApp
                  </a>
                )}
                {op.phone && !op.whatsapp && (
                  <a href={`tel:${op.phone}`}
                    className="flex items-center gap-2 border border-gray-200 text-gray-700 text-sm font-bold px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.37a16 16 0 0 0 6 6l1.27-.93a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    Llamar
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Experiencias */}
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8">
        {exps.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🏄</p>
            <p className="text-gray-500">Próximamente nuevas experiencias.</p>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-black text-gray-900 mb-5">
              {exps.length === 1 ? '1 experiencia disponible' : `${exps.length} experiencias disponibles`}
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {exps.map(exp => {
                const durationHours = Math.floor(exp.duration_min / 60)
                const durationMins = exp.duration_min % 60
                const durationLabel = durationHours > 0
                  ? `${durationHours}h${durationMins > 0 ? ` ${durationMins}min` : ''}`
                  : `${durationMins}min`

                return (
                  <Link key={exp.id} href={`/${operatorSlug}/${exp.slug}`}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                    {/* Cover */}
                    <div className="relative h-48">
                      {exp.cover_url ? (
                        <Image src={exp.cover_url} alt={exp.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 100vw, 50vw" />
                      ) : (
                        <div className="h-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-5xl">
                          {CATEGORY_ICONS[exp.category]}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-bold px-2.5 py-1 rounded-full">
                        {CATEGORY_ICONS[exp.category]} {CATEGORY_LABELS[exp.category]}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-black text-gray-900 mb-1 leading-tight">{exp.name}</h3>
                      {exp.location && (
                        <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 flex-shrink-0">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                          </svg>
                          {exp.location}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="bg-gray-100 px-2 py-0.5 rounded-full">⏱ {durationLabel}</span>
                          <span className="bg-gray-100 px-2 py-0.5 rounded-full">👥 máx {exp.max_capacity}</span>
                        </div>
                        <p className="text-lg font-black text-gray-900">
                          {exp.price}€<span className="text-xs font-normal text-gray-400">/p</span>
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </div>

      <footer className="mt-8 py-6 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-300">
          Reservas gestionadas con <a href="/" className="hover:text-gray-500">slotly.es</a>
        </p>
      </footer>
    </div>
  )
}
