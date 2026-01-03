// src/data/restaurants.ts

import type { PlaceEntity } from '../types'

export const restaurants: PlaceEntity[] = [
  {
    kind: 'restaurant',
    code: 'seafood-terrace',
    title: 'Seafood Terrace',
    summary: 'Свежие морепродукты и панорамный вид на море.',
    coverImage: '/placeholder.jpg',

    location: 'Ibiza Town',
    address: 'Harbor View, 2, Ibiza Town',
    phone: '+34 600 100 001',
    website: 'https://example.com',

    rating: 4.6,
    priceLevel: '€€€',
    openingHours: 'Ежедневно 12:00–00:00',

    tags: ['Морепродукты', 'Вид на море', 'Коктейли'],
    galleryImages: ['/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg'],
  },
  {
    kind: 'restaurant',
    code: 'tapas-local',
    title: 'Tapas Local',
    summary: 'Аутентичные тапас и локальные вина.',
    coverImage: '/placeholder.jpg',

    location: 'Santa Eulària',
    address: 'Plaça Local, 7, Santa Eulària',

    rating: 4.2,
    priceLevel: '€€',
    openingHours: 'Вт–Вс 13:00–23:00',

    tags: ['Тапас', 'Вино', 'Локальная кухня'],
    galleryImages: ['/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg'],
  },
  {
    kind: 'restaurant',
    code: 'sunset-grill',
    title: 'Sunset Grill',
    summary: 'Гриль-меню, коктейли и вечерние виды.',
    coverImage: '/placeholder.jpg',

    location: 'San Antonio',
    address: 'Sunset Rd, 1, San Antonio',

    rating: 4.4,
    priceLevel: '€€€',
    openingHours: 'Ежедневно 18:00–02:00',

    tags: ['Гриль', 'Закаты', 'DJ sets'],
    galleryImages: ['/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg'],
  },
]
