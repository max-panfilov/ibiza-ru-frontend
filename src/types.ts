// src/types.ts
// Общие типы данных для прототипа (позже заменятся на типы из Directus API).

export type EntityKind = 'hotel' | 'beach' | 'restaurant' | 'club' | 'article' | 'partyEvent'

export interface EntityBase {
  code: string
  title: string
  summary: string
  coverImage?: string
}

export interface PlaceEntity extends EntityBase {
  kind: Exclude<EntityKind, 'article' | 'partyEvent'>

  // Для прототипа достаточно ограниченного набора полей — не моделируем всю БД.
  // Эти поля показывают, как в целом может выглядеть карточка/детальная страница после интеграции с Directus.
  location?: string
  address?: string
  phone?: string
  website?: string

  // Визуальные маркеры.
  priceLevel?: '€' | '€€' | '€€€' | '€€€€'
  rating?: number // 0..5
  stars?: number // 1..5 (актуально для отелей)

  // Списки для UI.
  tags?: string[]
  galleryImages?: string[]

  // Примеры «специфичных» полей (позже заменим на реальные схемы/коллекции Directus).
  openingHours?: string // рестораны
  checkIn?: string // отели
  checkOut?: string // отели
}

export interface Article extends EntityBase {
  kind: 'article'
  publishedAt: string // ISO date string
  author?: string
  // В прототипе используем HTML-строку, чтобы быстро показать верстку.
  contentHtml: string
}

export interface PartyEvent extends EntityBase {
  kind: 'partyEvent'
  // ISO date-time string
  startsAt: string
  venue?: string
}
