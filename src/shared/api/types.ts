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
  
  // Справочники параметров
  cuisines: CuisineDTO
  facilities: FacilityDTO
  music_genres: MusicGenreDTO
  
  // Junction таблицы для изображений
  club_images: ImageJunctionDTO
  hotel_images: ImageJunctionDTO
  beach_images: ImageJunctionDTO
  restaurant_images: ImageJunctionDTO
  article_images: ImageJunctionDTO
  party_images: ImageJunctionDTO

  // Junction таблицы для M2M параметров
  restaurant_cuisines: RestaurantCuisineJunctionDTO
  club_music_genres: ClubMusicGenreJunctionDTO
  beach_facilities: BeachFacilityJunctionDTO
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
 * DTO для справочников (например cuisines/facilities/music_genres)
 */
export interface LookupItemDTO {
  id: string // UUID
  name: string
  code: string
  created_at?: string
  updated_at?: string
}

export interface CuisineDTO extends LookupItemDTO {}
export interface FacilityDTO extends LookupItemDTO {}
export interface MusicGenreDTO extends LookupItemDTO {}

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

  // M2M: музыкальные жанры клуба (через club_music_genres)
  music_genres?: ClubMusicGenreJunctionDTO[]
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

  // M2M: характеристики пляжа (через beach_facilities)
  facilities?: BeachFacilityJunctionDTO[]
}

/**
 * DTO для ресторанов из Directus
 */
export interface RestaurantDTO extends PlaceDTO {
  // M2M: кухни ресторана (через restaurant_cuisines)
  cuisines?: RestaurantCuisineJunctionDTO[]
}

/**
 * DTO для junction таблиц (M2M параметры)
 */
export interface RestaurantCuisineJunctionDTO {
  id?: string // UUID (может отсутствовать в зависимости от схемы)
  restaurant_id?: string
  cuisine_id?: string | CuisineDTO
}

export interface ClubMusicGenreJunctionDTO {
  id?: string // UUID (может отсутствовать в зависимости от схемы)
  club_id?: string
  genre_id?: string | MusicGenreDTO
}

export interface BeachFacilityJunctionDTO {
  id?: string // UUID (может отсутствовать в зависимости от схемы)
  beach_id?: string
  facility_id?: string | FacilityDTO
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
