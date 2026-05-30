'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  bookingId: string
  status: string
}

export default function CancelBookingButton({ bookingId, status }: Props) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  if (status !== 'pending' && status !== 'confirmed') return null

  async function handleCancel() {
    setLoading(true)
    try {
      const res = await fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookingId }),
      })
      if (!res.ok) throw new Error()
      router.refresh()
    } catch {
      alert('Error al cancelar la reserva')
    } finally {
      setLoading(false)
      setConfirming(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setConfirming(true)}
        className="text-xs font-semibold text-red-400 hover:text-red-600 transition-colors">
        Cancelar
      </button>

      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setConfirming(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-black text-gray-900 mb-2">Cancelar reserva</h3>
            <p className="text-sm text-gray-500 mb-6">
              ¿Seguro que quieres cancelar esta reserva? El cliente será notificado.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirming(false)}
                className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                Volver
              </button>
              <button onClick={handleCancel} disabled={loading}
                className="flex-1 bg-red-500 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-red-600 transition-colors disabled:opacity-50">
                {loading ? 'Cancelando...' : 'Cancelar reserva'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
