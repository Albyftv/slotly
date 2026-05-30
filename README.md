# Slotly

Plataforma SaaS de reservas online para operadores turísticos en Canarias. Permite a escuelas de surf, diving centers, excursiones y otras experiencias turísticas aceptar reservas con pago integrado, gestión de calendario y multiidioma.

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **UI:** React 19, Tailwind CSS v4
- **Base de datos:** Supabase (PostgreSQL + Auth + RLS)
- **Pagos:** Stripe Connect (split de pagos), Stripe Billing (suscripciones)
- **Emails:** Resend
- **Idiomas:** ES, EN, DE, FR (date-fns + i18n propio)

## Estructura

```
src/
├── app/
│   ├── [operatorSlug]/          # Página pública del operador
│   │   └── [experienceSlug]/    # Página pública de la experiencia + widget
│   ├── api/
│   │   ├── auth/register        # Registro de operadores
│   │   ├── bookings/create      # Crear reserva + sesión Stripe
│   │   ├── operators/update     # Actualizar perfil
│   │   └── stripe/              # Webhooks, Connect, Billing
│   ├── dashboard/               # Panel del operador (protegido)
│   │   ├── experiencias/        # CRUD de experiencias
│   │   ├── reservas/            # Listado y filtros
│   │   └── perfil/              # Datos del negocio, Stripe Connect
│   ├── destinos/[isla]/         # Búsqueda por isla (SSG)
│   ├── reserva/                 # Páginas post-pago
│   ├── login/                   # Autenticación
│   └── registro/                # Registro en 2 pasos
├── components/
│   ├── BookingWidget.tsx        # Widget de reservas (client-side)
│   ├── DashboardNav.tsx         # Navegación del dashboard
│   ├── EmbedCodeButton.tsx      # Modal con código iframe
│   ├── ExperienciaForm.tsx      # Formulario crear/editar experiencia
│   └── PerfilClient.tsx         # Configuración del perfil + Stripe
└── lib/
    ├── supabase/                # Clientes Supabase (server + browser)
    ├── i18n.ts                  # Traducciones (ES/EN/DE/FR)
    ├── stripe.ts                # Config Stripe + planes
    ├── email.ts                 # Templates de emails
    ├── islands.ts               # Datos de Canarias
    └── types.ts                 # Tipos TypeScript
```

## Variables de entorno

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_BASIC=
STRIPE_PRICE_PRO=

# Resend
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3001
npm run build
npm run lint
```

## Modelo de negocio

- Plan Basic (19€/mes): hasta 3 experiencias
- Plan Pro (39€/mes): experiencias ilimitadas
- 2% de comisión por reserva completada
- 14 días de prueba gratis
- Pagos vía Stripe Connect con split automático
