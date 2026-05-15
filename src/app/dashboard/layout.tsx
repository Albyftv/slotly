import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardNav from '@/components/DashboardNav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: operator } = await supabase
    .from('operators')
    .select('id, name, slug, subscription_status')
    .eq('user_id', user.id)
    .single()

  if (!operator) redirect('/registro')

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardNav operator={operator} />
      <main className="flex-1 min-w-0 p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}
