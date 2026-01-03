// src/entities/party-event/api/partyEventRepository.ts
// Репозиторий для работы с вечеринками (Clean Architecture - Interface Adapters layer)

import { readItems } from '@directus/sdk'
import { directusClient } from '@/shared/api/client'
import { handleApiError, NotFoundError, logApiError } from '@/shared/api/errors'
import type { PartyEventDTO, QueryParams } from '@/shared/api/types'
import type { PartyEvent } from '../model/types'

export interface IPartyEventRepository {
  getAll(params?: QueryParams): Promise<PartyEvent[]>
  getByCode(code: string): Promise<PartyEvent>
}

function mapDtoToDomain(dto: PartyEventDTO): PartyEvent {
  return {
    code: dto.code,
    title: dto.title,
    summary: dto.summary,
    coverImage: dto.cover_image,
    startsAt: dto.starts_at,
    venue: dto.venue,
  }
}

class PartyEventRepository implements IPartyEventRepository {
  async getAll(params?: QueryParams): Promise<PartyEvent[]> {
    try {
      const filter = params?.filter || { status: { _eq: 'published' } }
      
      const events = await directusClient.request(
        readItems('party_events', {
          filter,
          sort: (params?.sort as any) || ['starts_at'],
          limit: params?.limit,
          offset: params?.offset,
          fields: (params?.fields as any) || ['*'],
        })
      ) as unknown as PartyEventDTO[]

      return events.map(mapDtoToDomain)
    } catch (error) {
      const apiError = handleApiError(error, 'Ошибка при получении списка вечеринок')
      logApiError(apiError)
      throw apiError
    }
  }

  async getByCode(code: string): Promise<PartyEvent> {
    try {
      const events = await directusClient.request(
        readItems('party_events', {
          filter: {
            code: { _eq: code },
            status: { _eq: 'published' },
          },
          limit: 1,
        })
      )

      if (!events || events.length === 0) {
        throw new NotFoundError('Вечеринка', code)
      }

      return mapDtoToDomain(events[0])
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      const apiError = handleApiError(error, `Ошибка при получении вечеринки "${code}"`)
      logApiError(apiError)
      throw apiError
    }
  }
}

export const partyEventRepository: IPartyEventRepository = new PartyEventRepository()
