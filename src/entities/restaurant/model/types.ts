// src/entities/restaurant/model/types.ts
// Доменные типы для ресторанов (Clean Architecture - Entities layer)

export interface Restaurant {
  code: string
  title: string
  summary: string
  coverImage?: string
  location?: string
  address?: string
  phone?: string
  website?: string
  priceLevel?: '€' | '€€' | '€€€' | '€€€€'
  rating?: number
  openingHours?: string
  tags?: string[]
  galleryImages?: string[]
}
