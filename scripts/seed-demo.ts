import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

function clean(v: string | undefined) {
  let s = (v ?? '').trim()
  while (s.charCodeAt(0) === 65279) s = s.slice(1)
  return s.trim()
}

const supabase = createClient(
  clean(process.env.NEXT_PUBLIC_SUPABASE_URL),
  clean(process.env.SUPABASE_SERVICE_ROLE_KEY),
)

async function main() {
  console.log('Creando demo...\n')

  // Crear usuario en Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: 'demo@slotly.es',
    password: 'SlotlyDemo2026!',
    email_confirm: true,
  })

  if (authError) {
    if (authError.message.includes('already')) {
      console.log('⚠️  El usuario demo ya existe. Borra el operador en Supabase y vuelve a ejecutar.')
    } else {
      console.error('Error auth:', authError.message)
    }
    process.exit(1)
  }

  const userId = authData.user.id

  // Crear operador
  const { data: operator, error: opError } = await supabase
    .from('operators')
    .insert({
      user_id: userId,
      name: 'Fuerteventura Adventures',
      slug: 'fuerteventura-adventures',
      email: 'demo@slotly.es',
      phone: '+34 600 123 456',
      city: 'Corralejo, Fuerteventura',
      primary_color: '#0ea5e9',
      subscription_status: 'trialing',
      stripe_account_enabled: false,
    })
    .select()
    .single()

  if (opError) { console.error('Error operador:', opError.message); process.exit(1) }

  // Crear experiencias
  const { data: exps, error: expError } = await supabase
    .from('experiences')
    .insert([
      {
        operator_id: operator.id,
        slug: 'clase-surf-corralejo',
        name: 'Clase de Surf en Corralejo',
        description: 'Aprende a surfear en las mejores olas de Fuerteventura con instructores certificados ISA. Las playas de Corralejo ofrecen condiciones perfectas para principiantes: olas suaves y agua caliente casi todo el año. En 2 horas aprenderás a levantarte en la tabla y a leer las olas.',
        category: 'water',
        cover_url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1200&q=80',
        price: 45,
        price_currency: 'EUR',
        duration_min: 120,
        max_capacity: 8,
        min_participants: 1,
        location: 'Playa de El Burro, Corralejo',
        meeting_point: 'Parking de Playa El Burro, Corralejo. Búscanos junto a la furgoneta azul con el logo de Fuerteventura Adventures. Llega 10 min antes.',
        included: ['Tabla de surf', 'Traje de neopreno', 'Instructor certificado ISA', 'Seguro de actividades', 'Fotos del curso'],
        not_included: ['Transporte al punto de encuentro', 'Bebidas y snacks'],
        languages: ['es', 'en'],
        difficulty: 'beginner',
        age_min: 8,
        status: 'active',
        gallery: [],
      },
      {
        operator_id: operator.id,
        slug: 'avistamiento-cetaceos',
        name: 'Avistamiento de Cetáceos en Catamarán',
        description: 'Navega frente a las costas de Fuerteventura en busca de delfines comunes, delfines moteados y calderones tropicales. Nuestro biólogo marino te explicará todo sobre los cetáceos que habitan estas aguas. Una experiencia que no olvidarás.',
        category: 'water',
        cover_url: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=1200&q=80',
        price: 65,
        price_currency: 'EUR',
        duration_min: 180,
        max_capacity: 12,
        min_participants: 2,
        location: 'Puerto de Corralejo, Fuerteventura',
        meeting_point: 'Puerto de Corralejo, embarcadero principal, Muelle 3. Preséntate 15 minutos antes de la salida.',
        included: ['Guía biólogo marino', 'Chaleco salvavidas', 'Prismáticos', 'Seguro marítimo', 'Snacks y agua'],
        not_included: ['Transporte al puerto', 'Bebidas adicionales'],
        languages: ['es', 'en', 'de'],
        difficulty: 'all',
        age_min: 4,
        status: 'active',
        gallery: [],
      },
      {
        operator_id: operator.id,
        slug: 'ruta-quad-dunas',
        name: 'Ruta en Quad por las Dunas de Corralejo',
        description: 'Explora el Parque Natural de las Dunas de Corralejo a bordo de un quad. Un recorrido de 2 horas por paisajes de dunas doradas, playas vírgenes y miradores con vistas a Lanzarote. Sin experiencia previa necesaria.',
        category: 'land',
        cover_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
        price: 75,
        price_currency: 'EUR',
        duration_min: 120,
        max_capacity: 10,
        min_participants: 2,
        location: 'Parque Natural Corralejo, Fuerteventura',
        meeting_point: 'Oficina de Fuerteventura Adventures, Av. Grandes Playas 12, Corralejo. Parking gratuito disponible.',
        included: ['Quad individual o en pareja', 'Casco y guantes', 'Guía acompañante', 'Seguro de actividad', 'Fotos del recorrido'],
        not_included: ['Carné de conducir requerido (18+)', 'Combustible extra por daños'],
        languages: ['es', 'en'],
        difficulty: 'beginner',
        age_min: 18,
        status: 'active',
        gallery: [],
      },
    ])
    .select()

  if (expError) { console.error('Error experiencias:', expError.message); process.exit(1) }

  // Crear disponibilidad
  const availability = []

  for (const exp of exps!) {
    if (exp.slug === 'clase-surf-corralejo') {
      for (const dow of [1, 2, 3, 4, 5, 6]) { // Lun-Sáb
        availability.push({ experience_id: exp.id, day_of_week: dow, start_time: '09:00:00', active: true })
        availability.push({ experience_id: exp.id, day_of_week: dow, start_time: '14:00:00', active: true })
      }
    } else if (exp.slug === 'avistamiento-cetaceos') {
      for (const dow of [2, 4, 6, 0]) { // Mar, Jue, Sáb, Dom
        availability.push({ experience_id: exp.id, day_of_week: dow, start_time: '10:00:00', active: true })
      }
    } else if (exp.slug === 'ruta-quad-dunas') {
      for (const dow of [0, 1, 2, 3, 4, 5, 6]) { // Todos los días
        availability.push({ experience_id: exp.id, day_of_week: dow, start_time: '09:30:00', active: true })
        availability.push({ experience_id: exp.id, day_of_week: dow, start_time: '15:00:00', active: true })
      }
    }
  }

  const { error: avError } = await supabase.from('availability').insert(availability)
  if (avError) { console.error('Error disponibilidad:', avError.message); process.exit(1) }

  console.log('✅ Demo creado con éxito!\n')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Dashboard: https://slotly-zeta.vercel.app/dashboard')
  console.log('Email:     demo@slotly.es')
  console.log('Password:  SlotlyDemo2026!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('\nURLs de demo para compartir:')
  for (const exp of exps!) {
    console.log(`  → https://slotly-zeta.vercel.app/fuerteventura-adventures/${exp.slug}`)
  }
}

main().catch(console.error)
