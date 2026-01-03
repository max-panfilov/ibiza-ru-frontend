// src/data/beaches.ts

import type { PlaceEntity } from '../types'

export const beaches: PlaceEntity[] = [
  {
    kind: 'beach',
    code: 'cala-comte',
    title: 'Cala Comte',
    summary: 'Кристально чистая вода, красивые закаты и атмосфера “must-see”.',
    coverImage: '/placeholder.jpg',
    location: 'West coast',
    priceLevel: '€€',
  },
  {
    kind: 'beach',
    code: 'ses-salines',
    title: 'Ses Salines',
    summary: 'Широкий песчаный пляж, музыка и пляжные бары.',
    coverImage: '/placeholder.jpg',
    location: 'South',
    priceLevel: '€€€',
  },
  {
    kind: 'beach',
    code: 'cala-dhort',
    title: 'Cala d’Hort',
    summary: 'Живописная бухта с видами на Es Vedrà.',
    coverImage: '/placeholder.jpg',
    location: 'Southwest',
    priceLevel: '€€',
  },
  {
    kind: 'beach',
    code: 'benirras',
    title: 'Benirràs',
    summary: 'Уединённая бухта и легендарные закатные барабаны.',
    coverImage: '/placeholder.jpg',
    location: 'North',
    priceLevel: '€€',
  },
]