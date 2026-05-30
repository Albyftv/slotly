import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ExperienciaForm from '@/components/ExperienciaForm'

export default async function NuevaExperienciaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: operator } = await supabase
    .from('operators')
    .select('id, slug')
    .eq('user_id', user.id)
    .single()
  if (!operator) redirect('/login')

  return (
    <div className="pt-14 lg:pt-0 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Nueva experiencia</h1>
        <p className="text-gray-500 text-sm mt-1">Rellena los datos para crear tu página de reservas</p>
      </div>
      <ExperienciaForm operatorId={operator.id} />
    </div>
  )
}
