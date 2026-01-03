// src/entities/club/model/types.ts
// Доменные типы для клубов (Clean Architecture - Entities layer)

/**
 * Изображение для UI
 */
export interface ClubImage {
  id: string
  url: string // URL для отображения
  alt?: string
  isCover?: boolean
}

/**
 * Доменная модель клуба
 * Это бизнес-логика, независимая от деталей API или UI
 */
export interface Club {
  code: string
  title: string
  description?: string
  coverImage?: ClubImage
  address?: string
  latitude?: number
  longitude?: number
  phone?: string
  email?: string
  website?: string
  priceRange?: string
  entryFee?: string
  images?: ClubImage[]
}
