import Stripe from 'stripe'

function clean(v: string | undefined) {
  let s = (v ?? '').trim()
  while (s.charCodeAt(0) === 65279) s = s.slice(1)
  return s.trim()
}

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(clean(process.env.STRIPE_SECRET_KEY), {
      apiVersion: '2026-04-22.dahlia',
    })
  }
  return _stripe
}

export const PLANS = {
  basic: {
    name: 'Basic',
    price: 19,
    priceId: clean(process.env.STRIPE_PRICE_BASIC),
    maxExperiences: 3,
  },
  pro: {
    name: 'Pro',
    price: 39,
    priceId: clean(process.env.STRIPE_PRICE_PRO),
    maxExperiences: Infinity,
  },
} as const

export const PLATFORM_FEE_PERCENT = 2
