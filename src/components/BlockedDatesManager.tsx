'use client'

import { useState, useMemo } from 'react'
import { addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval,
         getDay, format, isBefore, startOfDay } from 'date-fns'
import { es } from 'date-fns/locale'

interface BlockedDate {
  id: string
  blocked_date: string
  reason?: string | null
}

interface Props {
  experienceId: string
  initialBlocked: BlockedDate[]
}

const DOW_LABELS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do']

export default function BlockedDatesManager({ experienceId, initialBlocked }: Props) {
  const [blocked, setBlocked] = useState<BlockedDate[]>(initialBlocked)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [loading, setLoading] = useState<string | null>(null) // date string being toggled

  const today = startOfDay(new Date())

  const { allDays, offset } = useMemo(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    const allDays = eachDayOfInterval({ start, end })
    const firstDow = getDay(start)
    const offsetVal = firstDow === 0 ? 6 : firstDow - 1
    return { allDays, offset: offsetVal }
  }, [currentMonth])

  const blockedMap = useMemo(() => {
    const m = new Map<string, BlockedDate>()
    for (const b of blocked) m.set(b.blocked_date, b)
    return m
  }, [blocked])

  async function toggleDate(date: Date) {
    const dateStr = format(date, 'yyyy-MM-dd')
    if (isBefore(date, today)) return
    const existing = blockedMap.get(dateStr)
    setLoading(dateStr)

    if (existing) {
      // Desbloquear
      const res = await fetch(`/api/blocked-dates?id=${existing.id}`, { method: 'DELETE' })
      if (res.ok) {
        setBlocked(prev => prev.filter(b => b.id !== existing.id))
      }
    } else {
      // Bloquear
      const res = await fetch('/api/blocked-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experience_id: experienceId, blocked_date: dateStr }),
      })
      if (res.ok) {
        const data = await res.json()
        setBlocked(prev => [...prev, data])
      }
    }
    setLoading(null)
  }

  const monthLabel = format(currentMonth, 'MMMM yyyy', { locale: es })

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
      <div className="mb-4">
        <h3 className="font-bold text-gray-900">Fechas bloqueadas</h3>
        <p className="text-xs text-gray-400 mt-1">
          Haz clic en un día para bloquearlo. Los clientes no podrán reservar en fechas bloqueadas.
        </p>
      </div>

      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(m => subMonths(m, 1))}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-500">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <span className="text-sm font-bold text-gray-800 capitalize">{monthLabel}</span>
        <button
          onClick={() => setCurrentMonth(m => addMonths(m, 1))}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-500">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

      {/* DOW headers */}
      <div className="grid grid-cols-7 mb-1">
        {DOW_LABELS.map(d => (
          <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: offset }).map((_, i) => <div key={`e-${i}`} />)}
        {allDays.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const isPast = isBefore(day, today)
          const isBlocked = blockedMap.has(dateStr)
          const isLoading = loading === dateStr

          return (
            <button
              key={dateStr}
              onClick={() => toggleDate(day)}
              disabled={isPast || isLoading}
              className={`
                aspect-square rounded-lg text-xs font-semibold transition-all
                ${isPast ? 'text-gray-200 cursor-default' : ''}
                ${!isPast && isBlocked ? 'bg-red-500 text-white hover:bg-red-400' : ''}
                ${!isPast && !isBlocked ? 'hover:bg-gray-100 text-gray-700' : ''}
                ${isLoading ? 'opacity-50' : ''}
              `}
            >
              {isLoading ? '·' : format(day, 'd')}
            </button>
          )
        })}
      </div>

      {/* Lista de fechas bloqueadas */}
      {blocked.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-50">
          <p className="text-xs font-semibold text-gray-400 mb-2">Días bloqueados ({blocked.length})</p>
          <div className="flex flex-wrap gap-2">
            {blocked
              .slice()
              .sort((a, b) => a.blocked_date.localeCompare(b.blocked_date))
              .map(b => (
                <span key={b.id} className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {format(new Date(b.blocked_date + 'T00:00:00'), 'd MMM', { locale: es })}
                  <button
                    onClick={async () => {
                      setLoading(b.blocked_date)
                      const res = await fetch(`/api/blocked-dates?id=${b.id}`, { method: 'DELETE' })
                      if (res.ok) setBlocked(prev => prev.filter(x => x.id !== b.id))
                      setLoading(null)
                    }}
                    className="ml-0.5 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              ))
            }
          </div>
        </div>
      )}
    </div>
  )
}
