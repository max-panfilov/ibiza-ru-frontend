// src/entities/beach/model/types.ts
// Доменные типы для пляжей (Clean Architecture - Entities layer)

import type { DomainImage } from '@/shared/lib/imageHelpers'

export interface Beach {
  code: string
  title: string
  description?: string
  coverImage?: DomainImage
  location?: string
  latitude?: number
  longitude?: number
  // Справочные параметры (M2M): характеристики/удобства пляжа
  facilities?: string[]
  images: DomainImage[]
}
