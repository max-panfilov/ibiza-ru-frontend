// src/shared/api/types.ts
// Базовые типы для Directus API схемы
// Основано на docs/frontend-api.md

/**
 * Схема Directus коллекций
 * Определяет структуру данных в Directus
 * 
 * ВАЖНО: Эти типы должны соответствовать реальной схеме в Directus.
 * При изменении схемы в Directus необходимо обновить эти типы.
 */
export interface DirectusSchema {
  clubs: ClubDTO
  hotels: HotelDTO
  beaches: BeachDTO
  restaurants: RestaurantDTO
  articles: ArticleDTO
  party_schedule: PartyScheduleDTO
  
  // Junction таблицы для изображений
  club_images: ImageJunctionDTO
  hotel_images: ImageJunctionDTO
  beach_images: ImageJunctionDTO
  restaurant_images: ImageJunctionDTO
  article_images: ImageJunctionDTO
  party_images: ImageJunctionDTO
}

/**
 * Базовый DTO для файлов из directus_files
 */
export interface DirectusFileDTO {
  id: string // UUID
  filename_download: string
  width?: number
  height?: number
  filesize?: number
  type?: string
}

/**
 * DTO для junction таблиц изображений
 */
export interface ImageJunctionDTO {
  id: string // UUID
  file_id: string | DirectusFileDTO // UUID или вложенный объект
  sort?: number
  alt_text?: string
  is_cover?: boolean
  created_at?: string
}

/**
 * Базовый DTO для всех сущностей типа "место"
 */
export interface PlaceDTO {
  id: string // UUID
  name: string
  description?: string
  code: string
  address?: string
  latitude?: number
  longitude?: number
  phone?: string
  email?: string
  website?: string
  price_range?: string
  created_at?: string
  updated_at?: string
  // Связанные изображения (O2M)
  images?: ImageJunctionDTO[]
}

/**
 * DTO для клубов из Directus
 */
export interface ClubDTO extends PlaceDTO {
  entry_fee?: string
}

/**
 * DTO для отелей из Directus
 */
export interface HotelDTO extends PlaceDTO {
  star_rating?: number
}

/**
 * DTO для пляжей из Directus
 */
export interface BeachDTO extends Omit<PlaceDTO, 'address' | 'phone' | 'email' | 'website' | 'price_range'> {
  location?: string
}

/**
 * DTO для ресторанов из Directus
 */
export interface RestaurantDTO extends PlaceDTO {
  // Наследует все поля из PlaceDTO
}

/**
 * DTO для статей из Directus
 */
export interface ArticleDTO {
  id: string // UUID
  title: string
  summary: string
  content: string // Markdown контент (рендерится на фронтенде)
  code: string
  author?: string
  published_at?: string
  cover_file_id?: string | DirectusFileDTO // UUID или вложенный объект
  created_at?: string
  updated_at?: string
  // Связанные изображения (O2M)
  images?: ImageJunctionDTO[]
}

/**
 * DTO для party_schedule из Directus
 */
export interface PartyScheduleDTO {
  id: string // UUID
  event_name: string
  club_id?: string // UUID ссылка на clubs.id
  date?: string
  start_time?: string
  end_time?: string
  description?: string
  ticket_price?: string
  ticket_link?: string
  created_at?: string
  updated_at?: string
  // Связанные изображения (O2M)
  images?: ImageJunctionDTO[]
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
