// src/shared/api/types.ts
// Базовые типы для Directus API схемы

/**
 * Схема Directus коллекций
 * Определяет структуру данных в Directus
 * 
 * ВАЖНО: Эти типы должны соответствовать реальной схеме в Directus.
 * При изменении схемы в Directus необходимо обновить эти типы.
 */
export interface DirectusSchema {
  // Коллекция клубов
  clubs: ClubDTO[]
  
  // Коллекция отелей
  hotels: HotelDTO[]
  
  // Коллекция пляжей
  beaches: BeachDTO[]
  
  // Коллекция ресторанов
  restaurants: RestaurantDTO[]
  
  // Коллекция статей
  articles: ArticleDTO[]
  
  // Коллекция вечеринок
  party_events: PartyEventDTO[]
}

/**
 * Базовый DTO для всех сущностей типа "место"
 */
export interface PlaceDTO {
  id: number
  status: 'draft' | 'published' | 'archived'
  code: string
  title: string
  summary: string
  cover_image?: string
  location?: string
  address?: string
  phone?: string
  website?: string
  price_level?: '€' | '€€' | '€€€' | '€€€€'
  rating?: number
  tags?: string[]
  gallery_images?: string[]
  date_created?: string
  date_updated?: string
}

/**
 * DTO для клубов из Directus
 */
export interface ClubDTO extends PlaceDTO {
  // Специфичные поля для клубов (если есть)
}

/**
 * DTO для отелей из Directus
 */
export interface HotelDTO extends PlaceDTO {
  stars?: number
  check_in?: string
  check_out?: string
}

/**
 * DTO для пляжей из Directus
 */
export interface BeachDTO extends PlaceDTO {
  // Специфичные поля для пляжей (если есть)
}

/**
 * DTO для ресторанов из Directus
 */
export interface RestaurantDTO extends PlaceDTO {
  opening_hours?: string
}

/**
 * DTO для статей из Directus
 */
export interface ArticleDTO {
  id: number
  status: 'draft' | 'published' | 'archived'
  code: string
  title: string
  summary: string
  cover_image?: string
  content_html: string
  published_at?: string
  author?: string
  date_created?: string
  date_updated?: string
}

/**
 * DTO для вечеринок из Directus
 */
export interface PartyEventDTO {
  id: number
  status: 'draft' | 'published' | 'archived'
  code: string
  title: string
  summary: string
  cover_image?: string
  starts_at: string
  venue?: string
  date_created?: string
  date_updated?: string
}

/**
 * Параметры для запросов к API
 */
export interface QueryParams {
  filter?: Record<string, any>
  sort?: string[]
  limit?: number
  offset?: number
  fields?: string[]
}
