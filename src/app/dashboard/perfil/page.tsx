import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PerfilClient from '@/components/PerfilClient'

export default async function PerfilPage({
  searchParams,
}: {
  searchParams: Promise<{ stripe?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: operator } = await supabase
    .from('operators')
    .select('id, name, slug, email, city, phone, stripe_account_id, stripe_account_enabled, subscription_status')
    .eq('user_id', user.id)
    .single()

  if (!operator) redirect('/registro')

  const { stripe } = await searchParams

  return <PerfilClient operator={operator} stripeSuccess={stripe === 'success'} />
}
