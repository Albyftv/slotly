export type SubscriptionStatus = 'trialing' | 'active' | 'cancelled'
export type ExperienceStatus = 'active' | 'paused' | 'draft'
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'refunded'
export type ExperienceCategory = 'water' | 'land' | 'air' | 'culture'

export interface Operator {
  id: string
  name: string
  slug: string
  description?: string
  logo_url?: string
  cover_url?: string
  email: string
  phone?: string
  whatsapp?: string
  city?: string
  address?: string
  website?: string
  instagram?: string
  primary_color: string
  stripe_customer_id?: string
  stripe_account_id?: string
  stripe_account_enabled: boolean
  subscription_status: SubscriptionStatus
  subscription_id?: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface Experience {
  id: string
  operator_id: string
  slug: string
  name: string
  description?: string
  category: ExperienceCategory
  cover_url?: string
  gallery: string[]
  price: number
  price_currency: string
  duration_min: number
  max_capacity: number
  min_participants: number
  location?: string
  meeting_point?: string
  included?: string[]
  not_included?: string[]
  languages: string[]
  difficulty: string
  age_min: number
  status: ExperienceStatus
  created_at: string
  updated_at: string
  // joined
  operator?: Operator
  availability?: Availability[]
}

export interface Availability {
  id: string
  experience_id: string
  day_of_week: number
  start_time: string
  active: boolean
}

export interface BlockedDate {
  id: string
  experience_id: string
  blocked_date: string
  reason?: string
}

export interface Booking {
  id: string
  experience_id: string
  operator_id: string
  booking_date: string
  start_time: string
  participants: number
  customer_name: string
  customer_email: string
  customer_phone?: string
  customer_country?: string
  special_requests?: string
  unit_price: number
  total_amount: number
  platform_fee: number
  operator_amount: number
  stripe_payment_intent_id?: string
  status: BookingStatus
  confirmation_code: string
  language: string
  created_at: string
}

export const CATEGORY_LABELS: Record<ExperienceCategory, string> = {
  water: 'Acuático',
  land: 'Terrestre',
  air: 'Aéreo',
  culture: 'Cultural',
}

export const CATEGORY_ICONS: Record<ExperienceCategory, string> = {
  water: '🌊',
  land: '🏔️',
  air: '🪂',
  culture: '🎭',
}

export const DIFFICULTY_LABELS: Record<string, string> = {
  all: 'Todos los niveles',
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
}

export const DAY_LABELS: Record<number, string> = {
  0: 'Dom', 1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue', 5: 'Vie', 6: 'Sáb',
}
