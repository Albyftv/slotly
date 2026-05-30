'use client'

interface MonthData {
  label: string
  amount: number
}

export default function RevenueChart({ months }: { months: MonthData[] }) {
  const max = Math.max(...months.map(m => m.amount), 1)
  const chartHeight = 80

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h2 className="font-bold text-gray-900 mb-5">Ingresos últimos 6 meses</h2>
      <div className="flex items-end gap-2 h-24">
        {months.map((m, i) => {
          const barH = Math.max((m.amount / max) * chartHeight, m.amount > 0 ? 4 : 2)
          const isLast = i === months.length - 1
          return (
            <div key={m.label} className="flex-1 flex flex-col items-center gap-1 group">
              <span className="text-xs font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {m.amount.toFixed(0)}€
              </span>
              <div className="w-full flex items-end justify-center" style={{ height: chartHeight }}>
                <div
                  className={`w-full rounded-t-lg transition-all duration-300 ${isLast ? 'bg-sky-500' : 'bg-gray-200 group-hover:bg-sky-300'}`}
                  style={{ height: barH }}
                />
              </div>
              <span className={`text-xs font-semibold ${isLast ? 'text-sky-600' : 'text-gray-400'}`}>
                {m.label}
              </span>
            </div>
          )
        })}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-50 flex justify-between text-xs text-gray-400">
        <span>Total 6 meses: <span className="font-bold text-gray-700">{months.reduce((s, m) => s + m.amount, 0).toFixed(0)}€</span></span>
        <span>Neto después de comisión Slotly</span>
      </div>
    </div>
  )
}
