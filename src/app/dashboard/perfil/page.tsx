import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PerfilClient from '@/components/PerfilClient'

export default async function PerfilPage({
  searchParams,
}: {
  searchParams: Promise<{ stripe?: string; billing?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: operator } = await supabase
    .from('operators')
    .select('id, name, slug, email, city, phone, whatsapp, callmebot_api_key, stripe_account_id, stripe_account_enabled, stripe_customer_id, subscription_status, subscription_id, created_at')
    .eq('user_id', user.id)
    .single()

  if (!operator) redirect('/registro')

  const { stripe, billing } = await searchParams

  return (
    <PerfilClient
      operator={operator}
      stripeSuccess={stripe === 'success'}
      billingSuccess={billing === 'success'}
    />
  )
}
