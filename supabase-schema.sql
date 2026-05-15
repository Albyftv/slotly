-- ============================================================
-- SLOTLY — Schema completo
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- Extensiones
create extension if not exists "uuid-ossp";

-- ============================================================
-- OPERATORS (negocios que ofrecen experiencias)
-- ============================================================
create table operators (
  id                  uuid primary key default uuid_generate_v4(),
  name                text not null,
  slug                text not null unique,
  description         text,
  logo_url            text,
  cover_url           text,
  email               text not null unique,
  phone               text,
  whatsapp            text,
  city                text,
  address             text,
  website             text,
  instagram           text,
  primary_color       text not null default '#0ea5e9',
  -- Stripe
  stripe_customer_id        text,
  stripe_account_id         text,           -- Stripe Connect Express account
  stripe_account_enabled    boolean default false,
  subscription_status       text default 'trialing',  -- trialing | active | cancelled
  subscription_id           text,
  -- Auth (linked to Supabase Auth user)
  user_id             uuid references auth.users(id) on delete cascade,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- ============================================================
-- EXPERIENCES (cada actividad que ofrece el operador)
-- ============================================================
create table experiences (
  id              uuid primary key default uuid_generate_v4(),
  operator_id     uuid not null references operators(id) on delete cascade,
  slug            text not null,
  name            text not null,
  description     text,
  category        text not null default 'water',  -- water | land | air | culture
  cover_url       text,
  gallery         text[] default '{}',
  price           numeric(10,2) not null,
  price_currency  text not null default 'EUR',
  duration_min    int not null default 120,        -- duración en minutos
  max_capacity    int not null default 10,
  min_participants int not null default 1,
  location        text,
  meeting_point   text,
  included        text[],                          -- ["Equipo", "Instructor", "Seguro"]
  not_included    text[],
  languages       text[] default '{es,en}',
  difficulty      text default 'all',              -- all | beginner | intermediate | advanced
  age_min         int default 0,
  status          text default 'active',           -- active | paused | draft
  unique(operator_id, slug),
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ============================================================
-- AVAILABILITY (plantilla semanal de horarios)
-- ============================================================
create table availability (
  id              uuid primary key default uuid_generate_v4(),
  experience_id   uuid not null references experiences(id) on delete cascade,
  day_of_week     int not null,    -- 0=Dom, 1=Lun, ... 6=Sáb
  start_time      time not null,   -- ej: '09:00'
  active          boolean default true,
  unique(experience_id, day_of_week, start_time)
);

-- ============================================================
-- BLOCKED DATES (días cerrados / festivos)
-- ============================================================
create table blocked_dates (
  id              uuid primary key default uuid_generate_v4(),
  experience_id   uuid not null references experiences(id) on delete cascade,
  blocked_date    date not null,
  reason          text,
  unique(experience_id, blocked_date)
);

-- ============================================================
-- BOOKINGS (cada reserva de un turista)
-- ============================================================
create table bookings (
  id                      uuid primary key default uuid_generate_v4(),
  experience_id           uuid not null references experiences(id),
  operator_id             uuid not null references operators(id),
  -- Fecha y hora
  booking_date            date not null,
  start_time              time not null,
  -- Participantes
  participants            int not null default 1,
  -- Cliente
  customer_name           text not null,
  customer_email          text not null,
  customer_phone          text,
  customer_country        text,
  special_requests        text,
  -- Económico
  unit_price              numeric(10,2) not null,
  total_amount            numeric(10,2) not null,
  platform_fee            numeric(10,2) not null,   -- 2%
  operator_amount         numeric(10,2) not null,   -- 98%
  -- Stripe
  stripe_payment_intent_id  text unique,
  stripe_transfer_id        text,
  -- Estado
  status                  text default 'pending',   -- pending | confirmed | cancelled | refunded
  confirmation_code       text unique default upper(substring(md5(random()::text), 1, 8)),
  language                text default 'es',
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);

-- ============================================================
-- TRIGGER updated_at automático
-- ============================================================
create or replace function set_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger trg_operators_updated_at
  before update on operators
  for each row execute function set_updated_at();

create trigger trg_experiences_updated_at
  before update on experiences
  for each row execute function set_updated_at();

create trigger trg_bookings_updated_at
  before update on bookings
  for each row execute function set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table operators    enable row level security;
alter table experiences  enable row level security;
alter table availability enable row level security;
alter table blocked_dates enable row level security;
alter table bookings     enable row level security;

-- Operators: solo el propio operador puede leer/editar sus datos
create policy "operator_self" on operators
  for all using (user_id = auth.uid());

-- service_role acceso completo
create policy "service_all_operators" on operators
  for all using (auth.role() = 'service_role');

-- Experiences: lectura pública de activas, escritura solo el operador dueño
create policy "public_read_experiences" on experiences
  for select using (status = 'active');

create policy "operator_manage_experiences" on experiences
  for all using (
    operator_id in (select id from operators where user_id = auth.uid())
  );

create policy "service_all_experiences" on experiences
  for all using (auth.role() = 'service_role');

-- Availability: lectura pública, escritura del operador
create policy "public_read_availability" on availability
  for select using (true);

create policy "operator_manage_availability" on availability
  for all using (
    experience_id in (
      select e.id from experiences e
      join operators o on o.id = e.operator_id
      where o.user_id = auth.uid()
    )
  );

create policy "service_all_availability" on availability
  for all using (auth.role() = 'service_role');

-- Blocked dates
create policy "public_read_blocked" on blocked_dates
  for select using (true);

create policy "operator_manage_blocked" on blocked_dates
  for all using (
    experience_id in (
      select e.id from experiences e
      join operators o on o.id = e.operator_id
      where o.user_id = auth.uid()
    )
  );

create policy "service_all_blocked" on blocked_dates
  for all using (auth.role() = 'service_role');

-- Bookings: el operador ve sus reservas, el turista no tiene cuenta
create policy "operator_read_bookings" on bookings
  for select using (
    operator_id in (select id from operators where user_id = auth.uid())
  );

create policy "service_all_bookings" on bookings
  for all using (auth.role() = 'service_role');

-- Cualquiera puede insertar una reserva (flujo de pago)
create policy "public_insert_booking" on bookings
  for insert with check (true);

-- ============================================================
-- ÍNDICES para rendimiento
-- ============================================================
create index idx_experiences_operator on experiences(operator_id);
create index idx_availability_experience on availability(experience_id);
create index idx_bookings_experience_date on bookings(experience_id, booking_date);
create index idx_bookings_operator on bookings(operator_id);
create index idx_bookings_status on bookings(status);
