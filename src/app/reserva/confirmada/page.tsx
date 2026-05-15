import { Suspense } from 'react'
import { createServiceClient } from '@/lib/supabase/server'

async function ConfirmadaContent({ code }: { code: string }) {
  const supabase = createServiceClient()
  const { data: booking } = await supabase
    .from('bookings')
    .select('*, experiences(name, operator_id, operators(name, whatsapp, phone))')
    .eq('confirmation_code', code)
    .single()

  if (!booking) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Reserva no encontrada.</p>
      </div>
    )
  }

  const exp = booking.experiences as { name: string; operators: { name: string; whatsapp?: string; phone?: string } }
  const wa = exp?.operators?.whatsapp?.replace(/\D/g, '')

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" className="w-10 h-10">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <h1 className="text-3xl font-black text-gray-900 mb-2">¡Reserva confirmada!</h1>
      <p className="text-gray-500 mb-8">Te hemos enviado un email de confirmación a <strong>{booking.customer_email}</strong></p>

      <div className="bg-gray-50 rounded-3xl p-6 text-left space-y-3 mb-8">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Experiencia</span>
          <span className="font-semibold text-gray-800">{exp?.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Fecha</span>
          <span className="font-semibold text-gray-800">
            {new Date(booking.booking_date + 'T00:00:00').toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Hora</span>
          <span className="font-semibold text-gray-800">{booking.start_time?.slice(0, 5)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Personas</span>
          <span className="font-semibold text-gray-800">{booking.participants}</span>
        </div>
        <div className="flex justify-between text-sm border-t border-gray-200 pt-3">
          <span className="font-black text-gray-900">Total pagado</span>
          <span className="font-black text-gray-900">{booking.total_amount}€</span>
        </div>
        <div className="flex justify-between text-sm bg-white rounded-xl p-3">
          <span className="text-gray-500">Código</span>
          <span className="font-black text-sky-600 tracking-wider">{booking.confirmation_code}</span>
        </div>
      </div>

      {wa && (
        <a href={`https://wa.me/${wa}?text=Hola! Tengo una reserva confirmada, código ${booking.confirmation_code}`}
          target="_blank" rel="noopener"
          className="flex items-center justify-center gap-2 w-full bg-green-500 text-white font-bold py-4 rounded-2xl hover:bg-green-600 transition-colors">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.523 5.848L.057 23.625a.563.563 0 0 0 .693.693l5.772-1.466A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.796 9.796 0 0 1-5.001-1.367l-.358-.213-3.427.871.887-3.34-.234-.374A9.77 9.77 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
          </svg>
          Contactar con {exp?.operators?.name}
        </a>
      )}
    </div>
  )
}

export default async function ConfirmadaPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const { code } = await searchParams
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-16" style={{ fontFamily: "'Inter', system-ui" }}>
      <Suspense fallback={<div className="text-gray-400">Cargando...</div>}>
        <ConfirmadaContent code={code ?? ''} />
      </Suspense>
    </div>
  )
}
