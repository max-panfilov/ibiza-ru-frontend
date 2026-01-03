// src/entities/article/model/types.ts
// Доменные типы для статей (Clean Architecture - Entities layer)

import type { DomainImage } from '@/shared/lib/imageHelpers'

export interface Article {
  code: string
  title: string
  summary: string
  content: string
  author?: string
  publishedAt?: string
  coverImage?: DomainImage
  images?: DomainImage[]
}
