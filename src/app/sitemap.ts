import { MetadataRoute } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import { ISLAND_SLUGS } from '@/lib/islands'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://slotly-zeta.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServiceClient()

  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: APP_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${APP_URL}/precios`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    ...ISLAND_SLUGS.map(isla => ({
      url: `${APP_URL}/destinos/${isla}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    })),
  ]

  // Operator pages
  const { data: operators } = await supabase
    .from('operators')
    .select('slug, updated_at')

  const operatorRoutes: MetadataRoute.Sitemap = (operators ?? []).map(op => ({
    url: `${APP_URL}/${op.slug}`,
    lastModified: new Date(op.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Experience pages
  const { data: experiences } = await supabase
    .from('experiences')
    .select('slug, updated_at, operator:operators(slug)')
    .eq('status', 'active')

  const experienceRoutes: MetadataRoute.Sitemap = (experiences ?? [])
    .filter(exp => exp.operator)
    .map(exp => {
      const op = exp.operator as unknown as { slug: string }
      return {
        url: `${APP_URL}/${op.slug}/${exp.slug}`,
        lastModified: new Date(exp.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      }
    })

  return [...staticRoutes, ...operatorRoutes, ...experienceRoutes]
}
