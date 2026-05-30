import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import type { Operator, Experience } from '@/lib/types'
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/lib/types'
import { getT } from '@/lib/i18n'
import type { Lang } from '@/lib/i18n'

export const revalidate = 60

interface Props {
  params: Promise<{ operatorSlug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { operatorSlug } = await params
  const supabase = createServiceClient()
  const { data: op } = await supabase
    .from('operators')
    .select('name, city, description, cover_url, logo_url')
    .eq('slug', operatorSlug)
    .single()
  if (!op) return { title: 'Operador no encontrado' }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://slotly-zeta.vercel.app'
  const pageUrl = `${appUrl}/${operatorSlug}`
  const title = `${op.name}${op.city ? ` · ${op.city}` : ''} — Reserva online`
  const description = op.description ?? `Reserva tus experiencias con ${op.name}. Pago online seguro, confirmación inmediata.`
  const image = op.cover_url ?? op.logo_url ?? undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: 'website',
      images: image ? [{ url: image, width: 1200, height: 630, alt: op.name }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
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
  const lang = (exps[0]?.languages?.[0] as Lang) ?? 'es'
  const t = getT(lang)

  const primaryColor = op.primary_color ?? '#0ea5e9'

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* HERO */}
      <div className="relative">
        {/* Cover image or gradient */}
        <div className="h-52 sm:h-64 w-full relative overflow-hidden">
          {op.cover_url ? (
            <Image
              src={op.cover_url}
              alt={op.name}
              fill
              unoptimized
              className="object-cover"
              priority
            />
          ) : (
            <div
              className="h-full w-full"
              style={{ background: `linear-gradient(135deg, ${primaryColor}cc, ${primaryColor}66)` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Profile card overlay */}
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="relative -mt-12 flex items-end gap-4">
            {/* Logo / Avatar */}
            <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-white">
              {op.logo_url ? (
                <Image
                  src={op.logo_url}
                  alt={op.name}
                  width={96}
                  height={96}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center font-black text-3xl text-white"
                  style={{ background: primaryColor }}
                >
                  {op.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Contact buttons — right side */}
            <div className="ml-auto flex gap-2 pb-1">
              {op.whatsapp && (
                <a
                  href={`https://wa.me/${op.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-2 bg-green-500 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-green-600 transition-colors shadow-sm"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.523 5.848L.057 23.625a.563.563 0 0 0 .693.693l5.772-1.466A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.796 9.796 0 0 1-5.001-1.367l-.358-.213-3.427.871.887-3.34-.234-.374A9.77 9.77 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                  </svg>
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
              )}
              {op.phone && !op.whatsapp && (
                <a
                  href={`tel:${op.phone}`}
                  className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-bold px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.37a16 16 0 0 0 6 6l1.27-.93a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <span className="hidden sm:inline">Llamar</span>
                </a>
              )}
            </div>
          </div>

          {/* Name, location, description */}
          <div className="mt-3 pb-6">
            <h1 className="text-2xl font-black text-gray-900">{op.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
              {op.city && (
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 flex-shrink-0">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {op.city}
                </p>
              )}
              {op.instagram && (
                <a
                  href={`https://instagram.com/${op.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener"
                  className="text-gray-400 hover:text-pink-500 text-sm flex items-center gap-1 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  @{op.instagram.replace('@', '')}
                </a>
              )}
              {op.website && (
                <a
                  href={op.website.startsWith('http') ? op.website : `https://${op.website}`}
                  target="_blank"
                  rel="noopener"
                  className="text-gray-400 hover:text-sky-500 text-sm flex items-center gap-1 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                  {op.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </a>
              )}
            </div>
            {op.description && (
              <p className="mt-3 text-sm text-gray-600 leading-relaxed max-w-2xl">{op.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Experiencias */}
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8">
        {exps.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🏄</p>
            <p className="text-gray-500">{t.noExperiences}</p>
          </div>
        ) : (
          <>
            <h2 className="text-base font-black text-gray-900 mb-5 uppercase tracking-wide text-xs text-gray-400">
              {exps.length === 1 ? `1 ${t.experienceAvailable}` : `${exps.length} ${t.experiencesAvailable}`}
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
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all group block">
                    {/* Cover */}
                    <div className="relative h-48">
                      {exp.cover_url ? (
                        <Image
                          src={exp.cover_url}
                          alt={exp.name}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="h-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-5xl">
                          {CATEGORY_ICONS[exp.category]}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-bold px-2.5 py-1 rounded-full">
                        {CATEGORY_ICONS[exp.category]} {CATEGORY_LABELS[exp.category]}
                      </span>
                      {/* Price badge */}
                      <span className="absolute bottom-3 right-3 bg-white text-gray-900 text-sm font-black px-3 py-1 rounded-xl shadow-sm">
                        {exp.price}€
                        <span className="text-xs font-normal text-gray-400">{t.perPerson}</span>
                      </span>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-black text-gray-900 mb-1 leading-tight text-base">{exp.name}</h3>
                      {exp.location && (
                        <p className="text-xs text-gray-400 flex items-center gap-1 mb-2">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 flex-shrink-0">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                          </svg>
                          {exp.location}
                        </p>
                      )}
                      {exp.description && (
                        <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{exp.description}</p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="bg-gray-100 px-2 py-0.5 rounded-full">⏱ {durationLabel}</span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded-full">👥 {t.maxLabel} {exp.max_capacity}</span>
                        {exp.difficulty && exp.difficulty !== 'all' && (
                          <span className="bg-gray-100 px-2 py-0.5 rounded-full capitalize">{exp.difficulty}</span>
                        )}
                      </div>
                    </div>

                    {/* CTA bar */}
                    <div
                      className="px-4 py-3 text-xs font-bold text-white flex items-center justify-between"
                      style={{ background: primaryColor }}
                    >
                      <span>{t.book}</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                      </svg>
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
          {t.poweredBy} <Link href="/" className="hover:text-gray-500 transition-colors">slotly.es</Link>
        </p>
      </footer>
    </div>
  )
}
