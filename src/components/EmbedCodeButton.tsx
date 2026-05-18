'use client'

import { useState } from 'react'

interface Props {
  operatorSlug: string
  expSlug: string
  appUrl: string
}

export default function EmbedCodeButton({ operatorSlug, expSlug, appUrl }: Props) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const embedUrl = `${appUrl}/${operatorSlug}/${expSlug}?embed=1`
  const snippet = `<iframe\n  src="${embedUrl}"\n  width="420"\n  height="660"\n  frameborder="0"\n  style="border-radius:24px;border:none;"\n  title="Reserva online"\n></iframe>`

  async function copy() {
    await navigator.clipboard.writeText(snippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <button
        onClick={e => { e.preventDefault(); e.stopPropagation(); setOpen(o => !o) }}
        className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-sky-600 transition-colors px-2 py-1.5 rounded-lg hover:bg-sky-50"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
          <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
        </svg>
        Código embed
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-gray-900">Código para incrustar</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Pega este código en el HTML de tu web donde quieras que aparezca el widget de reservas.
            </p>

            <div className="relative bg-gray-900 rounded-xl p-4 mb-4">
              <pre className="text-xs text-green-400 font-mono overflow-x-auto whitespace-pre">{snippet}</pre>
              <button
                onClick={copy}
                className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                {copied ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Copiado
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                      <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                    Copiar
                  </>
                )}
              </button>
            </div>

            <div className="bg-sky-50 rounded-xl p-4 text-sm text-sky-700 space-y-1">
              <p className="font-semibold">💡 Cómo usarlo</p>
              <p className="text-sky-600 text-xs">Funciona en WordPress, Wix, Squarespace o cualquier web con HTML. Ajusta el <code className="bg-sky-100 px-1 rounded">height</code> según el contenido de tu experiencia (600–700px suele ir bien).</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
