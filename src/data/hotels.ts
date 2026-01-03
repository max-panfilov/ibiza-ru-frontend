// src/data/hotels.ts
// Мок-данные для прототипа. Позже заменятся на загрузку из Directus.

import type { PlaceEntity } from '../types'

export const hotels: PlaceEntity[] = [
  {
    kind: 'hotel',
    code: 'grand-ibiza-palace',
    title: 'Grand Ibiza Palace',
    summary: 'Роскошный отель у моря с бассейном, SPA и видом на закат.',
    coverImage: '/images/ibiza-hero.png',

    location: 'Ibiza Town',
    address: 'Paseo Marítimo, 10, Ibiza Town',
    phone: '+34 600 000 001',
    website: 'https://example.com',

    stars: 5,
    rating: 4.7,
    priceLevel: '€€€€',

    checkIn: '15:00',
    checkOut: '12:00',

    tags: ['SPA', 'Бассейн', 'Первая линия', 'Завтраки', 'Трансфер'],
    galleryImages: ['/images/ibiza-hero.png', '/placeholder.jpg', '/placeholder.jpg'],
  },
  {
    kind: 'hotel',
    code: 'sunset-boutique',
    title: 'Sunset Boutique',
    summary: 'Уютный бутик-отель в тихом районе, рядом с пляжем.',
    coverImage: '/placeholder.jpg',

    location: 'San Antonio',
    address: 'Carrer Example, 5, San Antonio',
    phone: '+34 600 000 002',

    stars: 4,
    rating: 4.3,
    priceLevel: '€€€',

    checkIn: '14:00',
    checkOut: '11:00',

    tags: ['Бутик', 'Тихий район', 'Рядом с пляжем'],
    galleryImages: ['/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg'],
  },
  {
    kind: 'hotel',
    code: 'cala-view',
    title: 'Cala View Resort',
    summary: 'Курорт у бухты: пляж, рестораны, семейные номера.',
    coverImage: '/placeholder.jpg',

    location: 'Cala Llonga',
    address: 'Avenida Cala, 1, Cala Llonga',

    stars: 4,
    rating: 4.2,
    priceLevel: '€€€',

    checkIn: '15:00',
    checkOut: '12:00',

    tags: ['Семейный', 'Пляж рядом', 'Ресторан'],
    galleryImages: ['/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg'],
  },
  {
    kind: 'hotel',
    code: 'urban-stay',
    title: 'Urban Stay Ibiza',
    summary: 'Городской формат: рядом с ресторанами, шопингом и набережной.',
    coverImage: '/placeholder.jpg',

    location: 'Ibiza Town',
    address: 'Centro, 21, Ibiza Town',

    stars: 3,
    rating: 4.0,
    priceLevel: '€€',

    checkIn: '14:00',
    checkOut: '11:00',

    tags: ['Центр', 'Набережная', 'Удобно для прогулок'],
    galleryImages: ['/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg'],
  },
  {
    kind: 'hotel',
    code: 'eco-retreat',
    title: 'Eco Retreat',
    summary: 'Спокойное место в зелени, йога и завтраки с локальными продуктами.',
    coverImage: '/placeholder.jpg',

    location: 'Santa Eulària',
    address: 'Ruta Verde, 3, Santa Eulària',

    stars: 4,
    rating: 4.6,
    priceLevel: '€€€',

    checkIn: '15:00',
    checkOut: '12:00',

    tags: ['Йога', 'Эко', 'Тишина', 'Локальные продукты'],
    galleryImages: ['/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg'],
  },
]
