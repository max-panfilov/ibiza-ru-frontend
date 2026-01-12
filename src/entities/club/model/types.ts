// src/entities/club/model/types.ts
// Доменные типы для клубов (Clean Architecture - Entities layer)

import type { DomainImage } from '@/shared/lib/imageHelpers'

/**
 * Доменная модель клуба
 * Это бизнес-логика, независимая от деталей API или UI
 */
export interface Club {
  // ID записи в Directus (нужен для безопасных переходов на сайт через /out)
  id?: string
  code: string
  title: string
  description?: string
  coverImage?: DomainImage
  address?: string
  latitude?: number
  longitude?: number
  phone?: string
  email?: string
  website?: string
  priceRange?: string
  entryFee?: string
  // Справочные параметры (M2M): музыкальные жанры
  musicGenres?: string[]
  images: DomainImage[]
}
