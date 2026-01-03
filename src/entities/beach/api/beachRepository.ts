// src/entities/beach/api/beachRepository.ts
// Репозиторий для работы с пляжами (Clean Architecture - Interface Adapters layer)

import { readItems } from '@directus/sdk'
import { directusClient } from '@/shared/api/client'
import { handleApiError, NotFoundError, logApiError } from '@/shared/api/errors'
import type { BeachDTO, QueryParams } from '@/shared/api/types'
import type { Beach } from '../model/types'

export interface IBeachRepository {
  getAll(params?: QueryParams): Promise<Beach[]>
  getByCode(code: string): Promise<Beach>
}

function mapDtoToDomain(dto: BeachDTO): Beach {
  return {
    code: dto.code,
    title: dto.title,
    summary: dto.summary,
    coverImage: dto.cover_image,
    location: dto.location,
    priceLevel: dto.price_level,
    rating: dto.rating,
    tags: dto.tags,
    galleryImages: dto.gallery_images,
  }
}

class BeachRepository implements IBeachRepository {
  async getAll(params?: QueryParams): Promise<Beach[]> {
    try {
      const filter = params?.filter || { status: { _eq: 'published' } }
      
      const beaches = await directusClient.request(
        readItems('beaches', {
          filter,
          sort: (params?.sort as any) || ['-date_created'],
          limit: params?.limit,
          offset: params?.offset,
          fields: (params?.fields as any) || ['*'],
        })
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
            status: { _eq: 'published' },
          },
          limit: 1,
        })
      )

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
