'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  experienceId: string
  experienceName: string
}

export default function DeleteExperienciaButton({ experienceId, experienceName }: Props) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      const res = await fetch('/api/experiences/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: experienceId }),
      })
      if (!res.ok) throw new Error('Error al eliminar')
      router.push('/dashboard/experiencias')
      router.refresh()
    } catch {
      alert('Error al eliminar la experiencia')
      setDeleting(false)
    }
  }

  return (
    <div>
      <button
        onClick={() => setConfirming(true)}
        className="text-sm font-semibold text-red-400 hover:text-red-600 transition-colors">
        Eliminar experiencia
      </button>

      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setConfirming(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-black text-gray-900 mb-2">¿Eliminar {experienceName}?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Se eliminarán también los horarios configurados. Las reservas existentes no se verán afectadas.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirming(false)}
                className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-500 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-red-600 transition-colors disabled:opacity-50">
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
