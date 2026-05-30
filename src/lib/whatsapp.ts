/**
 * Envía una notificación WhatsApp al operador usando CallMeBot (gratuito).
 *
 * Activación (una sola vez por operador):
 *   1. El operador envía "I allow callmebot to send me messages" al +34 644 55 17 36 en WhatsApp
 *   2. Recibe su API key por WhatsApp
 *   3. La guarda en su perfil de Slotly
 *
 * Docs: https://www.callmebot.com/blog/free-api-whatsapp-messages/
 */
export async function sendWhatsAppNotification({
  phone,
  apiKey,
  message,
}: {
  phone: string
  apiKey: string
  message: string
}): Promise<void> {
  const cleanPhone = phone.replace(/\s+/g, '').replace(/^\+/, '')
  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(cleanPhone)}&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(apiKey)}`
  const res = await fetch(url)
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`CallMeBot error ${res.status}: ${body.slice(0, 200)}`)
  }
}

export function buildBookingMessage({
  experienceName,
  customerName,
  bookingDate,
  startTime,
  participants,
  totalAmount,
  confirmationCode,
}: {
  experienceName: string
  customerName: string
  bookingDate: string
  startTime: string
  participants: number
  totalAmount: number
  confirmationCode: string
}): string {
  const date = new Date(bookingDate + 'T00:00:00').toLocaleDateString('es', {
    weekday: 'short', day: 'numeric', month: 'short',
  })
  return [
    `🎉 *Nueva reserva confirmada*`,
    ``,
    `📋 *${experienceName}*`,
    `👤 ${customerName}`,
    `📅 ${date} · ${startTime.slice(0, 5)}`,
    `👥 ${participants} persona${participants !== 1 ? 's' : ''}`,
    `💰 ${totalAmount.toFixed(0)}€`,
    `🔖 Código: ${confirmationCode}`,
  ].join('\n')
}
