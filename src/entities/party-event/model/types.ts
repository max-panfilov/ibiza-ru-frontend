// src/entities/party-event/model/types.ts
// Доменные типы для вечеринок (Clean Architecture - Entities layer)

export interface PartyEvent {
  code: string
  title: string
  summary: string
  coverImage?: string
  startsAt: string
  venue?: string
}
