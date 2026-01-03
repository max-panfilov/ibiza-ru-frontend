// src/data/clubs.ts

import type { PlaceEntity } from '../types'

export const clubs: PlaceEntity[] = [
  {
    kind: 'club',
    code: 'neon-arena',
    title: 'Neon Arena',
    summary: 'Большая площадка, лайнап топ‑диджеев и мощный звук.',
    coverImage: '/placeholder.jpg',
    location: 'Ibiza Town',
    priceLevel: '€€€€',
  },
  {
    kind: 'club',
    code: 'underground-room',
    title: 'Underground Room',
    summary: 'Андеграундная сцена, близкий контакт с музыкой и людьми.',
    coverImage: '/placeholder.jpg',
    location: 'Outskirts',
    priceLevel: '€€€',
  },
  {
    kind: 'club',
    code: 'beach-dance',
    title: 'Beach Dance',
    summary: 'Танцы у моря и вечеринки до рассвета.',
    coverImage: '/placeholder.jpg',
    location: 'San Antonio',
    priceLevel: '€€€',
  },
]