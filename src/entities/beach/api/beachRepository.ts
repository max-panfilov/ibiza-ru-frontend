// src/entities/beach/api/beachRepository.ts
// Репозиторий для работы с пляжами (Clean Architecture - Interface Adapters layer)

import { readItems } from '@directus/sdk'
import { directusClient } from '@/shared/api/client'
import { handleApiError, NotFoundError, logApiError } from '@/shared/api/errors'
import { getCoverImage, mapAllImages } from '@/shared/lib/imageHelpers'
import { cleanQueryParams } from '@/shared/api/queryHelpers'
import type { BeachDTO, QueryParams } from '@/shared/api/types'
import type { Beach } from '../model/types'

export interface IBeachRepository {
  getAll(params?: QueryParams): Promise<Beach[]>
  getByCode(code: string): Promise<Beach>
}

function mapDtoToDomain(dto: BeachDTO): Beach {
  return {
    code: dto.code,
    title: dto.name,
    description: dto.description,
    coverImage: getCoverImage(dto.images),
    location: dto.location,
    latitude: dto.latitude,
    longitude: dto.longitude,
    images: mapAllImages(dto.images),
  }
}

class BeachRepository implements IBeachRepository {
  async getAll(params?: QueryParams): Promise<Beach[]> {
    try {
      const beaches = await directusClient.request(
        readItems('beaches', cleanQueryParams({
          filter: params?.filter,
          sort: (params?.sort as any) || ['-created_at'],
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
        readItems('beaches', {
          filter: {
            code: { _eq: code },
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
}

export const beachRepository: IBeachRepository = new BeachRepository()
