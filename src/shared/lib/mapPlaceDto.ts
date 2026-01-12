// src/shared/lib/mapPlaceDto.ts
// Общий маппер для сущностей типа "место" (Clean Architecture - Interface Adapters layer)

import { getCoverImage, mapAllImages } from '@/shared/lib/imageHelpers'
import type { PlaceDTO } from '@/shared/api/types'
import type { DomainImage } from '@/shared/lib/imageHelpers'

/**
 * Базовая доменная модель места
 * Используется как основа для клубов, отелей, ресторанов, пляжей
 */
export interface BasePlace {
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
  images: DomainImage[]
}

/**
 * Маппер: преобразование PlaceDTO из API в базовую доменную модель
 * Изолирует доменную логику от деталей API (Clean Architecture)
 * Применяет Single Responsibility Principle - только маппинг данных
 */
export function mapPlaceDto(dto: PlaceDTO): BasePlace {
  return {
    id: dto.id,
    code: dto.code,
    title: dto.name,
    description: dto.description,
    coverImage: getCoverImage(dto.images),
    address: dto.address,
    latitude: dto.latitude,
    longitude: dto.longitude,
    phone: dto.phone,
    email: dto.email,
    website: dto.website,
    priceRange: dto.price_range,
    images: mapAllImages(dto.images),
  }
}
