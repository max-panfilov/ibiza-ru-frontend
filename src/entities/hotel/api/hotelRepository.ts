// src/entities/hotel/api/hotelRepository.ts
// Репозиторий для работы с отелями (Clean Architecture - Interface Adapters layer)

import { readItems } from '@directus/sdk'
import { directusClient } from '@/shared/api/client'
import { handleApiError, NotFoundError, logApiError } from '@/shared/api/errors'
import { mapPlaceDto } from '@/shared/lib/mapPlaceDto'
import { cleanQueryParams } from '@/shared/api/queryHelpers'
import { pickRandomItems } from '@/shared/lib/random'
import type { HotelDTO, QueryParams } from '@/shared/api/types'
import type { Hotel } from '../model/types'

export interface IHotelRepository {
  getAll(params?: QueryParams): Promise<Hotel[]>
  getByCode(code: string): Promise<Hotel>
  /**
   * Вернуть до трёх случайных отелей для главной страницы.
   */
  getRandom3(): Promise<Hotel[]>
}

function mapDtoToDomain(dto: HotelDTO): Hotel {
  const base = mapPlaceDto(dto)
  return {
    ...base,
    starRating: dto.star_rating,
  }
}

class HotelRepository implements IHotelRepository {
  async getAll(params?: QueryParams): Promise<Hotel[]> {
    try {
      const hotels = await directusClient.request(
        // @ts-expect-error Directus SDK типизация не поддерживает динамические коллекции
        readItems('hotels', cleanQueryParams({
          filter: params?.filter,
          sort: params?.sort || ['-created_at'],
          limit: params?.limit,
          offset: params?.offset,
          fields: params?.fields || [
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
        }))
      ) as unknown as HotelDTO[]

      return hotels.map(mapDtoToDomain)
    } catch (error) {
      const apiError = handleApiError(error, 'Ошибка при получении списка отелей')
      logApiError(apiError)
      throw apiError
    }
  }

  async getByCode(code: string): Promise<Hotel> {
    try {
      const hotels = await directusClient.request(
        // @ts-expect-error Directus SDK типизация не поддерживает динамические коллекции
        readItems('hotels', {
          filter: {
            code: { _eq: code },
          },
          limit: 1,
          fields: [
            '*',
            'images.*',
            'images.file_id.*',
          ],
          deep: {
            images: {
              _sort: ['sort'],
            },
          },
        })
      ) as unknown as HotelDTO[]

      if (!hotels || hotels.length === 0) {
        throw new NotFoundError('Отель', code)
      }

      return mapDtoToDomain(hotels[0])
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      const apiError = handleApiError(error, `Ошибка при получении отеля "${code}"`)
      logApiError(apiError)
      throw apiError
    }
  }

  async getRandom3(): Promise<Hotel[]> {
    // Берём ограниченную выборку отелей и уже по ней делаем случайный выбор
    const SAMPLE_SIZE = 20
    const hotels = await this.getAll({ limit: SAMPLE_SIZE, sort: ['-created_at'] })
    return pickRandomItems(hotels, 3)
  }
}

export const hotelRepository: IHotelRepository = new HotelRepository()
