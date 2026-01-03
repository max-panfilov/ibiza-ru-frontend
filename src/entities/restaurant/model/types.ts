// src/entities/restaurant/model/types.ts
// Доменные типы для ресторанов (Clean Architecture - Entities layer)

import type { DomainImage } from '@/shared/lib/imageHelpers'

export interface Restaurant {
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
  images: DomainImage[]
}
