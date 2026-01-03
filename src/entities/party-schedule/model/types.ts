// src/entities/party-schedule/model/types.ts
// Доменные типы для расписания вечеринок (Clean Architecture - Entities layer)

import type { DomainImage } from '@/shared/lib/imageHelpers'

export interface PartySchedule {
  id: string
  eventName: string
  description?: string
  date?: string
  startTime?: string
  endTime?: string
  clubId?: string
  ticketPrice?: string
  ticketLink?: string
  coverImage?: DomainImage
  images?: DomainImage[]
}
