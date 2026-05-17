export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { email, password, name, city, phone } = await req.json()

  if (!email || !password || !name) {
    return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 })
  }

  const supabase = createServiceClient()

  // Crear usuario en Supabase Auth (sin requerir confirmación de email)
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // auto-confirmar para el MVP
  })

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 })
  }

  const userId = authData.user.id

  // Generar slug único
  let slug = name
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  const { data: existing } = await supabase
    .from('operators')
    .select('id')
    .eq('slug', slug)

  if (existing && existing.length > 0) slug = `${slug}-${Date.now().toString().slice(-4)}`

  // Crear perfil del operador con service_role (bypasa RLS)
  const { error: opError } = await supabase.from('operators').insert({
    user_id: userId,
    name,
    slug,
    email,
    phone: phone || null,
    city: city || null,
    primary_color: '#0ea5e9',
    subscription_status: 'trialing',
    stripe_account_enabled: false,
  })

  if (opError) {
    // Limpiar el usuario creado si falla el operador
    await supabase.auth.admin.deleteUser(userId)
    return NextResponse.json({ error: opError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
