// src/entities/party-schedule/api/partyScheduleRepository.ts
// Репозиторий для работы с расписанием вечеринок (Clean Architecture - Interface Adapters layer)

import { readItems } from '@directus/sdk'
import { directusClient } from '@/shared/api/client'
import { handleApiError, NotFoundError, logApiError } from '@/shared/api/errors'
import { getCoverImage, mapAllImages } from '@/shared/lib/imageHelpers'
import { cleanQueryParams } from '@/shared/api/queryHelpers'
import type { PartyScheduleDTO, QueryParams } from '@/shared/api/types'
import type { PartySchedule } from '../model/types'

export interface IPartyScheduleRepository {
  getAll(params?: QueryParams): Promise<PartySchedule[]>
  getById(id: string): Promise<PartySchedule>
}

function mapDtoToDomain(dto: PartyScheduleDTO): PartySchedule {
  return {
    id: dto.id,
    eventName: dto.event_name,
    description: dto.description,
    date: dto.date,
    startTime: dto.start_time,
    endTime: dto.end_time,
    clubId: dto.club_id,
    ticketPrice: dto.ticket_price,
    ticketLink: dto.ticket_link,
    coverImage: getCoverImage(dto.images),
    images: mapAllImages(dto.images),
  }
}

class PartyScheduleRepository implements IPartyScheduleRepository {
  async getAll(params?: QueryParams): Promise<PartySchedule[]> {
    try {
      const events = await directusClient.request(
        readItems('party_schedule', cleanQueryParams({
          filter: params?.filter,
          sort: (params?.sort as any) || ['start_time'],
          limit: params?.limit,
          offset: params?.offset,
          fields: (params?.fields as any) || [
            '*',
            'images.id',
            'images.file_id.id',
            'images.file_id.filename_download',
            'images.sort',
            'images.alt_text',
            'images.is_cover',
          ],
          deep: {
            images: {
              _sort: ['sort'],
              _limit: 1,
            },
          },
        }) as any)
      ) as unknown as PartyScheduleDTO[]

      return events.map(mapDtoToDomain)
    } catch (error) {
      const apiError = handleApiError(error, 'Ошибка при получении расписания вечеринок')
      logApiError(apiError)
      throw apiError
    }
  }

  async getById(id: string): Promise<PartySchedule> {
    try {
      const events = await directusClient.request(
        readItems('party_schedule', {
          filter: {
            id: { _eq: id },
          },
          limit: 1,
          fields: [
            '*',
            'images.*',
            'images.file_id.*',
          ] as any,
          deep: {
            images: {
              _sort: ['sort'],
            },
          },
        } as any)
      ) as unknown as PartyScheduleDTO[]

      if (!events || events.length === 0) {
        throw new NotFoundError('Событие', id)
      }

      return mapDtoToDomain(events[0])
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      const apiError = handleApiError(error, `Ошибка при получении события "${id}"`)
      logApiError(apiError)
      throw apiError
    }
  }
}

export const partyScheduleRepository: IPartyScheduleRepository = new PartyScheduleRepository()
