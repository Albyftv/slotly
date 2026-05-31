import { Resend } from 'resend'

function clean(v: string | undefined) {
  let s = (v ?? '').trim()
  while (s.charCodeAt(0) === 65279) s = s.slice(1)
  return s.trim()
}

let _resend: Resend | null = null
function getResend() {
  if (!_resend) _resend = new Resend(clean(process.env.RESEND_API_KEY))
  return _resend
}

const FROM = 'Slotly <onboarding@resend.dev>'

interface BookingEmailData {
  customerName: string
  customerEmail: string
  operatorName: string
  operatorEmail: string
  operatorPhone?: string | null
  experienceName: string
  bookingDate: string   // 'yyyy-MM-dd'
  startTime: string     // 'HH:mm:ss'
  participants: number
  totalAmount: number
  operatorAmount: number
  confirmationCode: string
  meetingPoint?: string | null
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function customerHtml(d: BookingEmailData) {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><title>Reserva confirmada</title></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- Header -->
        <tr><td style="text-align:center;padding-bottom:24px;">
          <span style="font-size:22px;font-weight:900;color:#111827;letter-spacing:-0.5px;">
            slot<span style="color:#0ea5e9;">ly</span>
          </span>
        </td></tr>

        <!-- Success card -->
        <tr><td style="background:#ffffff;border-radius:20px;border:1px solid #e5e7eb;overflow:hidden;">

          <!-- Green top bar -->
          <div style="background:#22c55e;height:6px;"></div>

          <div style="padding:32px;">
            <!-- Title -->
            <div style="text-align:center;margin-bottom:28px;">
              <div style="width:56px;height:56px;background:#dcfce7;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px;">
                <span style="font-size:24px;">✓</span>
              </div>
              <h1 style="margin:0;font-size:22px;font-weight:900;color:#111827;">¡Reserva confirmada!</h1>
              <p style="margin:6px 0 0;color:#6b7280;font-size:14px;">${d.experienceName}</p>
            </div>

            <!-- Details box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:14px;padding:20px;margin-bottom:20px;">
              <tr>
                <td style="padding:6px 0;font-size:13px;color:#6b7280;">Fecha</td>
                <td style="padding:6px 0;font-size:13px;font-weight:700;color:#111827;text-align:right;text-transform:capitalize;">${formatDate(d.bookingDate)}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-size:13px;color:#6b7280;">Hora</td>
                <td style="padding:6px 0;font-size:13px;font-weight:700;color:#111827;text-align:right;">${d.startTime.slice(0, 5)}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-size:13px;color:#6b7280;">Personas</td>
                <td style="padding:6px 0;font-size:13px;font-weight:700;color:#111827;text-align:right;">${d.participants}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-size:13px;color:#6b7280;">Organizador</td>
                <td style="padding:6px 0;font-size:13px;font-weight:700;color:#111827;text-align:right;">${d.operatorName}</td>
              </tr>
              <tr style="border-top:1px solid #e5e7eb;">
                <td style="padding:12px 0 6px;font-size:15px;font-weight:900;color:#111827;">Total pagado</td>
                <td style="padding:12px 0 6px;font-size:15px;font-weight:900;color:#111827;text-align:right;">${d.totalAmount.toFixed(2)}€</td>
              </tr>
            </table>

            <!-- Confirmation code -->
            <div style="background:#eff6ff;border-radius:14px;padding:16px;text-align:center;margin-bottom:20px;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Código de reserva</p>
              <p style="margin:0;font-size:20px;font-weight:900;color:#0369a1;letter-spacing:3px;font-family:monospace;">${d.confirmationCode}</p>
            </div>

            ${d.meetingPoint ? `
            <!-- Meeting point -->
            <div style="background:#f0fdf4;border-radius:14px;padding:16px;margin-bottom:20px;">
              <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#6b7280;">📍 Punto de encuentro</p>
              <p style="margin:0;font-size:13px;color:#374151;">${d.meetingPoint}</p>
            </div>
            ` : ''}

            <!-- Contact -->
            <div style="border-top:1px solid #f3f4f6;padding-top:20px;text-align:center;">
              <p style="margin:0 0 4px;font-size:13px;color:#6b7280;">¿Tienes dudas? Contacta con <strong style="color:#111827;">${d.operatorName}</strong></p>
              ${d.operatorPhone ? `<p style="margin:4px 0 0;font-size:13px;color:#0ea5e9;">${d.operatorPhone}</p>` : ''}
              <p style="margin:4px 0 0;font-size:12px;color:#9ca3af;">${d.operatorEmail}</p>
            </div>
          </div>
        </td></tr>

        <!-- Footer -->
        <tr><td style="text-align:center;padding:20px 0 0;">
          <p style="margin:0;font-size:11px;color:#9ca3af;">Reserva gestionada con <a href="https://slotly.es" style="color:#9ca3af;">slotly.es</a></p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function operatorHtml(d: BookingEmailData) {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><title>Nueva reserva</title></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <tr><td style="text-align:center;padding-bottom:24px;">
          <span style="font-size:22px;font-weight:900;color:#111827;">
            slot<span style="color:#0ea5e9;">ly</span>
          </span>
        </td></tr>

        <tr><td style="background:#ffffff;border-radius:20px;border:1px solid #e5e7eb;overflow:hidden;">
          <div style="background:#0ea5e9;height:6px;"></div>
          <div style="padding:32px;">
            <h1 style="margin:0 0 4px;font-size:20px;font-weight:900;color:#111827;">🎉 Nueva reserva confirmada</h1>
            <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">${d.experienceName}</p>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:14px;padding:20px;margin-bottom:20px;">
              <tr>
                <td style="padding:6px 0;font-size:13px;color:#6b7280;">Cliente</td>
                <td style="padding:6px 0;font-size:13px;font-weight:700;color:#111827;text-align:right;">${d.customerName}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-size:13px;color:#6b7280;">Email</td>
                <td style="padding:6px 0;font-size:13px;font-weight:700;color:#111827;text-align:right;">${d.customerEmail}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-size:13px;color:#6b7280;">Fecha</td>
                <td style="padding:6px 0;font-size:13px;font-weight:700;color:#111827;text-align:right;text-transform:capitalize;">${formatDate(d.bookingDate)}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-size:13px;color:#6b7280;">Hora</td>
                <td style="padding:6px 0;font-size:13px;font-weight:700;color:#111827;text-align:right;">${d.startTime.slice(0, 5)}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-size:13px;color:#6b7280;">Personas</td>
                <td style="padding:6px 0;font-size:13px;font-weight:700;color:#111827;text-align:right;">${d.participants}</td>
              </tr>
              <tr style="border-top:1px solid #e5e7eb;">
                <td style="padding:12px 0 6px;font-size:13px;color:#6b7280;">Total cobrado</td>
                <td style="padding:12px 0 6px;font-size:13px;font-weight:700;color:#111827;text-align:right;">${d.totalAmount.toFixed(2)}€</td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-size:14px;font-weight:900;color:#16a34a;">Para ti (98%)</td>
                <td style="padding:6px 0;font-size:14px;font-weight:900;color:#16a34a;text-align:right;">${d.operatorAmount.toFixed(2)}€</td>
              </tr>
            </table>

            <div style="background:#eff6ff;border-radius:14px;padding:14px;text-align:center;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Código de reserva</p>
              <p style="margin:0;font-size:18px;font-weight:900;color:#0369a1;letter-spacing:3px;font-family:monospace;">${d.confirmationCode}</p>
            </div>
          </div>
        </td></tr>

        <tr><td style="text-align:center;padding:20px 0 0;">
          <p style="margin:0;font-size:11px;color:#9ca3af;">Gestiona tus reservas en <a href="https://slotly.es/dashboard/reservas" style="color:#0ea5e9;">slotly.es/dashboard</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

interface CancellationEmailData {
  customerName: string
  customerEmail: string
  operatorName: string
  operatorEmail: string
  operatorPhone?: string | null
  experienceName: string
  bookingDate: string
  startTime: string
  participants: number
  totalAmount: number
  confirmationCode: string
}

function cancellationHtml(d: CancellationEmailData) {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><title>Reserva cancelada</title></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <tr><td style="text-align:center;padding-bottom:24px;">
          <span style="font-size:22px;font-weight:900;color:#111827;letter-spacing:-0.5px;">
            slot<span style="color:#0ea5e9;">ly</span>
          </span>
        </td></tr>

        <tr><td style="background:#ffffff;border-radius:20px;border:1px solid #e5e7eb;overflow:hidden;">
          <div style="background:#ef4444;height:6px;"></div>
          <div style="padding:32px;">
            <div style="text-align:center;margin-bottom:28px;">
              <div style="width:56px;height:56px;background:#fee2e2;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px;">
                <span style="font-size:24px;">✕</span>
              </div>
              <h1 style="margin:0;font-size:22px;font-weight:900;color:#111827;">Reserva cancelada</h1>
              <p style="margin:6px 0 0;color:#6b7280;font-size:14px;">${d.experienceName}</p>
            </div>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:14px;padding:20px;margin-bottom:20px;">
              <tr>
                <td style="padding:6px 0;font-size:13px;color:#6b7280;">Fecha</td>
                <td style="padding:6px 0;font-size:13px;font-weight:700;color:#111827;text-align:right;text-transform:capitalize;">${formatDate(d.bookingDate)}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-size:13px;color:#6b7280;">Hora</td>
                <td style="padding:6px 0;font-size:13px;font-weight:700;color:#111827;text-align:right;">${d.startTime.slice(0, 5)}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-size:13px;color:#6b7280;">Personas</td>
                <td style="padding:6px 0;font-size:13px;font-weight:700;color:#111827;text-align:right;">${d.participants}</td>
              </tr>
              <tr style="border-top:1px solid #e5e7eb;">
                <td style="padding:12px 0 6px;font-size:13px;color:#6b7280;">Código de reserva</td>
                <td style="padding:12px 0 6px;font-size:13px;font-weight:700;color:#6b7280;text-align:right;font-family:monospace;">${d.confirmationCode}</td>
              </tr>
            </table>

            <div style="background:#fef2f2;border-radius:14px;padding:16px;margin-bottom:20px;">
              <p style="margin:0;font-size:14px;color:#b91c1c;">
                Tu reserva ha sido cancelada por el organizador. Si realizaste un pago, el reembolso se procesará en 5-10 días hábiles según tu entidad bancaria.
              </p>
            </div>

            <div style="border-top:1px solid #f3f4f6;padding-top:20px;text-align:center;">
              <p style="margin:0 0 4px;font-size:13px;color:#6b7280;">¿Tienes dudas? Contacta con <strong style="color:#111827;">${d.operatorName}</strong></p>
              ${d.operatorPhone ? `<p style="margin:4px 0 0;font-size:13px;color:#0ea5e9;">${d.operatorPhone}</p>` : ''}
              <p style="margin:4px 0 0;font-size:12px;color:#9ca3af;">${d.operatorEmail}</p>
            </div>
          </div>
        </td></tr>

        <tr><td style="text-align:center;padding:20px 0 0;">
          <p style="margin:0;font-size:11px;color:#9ca3af;">Reserva gestionada con <a href="https://slotly.es" style="color:#9ca3af;">slotly.es</a></p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function sendCancellationEmail(d: CancellationEmailData) {
  const resend = getResend()
  await resend.emails.send({
    from: FROM,
    to: d.customerEmail,
    subject: `Reserva cancelada · ${d.experienceName} · ${d.confirmationCode}`,
    html: cancellationHtml(d),
  })
}

export async function sendBookingConfirmationEmails(d: BookingEmailData) {
  const resend = getResend()

  await Promise.all([
    resend.emails.send({
      from: FROM,
      to: d.customerEmail,
      subject: `✅ Reserva confirmada · ${d.experienceName}`,
      html: customerHtml(d),
    }),
    resend.emails.send({
      from: FROM,
      to: d.operatorEmail,
      subject: `🎉 Nueva reserva · ${d.experienceName} · ${d.confirmationCode}`,
      html: operatorHtml(d),
    }),
  ])
}
