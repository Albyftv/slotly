'use client'
import { useState } from 'react'

const BUSINESS_TYPES = [
  'Escuela de surf',
  'Centro de diving',
  'Rutas y excursiones',
  'Avistamiento de cetáceos',
  'Actividades acuáticas',
  'Rutas en quad / buggy',
  'Parapente / actividades aéreas',
  'Turismo cultural',
  'Otro',
]

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', phone: '', business_type: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'ok' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'ok') {
    return (
      <div className="bg-white rounded-3xl border-2 border-emerald-200 p-10 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">✅</div>
        <h3 className="text-2xl font-black text-gray-900 mb-2">¡Recibido!</h3>
        <p className="text-gray-500">Te contactamos en menos de 24 horas para mostrarte la plataforma en persona.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8 max-w-lg mx-auto">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Tu nombre</label>
          <input
            required
            type="text"
            placeholder="Carlos Martín"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Teléfono o WhatsApp</label>
          <input
            required
            type="tel"
            placeholder="+34 600 000 000"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Tipo de negocio</label>
          <select
            required
            value={form.business_type}
            onChange={e => setForm(f => ({ ...f, business_type: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all bg-white"
          >
            <option value="">Selecciona...</option>
            {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">
            ¿Algo más que quieras contarnos? <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <textarea
            rows={3}
            placeholder="Nombre de tu negocio, isla donde operas, cuántas reservas gestionas al mes..."
            value={form.message}
            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        {status === 'error' && (
          <p className="text-sm text-red-500 text-center">Algo salió mal. Inténtalo de nuevo o escríbenos directamente.</p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-sky-500 text-white font-black py-4 rounded-2xl text-lg hover:bg-sky-400 transition-all shadow-lg shadow-sky-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Enviando...' : 'Quiero una demo gratuita →'}
        </button>

        <p className="text-center text-xs text-gray-400">Sin compromiso · Te llamamos en menos de 24h</p>
      </div>
    </form>
  )
}
