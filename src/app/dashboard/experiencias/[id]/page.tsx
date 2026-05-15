import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import ExperienciaForm from '@/components/ExperienciaForm'
import Link from 'next/link'

interface Props { params: Promise<{ id: string }> }

export default async function EditarExperienciaPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: operator } = await supabase
    .from('operators')
    .select('id, slug')
    .eq('user_id', user.id)
    .single()
  if (!operator) redirect('/login')

  const { data: experience } = await supabase
    .from('experiences')
    .select('*, availability(*)')
    .eq('id', id)
    .eq('operator_id', operator.id)
    .single()

  if (!experience) notFound()

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001'
  const publicUrl = `${appUrl}/${operator.slug}/${experience.slug}`

  return (
    <div className="pt-14 lg:pt-0 max-w-2xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Editar experiencia</h1>
          <p className="text-gray-500 text-sm mt-1">{experience.name}</p>
        </div>
        <Link href={publicUrl} target="_blank"
          className="flex items-center gap-1.5 text-xs text-sky-500 font-bold hover:underline border border-sky-200 px-3 py-2 rounded-xl bg-sky-50">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          Ver página pública
        </Link>
      </div>
      <ExperienciaForm operatorId={operator.id} operatorSlug={operator.slug} experience={experience} />
    </div>
  )
}
