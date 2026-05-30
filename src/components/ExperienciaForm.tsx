'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import type { Experience, Availability } from '@/lib/types'

const CATEGORIES = [
  { value: 'water', label: '🌊 Acuático', desc: 'Surf, diving, snorkel, kayak...' },
  { value: 'land', label: '🏔️ Terrestre', desc: 'Quad, trekking, ciclismo...' },
  { value: 'air', label: '🪂 Aéreo', desc: 'Parapente, ala delta...' },
  { value: 'culture', label: '🎭 Cultural', desc: 'Tours, gastronomía, arte...' },
]

const DAYS = [
  { value: 1, label: 'Lun' },
  { value: 2, label: 'Mar' },
  { value: 3, label: 'Mié' },
  { value: 4, label: 'Jue' },
  { value: 5, label: 'Vie' },
  { value: 6, label: 'Sáb' },
  { value: 0, label: 'Dom' },
]

const LANGUAGES = [
  { value: 'es', label: '🇪🇸 Español' },
  { value: 'en', label: '🇬🇧 Inglés' },
  { value: 'de', label: '🇩🇪 Alemán' },
  { value: 'fr', label: '🇫🇷 Francés' },
]

interface SlotRow { day: number; time: string }

interface Props {
  operatorId: string
  experience?: Experience & { availability?: Availability[] }
}

