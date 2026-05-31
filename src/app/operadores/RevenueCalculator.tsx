'use client'
import { useState } from 'react'

export default function RevenueCalculator() {
  const [bookings, setBookings] = useState(20)
  const [price, setPrice] = useState(60)

  const gross = bookings * price
  const slotlyFee = gross * 0.02
  const net = gross - slotlyFee
  const yearly = net * 12

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8 max-w-xl mx-auto">
      <h3 className="text-xl font-black text-gray-900 mb-6 text-center">Calcula tus ingresos</h3>

      <div className="space-y-6 mb-8">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-bold text-gray-700">Reservas al mes</label>
            <span className="text-sky-500 font-black text-lg">{bookings}</span>
          </div>
          <input
            type="range" min={5} max={150} step={5} value={bookings}
            onChange={e => setBookings(Number(e.target.value))}
            className="w-full accent-sky-500 h-2 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-300 mt-1">
            <span>5</span><span>150</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-bold text-gray-700">Precio medio por reserva</label>
            <span className="text-sky-500 font-black text-lg">{price}€</span>
          </div>
          <input
            type="range" min={20} max={300} step={5} value={price}
            onChange={e => setPrice(Number(e.target.value))}
            className="w-full accent-sky-500 h-2 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-300 mt-1">
            <span>20€</span><span>300€</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl p-6 text-white">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sky-200 text-xs font-bold mb-1">INGRESOS BRUTOS</p>
            <p className="text-2xl font-black">{gross.toLocaleString('es-ES')}€</p>
          </div>
          <div>
            <p className="text-sky-200 text-xs font-bold mb-1">COMISIÓN SLOTLY (2%)</p>
            <p className="text-2xl font-black text-sky-200">{slotlyFee.toLocaleString('es-ES', { maximumFractionDigits: 0 })}€</p>
          </div>
        </div>
        <div className="border-t border-sky-400 pt-4">
          <p className="text-sky-200 text-xs font-bold mb-1">PARA TI AL MES</p>
          <p className="text-4xl font-black">{net.toLocaleString('es-ES', { maximumFractionDigits: 0 })}€</p>
          <p className="text-sky-200 text-sm mt-1">{yearly.toLocaleString('es-ES', { maximumFractionDigits: 0 })}€ al año</p>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-4">No incluye suscripción mensual de 19€ · Stripe cobra ~1.4% adicional por transacción</p>
    </div>
  )
}
