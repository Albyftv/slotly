'use client'

import { useState, useMemo } from 'react'
import { addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval,
         getDay, format, isBefore, isToday, isSameDay, startOfDay } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Experience, Availability } from '@/lib/types'

interface Props {
  experience: Experience & { availability: Availability[] }
  blockedDates: string[]
}

type Step = 'calendar' | 'checkout' | 'success'

export default function BookingWidget({ experience: exp, blockedDates }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [participants, setParticipants] = useState(1)
  const [step, setStep] = useState<Step>('calendar')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' })

  const today = startOfDay(new Date())
  const availableDaysOfWeek = new Set((exp.availability ?? []).filter(a => a.active).map(a => a.day_of_week))
  const blockedSet = new Set(blockedDates)

  // Days in the current month grid
  const days = useMemo(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    const allDays = eachDayOfInterval({ start, end })
    const firstDow = getDay(start) // 0=Sun
    const offset = firstDow === 0 ? 6 : firstDow - 1 // Monday-first
    return { allDays, offset }
  }, [currentMonth])

  function isDateAvailable(date: Date) {
    if (isBefore(date, today)) return false
    const dow = getDay(date) // 0=Sun
    if (!availableDaysOfWeek.has(dow)) return false
    if (blockedSet.has(format(date, 'yyyy-MM-dd'))) return false
    return true
  }

  // Time slots for selected date
  const timeSlotsForDay = useMemo(() => {
    if (!selectedDate) return []
    const dow = getDay(selectedDate)
    return (exp.availability ?? [])
      .filter(a => a.active && a.day_of_week === dow)
      .map(a => a.start_time.slice(0, 5))
      .sort()
  }, [selectedDate, exp.availability])

  const total = exp.price * participants

  async function handleBooking(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedDate || !selectedTime) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experience_id: exp.id,
          operator_id: exp.operator_id,
          booking_date: format(selectedDate, 'yyyy-MM-dd'),
          start_time: selectedTime,
          participants,
          unit_price: exp.price,
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone || null,
          special_requests: form.notes || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error al procesar la reserva')
      if (data.url) {
        window.location.href = data.url
      } else {
        setStep('success')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'success') {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" className="w-8 h-8">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3 className="text-xl font-black text-gray-900 mb-2">¡Reserva confirmada!</h3>
        <p className="text-gray-500 text-sm">Te hemos enviado un email de confirmación con todos los detalles.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
      {/* Price header */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-3xl font-black text-gray-900">{exp.price}€<span className="text-base font-normal text-gray-400">/persona</span></p>
        </div>
        {step === 'checkout' && (
          <button onClick={() => { setStep('calendar'); setError('') }}
            className="text-sm text-sky-500 font-semibold hover:underline">
            ← Cambiar fecha
          </button>
        )}
      </div>

      {step === 'calendar' && (
        <div className="p-5 space-y-5">
          {/* Calendar */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setCurrentMonth(m => subMonths(m, 1))}
                disabled={isBefore(endOfMonth(subMonths(currentMonth, 1)), today)}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              <p className="text-sm font-bold text-gray-900 capitalize">
                {format(currentMonth, 'MMMM yyyy', { locale: es })}
              </p>
              <button onClick={() => setCurrentMonth(m => addMonths(m, 1))}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
              {['Lu','Ma','Mi','Ju','Vi','Sá','Do'].map(d => (
                <div key={d} className="text-center text-xs font-bold text-gray-400 py-1">{d}</div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({ length: days.offset }).map((_, i) => <div key={`empty-${i}`} />)}
              {days.allDays.map(date => {
                const available = isDateAvailable(date)
                const selected = selectedDate && isSameDay(date, selectedDate)
                const past = isBefore(date, today)
                const todayDate = isToday(date)
                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    disabled={!available}
                    onClick={() => { setSelectedDate(date); setSelectedTime(null) }}
                    className={`
                      aspect-square rounded-xl text-sm font-semibold transition-all
                      ${selected ? 'bg-sky-500 text-white shadow-md shadow-sky-200' :
                        available ? 'hover:bg-sky-50 text-gray-800 cursor-pointer' :
                        past ? 'text-gray-200 cursor-not-allowed' :
                        'text-gray-300 cursor-not-allowed'}
                      ${todayDate && !selected ? 'ring-2 ring-sky-300 ring-inset' : ''}
                    `}>
                    {format(date, 'd')}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Time slots */}
          {selectedDate && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Horarios · {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {timeSlotsForDay.map(time => (
                  <button key={time} type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                      selectedTime === time
                        ? 'border-sky-500 bg-sky-500 text-white shadow-md'
                        : 'border-gray-200 text-gray-700 hover:border-sky-300'
                    }`}>
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Participants */}
          {selectedTime && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Participantes</p>
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                <button type="button"
                  onClick={() => setParticipants(p => Math.max(exp.min_participants, p - 1))}
                  disabled={participants <= exp.min_participants}
                  className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center font-bold text-gray-700 disabled:opacity-40 hover:bg-gray-50 transition-colors">
                  −
                </button>
                <div className="text-center">
                  <p className="text-xl font-black text-gray-900">{participants}</p>
                  <p className="text-xs text-gray-400">persona{participants !== 1 ? 's' : ''}</p>
                </div>
                <button type="button"
                  onClick={() => setParticipants(p => Math.min(exp.max_capacity, p + 1))}
                  disabled={participants >= exp.max_capacity}
                  className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center font-bold text-gray-700 disabled:opacity-40 hover:bg-gray-50 transition-colors">
                  +
                </button>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="pt-1">
            {selectedDate && selectedTime && (
              <div className="flex justify-between items-center text-sm mb-3">
                <span className="text-gray-500">{exp.price}€ × {participants}</span>
                <span className="font-black text-gray-900 text-lg">{total.toFixed(2)}€</span>
              </div>
            )}
            <button
              type="button"
              disabled={!selectedDate || !selectedTime}
              onClick={() => setStep('checkout')}
              className="w-full bg-sky-500 text-white font-black py-4 rounded-2xl text-base hover:bg-sky-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-sky-200">
              {selectedDate && selectedTime ? `Reservar · ${total.toFixed(2)}€` : 'Elige fecha y horario'}
            </button>
            <p className="text-center text-xs text-gray-400 mt-2">Sin cargos hasta confirmar el pago</p>
          </div>
        </div>
      )}

      {step === 'checkout' && (
        <form onSubmit={handleBooking} className="p-5 space-y-4">
          {/* Summary */}
          <div className="bg-sky-50 rounded-2xl p-4 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Fecha</span>
              <span className="font-semibold text-gray-800 capitalize">
                {selectedDate && format(selectedDate, "EEEE d MMM", { locale: es })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Hora</span>
              <span className="font-semibold text-gray-800">{selectedTime}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Personas</span>
              <span className="font-semibold text-gray-800">{participants}</span>
            </div>
            <div className="border-t border-sky-200 pt-1.5 flex justify-between">
              <span className="font-black text-gray-900">Total</span>
              <span className="font-black text-gray-900">{total.toFixed(2)}€</span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Tus datos</p>
            <div className="space-y-3">
              <input required type="text" placeholder="Nombre completo *"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              <input required type="email" placeholder="Email *"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              <input type="tel" placeholder="Teléfono (opcional)"
                value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              <textarea rows={2} placeholder="Notas o peticiones especiales (opcional)"
                value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none" />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-sky-500 text-white font-black py-4 rounded-2xl text-base hover:bg-sky-400 transition-colors disabled:opacity-50 shadow-lg shadow-sky-200">
            {loading ? 'Procesando...' : `Pagar ${total.toFixed(2)}€ →`}
          </button>
          <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Pago seguro con Stripe · SSL
          </p>
        </form>
      )}
    </div>
  )
}
