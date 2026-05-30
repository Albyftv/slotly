import { Suspense } from 'react'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import { getT } from '@/lib/i18n'
import type { Lang } from '@/lib/i18n'

async function CanceladaContent({ bookingCode }: { bookingCode: string }) {
  const supabase = createServiceClient()
  const { data: booking } = await supabase
    .from('bookings')
    .select('language')
    .eq('confirmation_code', bookingCode)
    .single()

  const lang = (booking?.language as Lang) ?? 'es'
  const t = getT(lang)

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="2" className="w-10 h-10">
          <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      </div>
      <h1 className="text-3xl font-black text-gray-900 mb-2">{t.paymentCancelled}</h1>
      <p className="text-gray-500 mb-8">{t.paymentCancelledDesc}</p>

      <div className="bg-gray-50 rounded-3xl p-6 text-left space-y-3 mb-8">
        <p className="text-sm text-gray-600 leading-relaxed">
          Si has cerrado la ventana de pago por accidente, puedes volver a intentarlo.
          La reserva sigue disponible esperando confirmación durante los próximos 30 minutos.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Link href={`/reserva/confirmada?code=${bookingCode}`}
          className="w-full bg-sky-500 text-white font-bold py-4 rounded-2xl hover:bg-sky-400 transition-colors text-center">
          {t.tryAgain}
        </Link>
      </div>
    </div>
  )
}

export default async function CanceladaPage({ searchParams }: { searchParams: Promise<{ booking?: string }> }) {
  const { booking } = await searchParams
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-16" style={{ fontFamily: "'Inter', system-ui" }}>
      <Suspense fallback={<div className="text-gray-400">{getT('es').loading}</div>}>
        <CanceladaContent bookingCode={booking ?? ''} />
      </Suspense>
    </div>
  )
}
