// src/entities/article/model/types.ts
// Доменные типы для статей (Clean Architecture - Entities layer)

export interface Article {
  code: string
  title: string
  summary: string
  coverImage?: string
  contentHtml: string
  publishedAt?: string
  author?: string
}
