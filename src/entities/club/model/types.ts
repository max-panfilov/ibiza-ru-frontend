// src/entities/club/model/types.ts
// Доменные типы для клубов (Clean Architecture - Entities layer)

/**
 * Доменная модель клуба
 * Это бизнес-логика, независимая от деталей API или UI
 */
export interface Club {
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
  tags?: string[]
  galleryImages?: string[]
}
