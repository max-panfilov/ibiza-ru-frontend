/**
 * Автоматически сгенерированные типы из Directus schema
 * Создано: 2026-01-10T19:51:46.639Z
 * Не редактируйте вручную - используйте npm run generate:types
 */

export interface Article_images {
  // Файл изображения
  file_id?: string | null;
}

export interface Article_tags {
  // Ссылка на tags
  tag_id?: string | null;
  // Ссылка на articles
  article_id?: string | null;
}

export interface Articles {
  // Изображения в статье
  images?: any;
  // Обложка статьи
  cover_file_id?: string | null;
  // Теги статьи (справочник tags)
  tags?: any;
  // Markdown. Поддерживаются кастомные блоки: :::quote[...] ... ::: и :::entity[type](code){Title} ... :::
  content?: string | null;
}

export interface Beach_facilities {
  // Ссылка на facilities
  facility_id?: string | null;
  // Ссылка на beaches
  beach_id?: string | null;
}

export interface Beach_images {
  // Файл изображения
  file_id?: string | null;
}

export interface Beaches {
  // Галерея пляжа
  images?: any;
  // Характеристики пляжа (справочник facilities)
  facilities?: any;
}

export interface Club_images {
  // Файл изображения
  file_id?: string | null;
}

export interface Club_music_genres {
  // Ссылка на music_genres
  genre_id?: string | null;
  // Ссылка на clubs
  club_id?: string | null;
}

export interface Clubs {
  // Галерея клуба
  images?: any;
  // Музыкальные жанры клуба (справочник music_genres)
  music_genres?: any;
}

export interface Cuisines {
  // Обратная связь к restaurants (служебное поле)
  restaurants?: any;
}

export interface Facilities {
  // Обратная связь к beaches (служебное поле)
  beaches?: any;
}

export interface Hotel_images {
  // Файл изображения
  file_id?: string | null;
}

export interface Hotels {
  // Галерея отеля
  images?: any;
}

export interface Music_genres {
  // Обратная связь к clubs (служебное поле)
  clubs?: any;
}

export interface Party_images {
  // Файл изображения
  file_id?: string | null;
}

export interface Restaurant_cuisines {
  // Ссылка на cuisines
  cuisine_id?: string | null;
  // Ссылка на restaurants
  restaurant_id?: string | null;
}

export interface Restaurant_images {
  // Файл изображения
  file_id?: string | null;
}

export interface Restaurants {
  // Галерея ресторана
  images?: any;
  // Кухни ресторана (справочник cuisines)
  cuisines?: any;
}

export interface Tags {
  // Обратная связь к articles (служебное поле)
  articles?: any;
}

// Типы для связей между коллекциями

// article_images.article_id -> articles
// article_images.file_id -> directus_files
// article_tags.article_id -> articles
// article_tags.tag_id -> tags
// articles.cover_file_id -> directus_files
// beach_facilities.beach_id -> beaches
// beach_facilities.facility_id -> facilities
// beach_images.beach_id -> beaches
// beach_images.file_id -> directus_files
// club_images.club_id -> clubs
// club_images.file_id -> directus_files
// club_music_genres.club_id -> clubs
// club_music_genres.genre_id -> music_genres
// hotel_images.hotel_id -> hotels
// hotel_images.file_id -> directus_files
// party_images.file_id -> directus_files
// restaurant_cuisines.restaurant_id -> restaurants
// restaurant_cuisines.cuisine_id -> cuisines
// restaurant_images.restaurant_id -> restaurants
// restaurant_images.file_id -> directus_files

// Объект всех коллекций для удобства
export interface DirectusCollections {
  article_images: Article_images;
  article_tags: Article_tags;
  articles: Articles;
  beach_facilities: Beach_facilities;
  beach_images: Beach_images;
  beaches: Beaches;
  club_images: Club_images;
  club_music_genres: Club_music_genres;
  clubs: Clubs;
  cuisines: Cuisines;
  facilities: Facilities;
  hotel_images: Hotel_images;
  hotels: Hotels;
  music_genres: Music_genres;
  party_images: Party_images;
  restaurant_cuisines: Restaurant_cuisines;
  restaurant_images: Restaurant_images;
  restaurants: Restaurants;
  tags: Tags;
}

// Список имён всех коллекций
export const collectionNames = [
  'article_images',
  'article_tags',
  'articles',
  'beach_facilities',
  'beach_images',
  'beaches',
  'club_images',
  'club_music_genres',
  'clubs',
  'cuisines',
  'facilities',
  'hotel_images',
  'hotels',
  'music_genres',
  'party_images',
  'restaurant_cuisines',
  'restaurant_images',
  'restaurants',
  'tags',
] as const;

export type CollectionName = typeof collectionNames[number];
