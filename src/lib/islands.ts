export const ISLANDS = {
  fuerteventura: {
    name: 'Fuerteventura',
    cities: ['Corralejo', 'Puerto del Rosario', 'Morro Jable', 'Costa Calma', 'Pájara', 'Gran Tarajal', 'El Cotillo', 'Antigua'],
    description: 'El paraíso del wind y kitesurf en el Atlántico',
    emoji: '🏄',
    heroImg: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1400&q=80',
  },
  tenerife: {
    name: 'Tenerife',
    cities: ['Santa Cruz de Tenerife', 'Puerto de la Cruz', 'Los Gigantes', 'Costa Adeje', 'Los Cristianos', 'La Orotava', 'Adeje', 'Arona', 'Playa de las Américas'],
    description: 'Aventuras al pie del Teide',
    emoji: '🌋',
    heroImg: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=1400&q=80',
  },
  'gran-canaria': {
    name: 'Gran Canaria',
    cities: ['Las Palmas de Gran Canaria', 'Maspalomas', 'Puerto de Mogán', 'Arguineguín', 'Playa del Inglés', 'San Agustín'],
    description: 'Del océano a las dunas en un solo día',
    emoji: '🌊',
    heroImg: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1400&q=80',
  },
  lanzarote: {
    name: 'Lanzarote',
    cities: ['Arrecife', 'Puerto del Carmen', 'Costa Teguise', 'Playa Blanca', 'Puerto Calero', 'Tías'],
    description: 'Volcanes, vientos y surf atlántico',
    emoji: '🌋',
    heroImg: 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=1400&q=80',
  },
  'la-palma': {
    name: 'La Palma',
    cities: ['Santa Cruz de La Palma', 'Los Llanos de Aridane', 'Tazacorte', 'Puerto Naos'],
    description: 'La isla bonita: senderismo y estrellas',
    emoji: '⭐',
    heroImg: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1400&q=80',
  },
} as const

export type IslandSlug = keyof typeof ISLANDS
export const ISLAND_SLUGS = Object.keys(ISLANDS) as IslandSlug[]
