// src/entities/hotel/model/types.ts
// Доменные типы для отелей (Clean Architecture - Entities layer)

import type { DomainImage } from '@/shared/lib/imageHelpers'

export interface Hotel {
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
  starRating?: number
  images?: DomainImage[]
}
