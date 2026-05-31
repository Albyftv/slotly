export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

function clean(v: string | undefined) {
  let s = (v ?? '').trim()
  while (s.charCodeAt(0) === 65279) s = s.slice(1)
  return s.trim()
}

export async function POST(req: NextRequest) {
  const { name, phone, business_type, message } = await req.json()

  if (!name?.trim() || !phone?.trim() || !business_type?.trim()) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
  }

  try {
    const resend = new Resend(clean(process.env.RESEND_API_KEY))

    await resend.emails.send({
      from: 'Slotly <onboarding@resend.dev>',
      to: 'albyftv@gmail.com',
      subject: `🔔 Nuevo lead: ${name} — ${business_type}`,
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 16px;">
          <div style="background: #0ea5e9; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 20px;">🎉 Nuevo operador interesado</h1>
          </div>

          <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 16px; border: 1px solid #e2e8f0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #94a3b8; font-size: 12px; font-weight: bold; text-transform: uppercase; width: 40%;">Nombre</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${name}</td></tr>
              <tr><td style="padding: 8px 0; color: #94a3b8; font-size: 12px; font-weight: bold; text-transform: uppercase;">Teléfono</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${phone}</td></tr>
              <tr><td style="padding: 8px 0; color: #94a3b8; font-size: 12px; font-weight: bold; text-transform: uppercase;">Negocio</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${business_type}</td></tr>
              ${message ? `<tr><td style="padding: 8px 0; color: #94a3b8; font-size: 12px; font-weight: bold; text-transform: uppercase; vertical-align: top;">Mensaje</td><td style="padding: 8px 0; color: #0f172a;">${message}</td></tr>` : ''}
            </table>
          </div>

          <a href="https://wa.me/${phone.replace(/\D/g, '')}" style="display: block; background: #25d366; color: white; text-align: center; padding: 14px; border-radius: 12px; text-decoration: none; font-weight: 800; font-size: 15px;">
            📱 Contactar por WhatsApp
          </a>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Contact email error:', error)
    return NextResponse.json({ error: 'Error al enviar' }, { status: 500 })
  }
}