export default function ExperienciaForm({ operatorId, experience }: Props) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const isEdit = !!experience

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [coverPreview, setCoverPreview] = useState<string>(experience?.cover_url ?? '')
  const [coverFile, setCoverFile] = useState<File | null>(null)

  const [form, setForm] = useState({
    name: experience?.name ?? '',
    category: experience?.category ?? 'water',
    description: experience?.description ?? '',
    price: experience?.price?.toString() ?? '',
    duration_min: experience?.duration_min?.toString() ?? '120',
    max_capacity: experience?.max_capacity?.toString() ?? '10',
    min_participants: experience?.min_participants?.toString() ?? '1',
    location: experience?.location ?? '',
    meeting_point: experience?.meeting_point ?? '',
    difficulty: experience?.difficulty ?? 'all',
    age_min: experience?.age_min?.toString() ?? '0',
    status: experience?.status ?? 'active',
    languages: experience?.languages ?? ['es', 'en'],
    included: (experience?.included ?? []).join('\n'),
    not_included: (experience?.not_included ?? []).join('\n'),
  })

  const existingSlots: SlotRow[] = (experience?.availability ?? []).map(a => ({
    day: a.day_of_week,
    time: a.start_time.slice(0, 5),
  }))
  const [slots, setSlots] = useState<SlotRow[]>(existingSlots.length > 0 ? existingSlots : [{ day: 1, time: '09:00' }])

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  function toggleLanguage(lang: string) {
    setForm(f => ({
      ...f,
      languages: f.languages.includes(lang)
        ? f.languages.filter(l => l !== lang)
        : [...f.languages, lang],
    }))
  }

  function addSlot() {
    setSlots(s => [...s, { day: 1, time: '10:00' }])
  }

  function removeSlot(i: number) {
    setSlots(s => s.filter((_, idx) => idx !== i))
  }

  function updateSlot(i: number, field: keyof SlotRow, value: string | number) {
    setSlots(s => s.map((slot, idx) => idx === i ? { ...slot, [field]: value } : slot))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      let coverUrl = experience?.cover_url ?? null

      if (coverFile) {
        const ext = coverFile.name.split('.').pop()
        const path = `${operatorId}/${Date.now()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('covers')
          .upload(path, coverFile, { upsert: true })
        if (uploadError) throw uploadError
        const { data: { publicUrl } } = supabase.storage.from('covers').getPublicUrl(path)
        coverUrl = publicUrl
      }

      const slug = form.name
        .toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      const payload = {
        name: form.name,
        slug,
        category: form.category,
        description: form.description || null,
        price: parseFloat(form.price),
        duration_min: parseInt(form.duration_min),
        max_capacity: parseInt(form.max_capacity),
        min_participants: parseInt(form.min_participants),
        location: form.location || null,
        meeting_point: form.meeting_point || null,
        difficulty: form.difficulty,
        age_min: parseInt(form.age_min),
        status: form.status,
        languages: form.languages,
        included: form.included ? form.included.split('\n').map(s => s.trim()).filter(Boolean) : null,
        not_included: form.not_included ? form.not_included.split('\n').map(s => s.trim()).filter(Boolean) : null,
        cover_url: coverUrl,
        operator_id: operatorId,
      }

      let expId = experience?.id

      if (isEdit) {
        const { error: updateError } = await supabase.from('experiences').update(payload).eq('id', expId)
        if (updateError) throw updateError
      } else {
        const { data, error: insertError } = await supabase.from('experiences').insert(payload).select().single()
        if (insertError) throw insertError
        expId = data.id
      }

      // Sync availability
      await supabase.from('availability').delete().eq('experience_id', expId)
      if (slots.length > 0) {
        const avRows = slots.map(s => ({
          experience_id: expId,
          day_of_week: s.day,
          start_time: s.time + ':00',
          active: true,
        }))
        const { error: avError } = await supabase.from('availability').insert(avRows)
        if (avError) throw avError
      }

      router.push('/dashboard/experiencias')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">

      {/* Foto de portada */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Foto de portada</label>
        <div
          onClick={() => fileRef.current?.click()}
          className="relative h-52 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 hover:border-sky-400 cursor-pointer transition-colors group bg-gray-50">
          {coverPreview ? (
            <>
              <Image src={coverPreview} alt="Portada" fill className="object-cover" sizes="672px" />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-bold text-sm">Cambiar foto</span>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 mb-2">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <p className="text-sm font-semibold">Haz clic para subir una foto</p>
              <p className="text-xs mt-1">JPG, PNG o WebP · Máx. 5MB</p>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
      </div>

      {/* Nombre */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Nombre de la experiencia *</label>
        <input
          type="text" required
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="Ej: Clase de surf para principiantes"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      {/* Categoría */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Categoría *</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CATEGORIES.map(c => (
            <button key={c.value} type="button"
              onClick={() => setForm(f => ({ ...f, category: c.value as import('@/lib/types').ExperienceCategory }))}
              className={`p-3 rounded-xl border-2 text-left transition-colors ${
                form.category === c.value
                  ? 'border-sky-500 bg-sky-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
              <p className="text-sm font-bold text-gray-900">{c.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{c.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Descripción</label>
        <textarea
          rows={4}
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          placeholder="Describe la experiencia, qué van a vivir los participantes, qué hace especial tu actividad..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
        />
      </div>

      {/* Precio y duración */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-bold text-gray-700 mb-2">Precio/persona (€) *</label>
          <input
            type="number" required min="1" step="0.01"
            value={form.price}
            onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
            placeholder="50"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Duración (min)</label>
          <input
            type="number" min="15"
            value={form.duration_min}
            onChange={e => setForm(f => ({ ...f, duration_min: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Máx. personas</label>
          <input
            type="number" min="1"
            value={form.max_capacity}
            onChange={e => setForm(f => ({ ...f, max_capacity: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Mín. personas</label>
          <input
            type="number" min="1"
            value={form.min_participants}
            onChange={e => setForm(f => ({ ...f, min_participants: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Ubicación */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Ubicación</label>
          <input
            type="text"
            value={form.location}
            onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
            placeholder="Ej: Playa de Corralejo"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Punto de encuentro</label>
          <input
            type="text"
            value={form.meeting_point}
            onChange={e => setForm(f => ({ ...f, meeting_point: e.target.value }))}
            placeholder="Ej: Parking del surf shop"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Incluido / No incluido */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Incluido <span className="font-normal text-gray-400">(uno por línea)</span></label>
          <textarea
            rows={4}
            value={form.included}
            onChange={e => setForm(f => ({ ...f, included: e.target.value }))}
            placeholder={"Tabla de surf\nTraje de neopreno\nInstructor certificado\nSeguro de accidentes"}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">No incluido <span className="font-normal text-gray-400">(uno por línea)</span></label>
          <textarea
            rows={4}
            value={form.not_included}
            onChange={e => setForm(f => ({ ...f, not_included: e.target.value }))}
            placeholder={"Transporte al punto de encuentro\nComida y bebida\nFotos y vídeos"}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
          />
        </div>
      </div>

      {/* Idiomas */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Idiomas disponibles</label>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(l => (
            <button key={l.value} type="button"
              onClick={() => toggleLanguage(l.value)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-colors ${
                form.languages.includes(l.value)
                  ? 'border-sky-500 bg-sky-50 text-sky-700'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}>
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Horarios disponibles */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-bold text-gray-700">Horarios disponibles</label>
          <button type="button" onClick={addSlot}
            className="text-xs text-sky-500 font-bold hover:underline flex items-center gap-1">
            + Añadir horario
          </button>
        </div>
        <div className="space-y-2">
          {slots.map((slot, i) => (
            <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
              <select
                value={slot.day}
                onChange={e => updateSlot(i, 'day', parseInt(e.target.value))}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500">
                {DAYS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
              <input
                type="time"
                value={slot.time}
                onChange={e => updateSlot(i, 'time', e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              {slots.length > 1 && (
                <button type="button" onClick={() => removeSlot(i)}
                  className="text-gray-300 hover:text-red-400 transition-colors ml-auto">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">Estos son los días y horas en los que los turistas podrán reservar.</p>
      </div>

      {/* Estado */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Estado</label>
        <div className="flex gap-3">
          {[
            { value: 'active', label: '✅ Activa', desc: 'Visible y reservable' },
            { value: 'paused', label: '⏸️ Pausada', desc: 'Visible pero sin reservas' },
            { value: 'draft', label: '📝 Borrador', desc: 'No visible al público' },
          ].map(s => (
            <button key={s.value} type="button"
              onClick={() => setForm(f => ({ ...f, status: s.value as import('@/lib/types').ExperienceStatus }))}
              className={`flex-1 p-3 rounded-xl border-2 text-left transition-colors ${
                form.status === s.value ? 'border-sky-500 bg-sky-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
              <p className="text-sm font-bold text-gray-900">{s.label}</p>
              <p className="text-xs text-gray-400">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => router.back()}
          className="flex-1 border border-gray-200 text-gray-600 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
        <button type="submit" disabled={loading}
          className="flex-1 bg-sky-500 text-white font-bold py-3.5 rounded-xl hover:bg-sky-400 transition-colors disabled:opacity-50">
          {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear experiencia →'}
        </button>
      </div>
    </form>
  )
}
