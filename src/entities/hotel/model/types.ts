// src/entities/hotel/model/types.ts
// Доменные типы для отелей (Clean Architecture - Entities layer)

export interface Hotel {
  code: string
  title: string
  summary: string
  coverImage?: string
  location?: string
  address?: string
  phone?: string
  website?: string
  priceLevel?: '€' | '€€' | '€€€' | '€€€€'
  rating?: number
  stars?: number
  checkIn?: string
  checkOut?: string
  tags?: string[]
  galleryImages?: string[]
}
