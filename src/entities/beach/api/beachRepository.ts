// src/entities/beach/api/beachRepository.ts
// Репозиторий для работы с пляжами (Clean Architecture - Interface Adapters layer)

import { readItems } from '@directus/sdk'
import { directusClient } from '@/shared/api/client'
import { handleApiError, NotFoundError, logApiError } from '@/shared/api/errors'
import { getCoverImage, mapAllImages } from '@/shared/lib/imageHelpers'
import { cleanQueryParams } from '@/shared/api/queryHelpers'
import { pickRandomItems } from '@/shared/lib/random'
import type { BeachDTO, QueryParams } from '@/shared/api/types'
import type { Beach } from '../model/types'

export interface IBeachRepository {
  getAll(params?: QueryParams): Promise<Beach[]>
  getByCode(code: string): Promise<Beach>
  /**
   * Вернуть до трёх случайных пляжей для главной страницы.
   */
  getRandom3(): Promise<Beach[]>
}

function mapDtoToDomain(dto: BeachDTO): Beach {
  // M2M: характеристики/удобства пляжа (beaches.facilities -> beach_facilities -> facilities)
  const facilities = (dto.facilities ?? [])
    .map((junction) => {
      const facility = junction?.facility_id
      if (!facility) return undefined
      if (typeof facility === 'string') return facility
      return facility.name
    })
    .filter(Boolean) as string[]

  return {
    code: dto.code,
    title: dto.name,
    description: dto.description,
    coverImage: getCoverImage(dto.images),
    location: dto.location,
    latitude: dto.latitude,
    longitude: dto.longitude,
    facilities: facilities.length > 0 ? facilities : undefined,
    images: mapAllImages(dto.images),
  }
}

class BeachRepository implements IBeachRepository {
  async getAll(params?: QueryParams): Promise<Beach[]> {
    try {
      const beaches = await directusClient.request(
        // @ts-expect-error Directus SDK типизация не поддерживает динамические коллекции
        readItems('beaches', cleanQueryParams({
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
      ) as unknown as BeachDTO[]

      return beaches.map(mapDtoToDomain)
    } catch (error) {
      const apiError = handleApiError(error, 'Ошибка при получении списка пляжей')
      logApiError(apiError)
      throw apiError
    }
  }

  async getByCode(code: string): Promise<Beach> {
    try {
      const beaches = await directusClient.request(
        // @ts-expect-error Directus SDK типизация не поддерживает динамические коллекции
        readItems('beaches', {
          filter: {
            code: { _eq: code },
          },
          limit: 1,
          fields: [
            '*',
            'images.*',
            'images.file_id.*',
            // Подтягиваем M2M характеристики
            'facilities.*',
            'facilities.facility_id.*',
          ],
          deep: {
            images: {
              _sort: ['sort'],
            },
          },
        })
      ) as unknown as BeachDTO[]

      if (!beaches || beaches.length === 0) {
        throw new NotFoundError('Пляж', code)
      }

      return mapDtoToDomain(beaches[0])
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      const apiError = handleApiError(error, `Ошибка при получении пляжа "${code}"`)
      logApiError(apiError)
      throw apiError
    }
  }

  async getRandom3(): Promise<Beach[]> {
    // Берём ограниченную выборку пляжей и уже по ней делаем случайный выбор
    const SAMPLE_SIZE = 20
    const beaches = await this.getAll({ limit: SAMPLE_SIZE, sort: ['-created_at'] })
    return pickRandomItems(beaches, 3)
  }
}

export const beachRepository: IBeachRepository = new BeachRepository()
