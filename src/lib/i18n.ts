export type Lang = 'es' | 'en' | 'de' | 'fr'
export const SUPPORTED_LANGS: Lang[] = ['es', 'en', 'de', 'fr']

export const LANG_LABELS: Record<Lang, string> = { es: 'ES', en: 'EN', de: 'DE', fr: 'FR' }
export const LANG_FLAGS: Record<Lang, string>  = { es: '🇪🇸', en: '🇬🇧', de: '🇩🇪', fr: '🇫🇷' }

export interface T {
  back: string
  about: string
  included: string
  notIncluded: string
  meetingPoint: string
  organizedBy: string
  call: string
  max: string
  changeDate: string
  participants: string
  person: string
  persons: string
  noCharge: string
  chooseDateTime: string
  book: string
  yourDetails: string
  fullName: string
  phone: string
  notes: string
  processing: string
  pay: string
  securePay: string
  confirmed: string
  confirmationSent: string
  timesFor: string
  summaryDate: string
  summaryTime: string
  summaryPeople: string
  summaryTotal: string
  days: string[]
}

const translations: Record<Lang, T> = {
  es: {
    back: 'Volver',
    about: 'Sobre esta experiencia',
    included: '✅ Incluido',
    notIncluded: '❌ No incluido',
    meetingPoint: 'Punto de encuentro',
    organizedBy: 'Organizado por',
    call: 'Llamar',
    max: 'Máx.',
    changeDate: '← Cambiar fecha',
    participants: 'Participantes',
    person: 'persona',
    persons: 'personas',
    noCharge: 'Sin cargos hasta confirmar el pago',
    chooseDateTime: 'Elige fecha y horario',
    book: 'Reservar',
    yourDetails: 'Tus datos',
    fullName: 'Nombre completo *',
    phone: 'Teléfono (opcional)',
    notes: 'Notas o peticiones especiales (opcional)',
    processing: 'Procesando...',
    pay: 'Pagar',
    securePay: 'Pago seguro con Stripe · SSL',
    confirmed: '¡Reserva confirmada!',
    confirmationSent: 'Te hemos enviado un email de confirmación con todos los detalles.',
    timesFor: 'Horarios',
    summaryDate: 'Fecha',
    summaryTime: 'Hora',
    summaryPeople: 'Personas',
    summaryTotal: 'Total',
    days: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'],
  },
  en: {
    back: 'Back',
    about: 'About this experience',
    included: '✅ Included',
    notIncluded: '❌ Not included',
    meetingPoint: 'Meeting point',
    organizedBy: 'Organized by',
    call: 'Call',
    max: 'Max.',
    changeDate: '← Change date',
    participants: 'Participants',
    person: 'person',
    persons: 'people',
    noCharge: 'No charge until payment confirmed',
    chooseDateTime: 'Choose date and time',
    book: 'Book',
    yourDetails: 'Your details',
    fullName: 'Full name *',
    phone: 'Phone (optional)',
    notes: 'Notes or special requests (optional)',
    processing: 'Processing...',
    pay: 'Pay',
    securePay: 'Secure payment with Stripe · SSL',
    confirmed: 'Booking confirmed!',
    confirmationSent: "We've sent you a confirmation email with all the details.",
    timesFor: 'Available times',
    summaryDate: 'Date',
    summaryTime: 'Time',
    summaryPeople: 'People',
    summaryTotal: 'Total',
    days: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
  },
  de: {
    back: 'Zurück',
    about: 'Über dieses Erlebnis',
    included: '✅ Inbegriffen',
    notIncluded: '❌ Nicht inbegriffen',
    meetingPoint: 'Treffpunkt',
    organizedBy: 'Organisiert von',
    call: 'Anrufen',
    max: 'Max.',
    changeDate: '← Datum ändern',
    participants: 'Teilnehmer',
    person: 'Person',
    persons: 'Personen',
    noCharge: 'Keine Gebühr bis zur Zahlungsbestätigung',
    chooseDateTime: 'Datum und Uhrzeit wählen',
    book: 'Buchen',
    yourDetails: 'Ihre Daten',
    fullName: 'Vollständiger Name *',
    phone: 'Telefon (optional)',
    notes: 'Anmerkungen oder Sonderwünsche (optional)',
    processing: 'Wird bearbeitet...',
    pay: 'Bezahlen',
    securePay: 'Sichere Zahlung mit Stripe · SSL',
    confirmed: 'Buchung bestätigt!',
    confirmationSent: 'Wir haben Ihnen eine Bestätigungs-E-Mail mit allen Details gesendet.',
    timesFor: 'Verfügbare Zeiten',
    summaryDate: 'Datum',
    summaryTime: 'Uhrzeit',
    summaryPeople: 'Personen',
    summaryTotal: 'Gesamt',
    days: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
  },
  fr: {
    back: 'Retour',
    about: 'À propos de cette expérience',
    included: '✅ Inclus',
    notIncluded: '❌ Non inclus',
    meetingPoint: 'Point de rendez-vous',
    organizedBy: 'Organisé par',
    call: 'Appeler',
    max: 'Max.',
    changeDate: '← Changer la date',
    participants: 'Participants',
    person: 'personne',
    persons: 'personnes',
    noCharge: "Aucun frais jusqu'à confirmation du paiement",
    chooseDateTime: "Choisir la date et l'heure",
    book: 'Réserver',
    yourDetails: 'Vos coordonnées',
    fullName: 'Nom complet *',
    phone: 'Téléphone (facultatif)',
    notes: 'Notes ou demandes spéciales (facultatif)',
    processing: 'Traitement...',
    pay: 'Payer',
    securePay: 'Paiement sécurisé avec Stripe · SSL',
    confirmed: 'Réservation confirmée !',
    confirmationSent: 'Nous vous avons envoyé un e-mail de confirmation avec tous les détails.',
    timesFor: 'Horaires disponibles',
    summaryDate: 'Date',
    summaryTime: 'Heure',
    summaryPeople: 'Personnes',
    summaryTotal: 'Total',
    days: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
  },
}

export function getT(lang: Lang): T {
  return translations[lang] ?? translations.es
}

export function parseLang(raw: string | undefined | null): Lang {
  if (raw && (SUPPORTED_LANGS as string[]).includes(raw)) return raw as Lang
  return 'es'
}
