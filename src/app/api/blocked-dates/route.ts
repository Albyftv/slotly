import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// POST /api/blocked-dates — bloquear una fecha
export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { experience_id, blocked_date, reason } = await req.json()
  if (!experience_id || !blocked_date) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Verificar que la experiencia pertenece al operador autenticado
  const { data: exp } = await supabase
    .from('experiences')
    .select('id, operator_id')
    .eq('id', experience_id)
    .single()

  const { data: op } = await supabase
    .from('operators')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!exp || !op || exp.operator_id !== op.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data, error } = await supabase
    .from('blocked_dates')
    .insert({ experience_id, blocked_date, reason: reason ?? null })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE /api/blocked-dates?id=xxx
export async function DELETE(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  // Verificar ownership
  const { data: blocked } = await supabase
    .from('blocked_dates')
    .select('experience_id')
    .eq('id', id)
    .single()

  if (!blocked) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: exp } = await supabase
    .from('experiences')
    .select('operator_id')
    .eq('id', blocked.experience_id)
    .single()

  const { data: op } = await supabase
    .from('operators')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!exp || !op || exp.operator_id !== op.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await supabase.from('blocked_dates').delete().eq('id', id)
  return NextResponse.json({ ok: true })
}
