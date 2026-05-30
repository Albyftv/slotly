'use client'

import { useState } from 'react'

interface Props {
  operatorSlug: string
  expSlug: string
  appUrl: string
}

type EmbedMode = 'fixed' | 'responsive'
type EmbedLang = 'es' | 'en' | 'de' | 'fr'

const LANG_OPTIONS = [
  { value: 'es' as EmbedLang, label: '🇪🇸 Español' },
  { value: 'en' as EmbedLang, label: '🇬🇧 English' },
  { value: 'de' as EmbedLang, label: '🇩🇪 Deutsch' },
  { value: 'fr' as EmbedLang, label: '🇫🇷 Français' },
]

export default function EmbedCodeButton({ operatorSlug, expSlug, appUrl }: Props) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [mode, setMode] = useState<EmbedMode>('fixed')
  const [lang, setLang] = useState<EmbedLang>('es')

  const embedUrl = `${appUrl}/${operatorSlug}/${expSlug}?embed=1&lang=${lang}`

  const fixedSnippet = `<iframe
  src="${embedUrl}"
  width="420"
  height="660"
  frameborder="0"
  style="border-radius:24px;border:none;max-width:100%;"
  title="Reserva online"
></iframe>`

  const responsiveSnippet = `<div id="slotly-widget" style="max-width:420px;margin:0 auto;">
  <iframe
    src="${embedUrl}"
    width="100%"
    height="660"
    frameborder="0"
    style="border-radius:24px;border:none;"
    title="Reserva online"
  ></iframe>
</div>`

  const snippet = mode === 'fixed' ? fixedSnippet : responsiveSnippet

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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-gray-900">Incrustar widget de reservas</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Options */}
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Modo</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMode('fixed')}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-colors ${
                      mode === 'fixed' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}>
                    Ancho fijo
                  </button>
                  <button
                    onClick={() => setMode('responsive')}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-colors ${
                      mode === 'responsive' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}>
                    Adaptable
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Idioma</label>
                <div className="flex gap-2">
                  {LANG_OPTIONS.map(o => (
                    <button key={o.value}
                      onClick={() => setLang(o.value)}
                      className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-colors ${
                        lang === o.value ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="border border-gray-200 rounded-xl overflow-hidden mb-4 bg-gray-50">
              <div className="bg-gray-100 px-4 py-2 flex items-center gap-2 border-b border-gray-200">
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <span className="text-xs text-gray-400 font-mono truncate">{embedUrl}</span>
              </div>
              <div className="flex justify-center p-4">
                <iframe
                  src={embedUrl}
                  width={mode === 'fixed' ? 420 : '100%'}
                  height={500}
                  className="rounded-2xl border border-gray-200"
                  style={{ maxWidth: 420, border: 'none' }}
                  title="Vista previa"
                />
              </div>
            </div>

            {/* Code */}
            <p className="text-sm text-gray-500 mb-3">
              Pega este código en el HTML de tu web donde quieras que aparezca el widget.
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
                    Copiar código
                  </>
                )}
              </button>
            </div>

            <div className="bg-sky-50 rounded-xl p-4 text-sm text-sky-700 space-y-1">
              <p className="font-semibold">Cómo usarlo</p>
              <ul className="text-sky-600 text-xs space-y-1 list-disc list-inside">
                <li>Funciona en WordPress, Wix, Squarespace, Shopify y cualquier web con HTML</li>
                <li>Modo <strong>Ancho fijo</strong>: el widget mantiene 420px en cualquier pantalla</li>
                <li>Modo <strong>Adaptable</strong>: se centra y escala en móviles automáticamente</li>
                <li>Ajusta el <code className="bg-sky-100 px-1 rounded">height</code> (660px por defecto) si el contenido de tu experiencia es más largo o corto</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
