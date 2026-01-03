// src/entities/beach/model/types.ts
// Доменные типы для пляжей (Clean Architecture - Entities layer)

export interface Beach {
  code: string
  title: string
  summary: string
  coverImage?: string
  location?: string
  priceLevel?: '€' | '€€' | '€€€' | '€€€€'
  rating?: number
  tags?: string[]
  galleryImages?: string[]
}
