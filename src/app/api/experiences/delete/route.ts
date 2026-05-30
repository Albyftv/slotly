export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })

  const { data: operator } = await supabase
    .from('operators')
    .select('id')
    .eq('user_id', user.id)
    .single()
  if (!operator) return NextResponse.json({ error: 'Operador no encontrado' }, { status: 404 })

  const { error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', id)
    .eq('operator_id', operator.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
