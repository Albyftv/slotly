import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/lib/types'
import EmbedCodeButton from '@/components/EmbedCodeButton'

export default async function ExperienciasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: operator } = await supabase
    .from('operators')
    .select('id, slug')
    .eq('user_id', user.id)
    .single()
  if (!operator) redirect('/login')

  const { data: experiences } = await supabase
    .from('experiences')
    .select('*, availability(*)')
    .eq('operator_id', operator.id)
    .order('created_at', { ascending: false })

  const list = experiences ?? []

  return (
    <div className="pt-14 lg:pt-0 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Experiencias</h1>
          <p className="text-gray-500 text-sm mt-1">{list.length} experiencia{list.length !== 1 ? 's' : ''} creada{list.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/dashboard/experiencias/nueva"
          className="flex items-center gap-2 bg-sky-500 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-sky-400 transition-colors text-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nueva experiencia
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center">
          <div className="text-6xl mb-4">🏄</div>
          <h2 className="text-xl font-black text-gray-900 mb-2">Crea tu primera experiencia</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            Añade las actividades que ofreces. Cada una tendrá su propia página de reserva con calendario y pago online.
          </p>
          <Link href="/dashboard/experiencias/nueva"
            className="inline-flex items-center gap-2 bg-sky-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-sky-400 transition-colors">
            Crear experiencia →
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {list.map((exp) => (
            <div key={exp.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-sky-200 transition-all group">
              <Link href={`/dashboard/experiencias/${exp.id}`} className="block">
                <div className="relative h-44">
                  {exp.cover_url ? (
                    <Image src={exp.cover_url} alt={exp.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="400px" />
                  ) : (
                    <div className="h-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
                      <span className="text-5xl">{CATEGORY_ICONS[exp.category as keyof typeof CATEGORY_ICONS] ?? '⭐'}</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      exp.status === 'active' ? 'bg-green-500 text-white' :
                      exp.status === 'paused' ? 'bg-yellow-500 text-white' :
                      'bg-gray-400 text-white'
                    }`}>
                      {exp.status === 'active' ? 'Activa' : exp.status === 'paused' ? 'Pausada' : 'Borrador'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-black text-gray-900">{exp.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {CATEGORY_LABELS[exp.category as keyof typeof CATEGORY_LABELS]} · {exp.duration_min} min · max {exp.max_capacity} personas
                      </p>
                    </div>
                    <p className="text-lg font-black text-sky-600 flex-shrink-0">{exp.price}€</p>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-gray-400">
                      <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                    </svg>
                    <p className="text-xs text-gray-400">
                      {(exp.availability ?? []).filter((a: { active: boolean }) => a.active).length} horarios configurados
                    </p>
                  </div>
                </div>
              </Link>
              {exp.status === 'active' && operator?.slug && (
                <div className="px-4 pb-3 border-t border-gray-50 pt-3">
                  <EmbedCodeButton
                    operatorSlug={operator.slug}
                    expSlug={exp.slug}
                    appUrl={process.env.NEXT_PUBLIC_APP_URL ?? 'https://slotly.es'}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
