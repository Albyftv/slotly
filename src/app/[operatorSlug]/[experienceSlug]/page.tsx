import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import BookingWidget from '@/components/BookingWidget'
import type { Experience, Operator, Availability } from '@/lib/types'
import { DIFFICULTY_LABELS } from '@/lib/types'
import { parseLang, getT, SUPPORTED_LANGS, LANG_FLAGS, LANG_LABELS, type Lang } from '@/lib/i18n'

interface Props {
  params: Promise<{ operatorSlug: string; experienceSlug: string }>
  searchParams: Promise<{ lang?: string; embed?: string }>
}

export async function generateMetadata({ params }: Props) {
  const { experienceSlug } = await params
  const supabase = createServiceClient()
  const { data: exp } = await supabase
    .from('experiences')
    .select('name, description')
    .eq('slug', experienceSlug)
    .eq('status', 'active')
    .single()
  if (!exp) return { title: 'Experiencia no encontrada' }
  return {
    title: `${exp.name} — Reserva online`,
    description: exp.description ?? undefined,
  }
}

export default async function ExperienciaPublicaPage({ params, searchParams }: Props) {
  const { operatorSlug, experienceSlug } = await params
  const { lang: rawLang, embed: embedParam } = await searchParams
  const isEmbed = embedParam === '1'
  const supabase = createServiceClient()

  const { data: operator } = await supabase
    .from('operators')
    .select('*')
    .eq('slug', operatorSlug)
    .single()

  if (!operator) notFound()

  const { data: experience } = await supabase
    .from('experiences')
    .select('*, availability(*)')
    .eq('slug', experienceSlug)
    .eq('operator_id', operator.id)
    .eq('status', 'active')
    .single()

  if (!experience) notFound()

  const { data: blockedDates } = await supabase
    .from('blocked_dates')
    .select('blocked_date')
    .eq('experience_id', experience.id)
    .gte('blocked_date', new Date().toISOString().slice(0, 10))

  const exp = experience as Experience & { availability: Availability[] }
  const op = operator as Operator

  // Language: use URL param if it's a supported lang for this experience, else 'es'
  const expLangs = (exp.languages ?? []) as string[]
  const candidateLang = parseLang(rawLang)
  const lang: Lang = (expLangs.length === 0 || expLangs.includes(candidateLang))
    ? candidateLang
    : 'es'
  const t = getT(lang)

  const durationHours = Math.floor(exp.duration_min / 60)
  const durationMins = exp.duration_min % 60
  const durationLabel = durationHours > 0
    ? `${durationHours}h${durationMins > 0 ? ` ${durationMins}min` : ''}`
    : `${durationMins}min`

  // Only show the languages the experience supports
  const availableLangs = SUPPORTED_LANGS.filter(l =>
    expLangs.length === 0 || expLangs.includes(l)
  )

  const baseUrl = `/${operatorSlug}/${experienceSlug}`

  // ── MODO EMBED ─────────────────────────────────────────────
  if (isEmbed) {
    return (
      <div style={{ fontFamily: "'Inter', system-ui, sans-serif", padding: '12px' }}>
        <BookingWidget
          experience={exp}
          blockedDates={(blockedDates ?? []).map(b => b.blocked_date)}
          lang={lang}
          embed
        />
        <p style={{ textAlign: 'center', fontSize: '11px', color: '#d1d5db', marginTop: '8px' }}>
          Reservas por <a href="https://slotly.es" style={{ color: '#d1d5db' }}>slotly.es</a>
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── HERO ──────────────────────────────────────────── */}
      <div className="relative h-[55vh] min-h-72">
        {exp.cover_url ? (
          <Image src={exp.cover_url} alt={exp.name} fill className="object-cover" priority sizes="100vw" />
        ) : (
          <div className="h-full bg-gradient-to-br from-sky-400 to-blue-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Back */}
        <a href="javascript:history.back()"
          className="absolute top-5 left-5 flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold bg-black/20 backdrop-blur-sm px-3 py-2 rounded-full transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          {t.back}
        </a>

        {/* Language switcher + operator badge */}
        <div className="absolute top-5 right-5 flex items-center gap-2">
          {/* Language switcher */}
          {availableLangs.length > 1 && (
            <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1.5">
              {availableLangs.map(l => (
                <Link
                  key={l}
                  href={`${baseUrl}?lang=${l}`}
                  className={`text-xs font-bold px-2 py-0.5 rounded-full transition-colors ${
                    lang === l
                      ? 'bg-white text-gray-900'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {LANG_FLAGS[l]} {LANG_LABELS[l]}
                </Link>
              ))}
            </div>
          )}

          {/* Operator badge */}
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5">
            <div className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center text-white text-xs font-black">
              {op.name.charAt(0)}
            </div>
            <span className="text-white text-xs font-semibold">{op.name}</span>
          </div>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-6 sm:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="bg-sky-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                ⏱ {durationLabel}
              </span>
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                👥 {t.max} {exp.max_capacity}
              </span>
              {exp.difficulty !== 'all' && (
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                  {DIFFICULTY_LABELS[exp.difficulty]}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">{exp.name}</h1>
            {exp.location && (
              <p className="text-white/70 text-sm mt-2 flex items-center gap-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                {exp.location}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── CONTENIDO ────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">

          {/* Columna izquierda: info */}
          <div className="space-y-8 order-2 lg:order-1">

            {exp.description && (
              <div>
                <h2 className="text-lg font-black text-gray-900 mb-3">{t.about}</h2>
                <p className="text-gray-600 leading-relaxed">{exp.description}</p>
              </div>
            )}

            {((exp.included ?? []).length > 0 || (exp.not_included ?? []).length > 0) && (
              <div className="grid sm:grid-cols-2 gap-6">
                {(exp.included ?? []).length > 0 && (
                  <div>
                    <h3 className="text-sm font-black text-gray-900 mb-3">{t.included}</h3>
                    <ul className="space-y-2">
                      {(exp.included ?? []).map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <svg viewBox="0 0 20 20" fill="#22c55e" className="w-4 h-4 mt-0.5 flex-shrink-0">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {(exp.not_included ?? []).length > 0 && (
                  <div>
                    <h3 className="text-sm font-black text-gray-900 mb-3">{t.notIncluded}</h3>
                    <ul className="space-y-2">
                      {(exp.not_included ?? []).map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <svg viewBox="0 0 20 20" fill="#ef4444" className="w-4 h-4 mt-0.5 flex-shrink-0">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {exp.meeting_point && (
              <div className="bg-sky-50 rounded-2xl p-5">
                <h3 className="text-sm font-black text-gray-900 mb-1 flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" className="w-4 h-4">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {t.meetingPoint}
                </h3>
                <p className="text-gray-600 text-sm">{exp.meeting_point}</p>
              </div>
            )}

            {/* Operador */}
            <div className="border border-gray-100 rounded-2xl p-5">
              <h3 className="text-sm font-black text-gray-900 mb-4">{t.organizedBy}</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-sky-500 text-white flex items-center justify-center font-black text-lg flex-shrink-0">
                  {op.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{op.name}</p>
                  {op.city && <p className="text-sm text-gray-400">{op.city}</p>}
                </div>
              </div>
              {(op.phone || op.whatsapp) && (
                <div className="flex gap-3 mt-4">
                  {op.whatsapp && (
                    <a href={`https://wa.me/${op.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener"
                      className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white text-sm font-bold py-2.5 rounded-xl hover:bg-green-600 transition-colors">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.523 5.848L.057 23.625a.563.563 0 0 0 .693.693l5.772-1.466A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.796 9.796 0 0 1-5.001-1.367l-.358-.213-3.427.871.887-3.34-.234-.374A9.77 9.77 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                      </svg>
                      {t.whatsapp}
                    </a>
                  )}
                  {op.phone && (
                    <a href={`tel:${op.phone}`}
                      className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-700 text-sm font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.37a16 16 0 0 0 6 6l1.27-.93a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      {t.call}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Columna derecha: widget */}
          <div className="order-1 lg:order-2">
            <div className="lg:sticky lg:top-6">
              <BookingWidget
                experience={exp}
                blockedDates={(blockedDates ?? []).map(b => b.blocked_date)}
                lang={lang}
              />
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-16 py-6 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-300">
          {t.poweredBy} <Link href="/" className="hover:text-gray-500">slotly.es</Link>
        </p>
      </footer>
    </div>
  )
}
