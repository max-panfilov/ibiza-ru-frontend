// src/entities/hotel/api/hotelRepository.ts
// Репозиторий для работы с отелями (Clean Architecture - Interface Adapters layer)

import { readItems } from '@directus/sdk'
import { directusClient } from '@/shared/api/client'
import { handleApiError, NotFoundError, logApiError } from '@/shared/api/errors'
import { getCoverImage, mapAllImages } from '@/shared/lib/imageHelpers'
import { cleanQueryParams } from '@/shared/api/queryHelpers'
import type { HotelDTO, QueryParams } from '@/shared/api/types'
import type { Hotel } from '../model/types'

export interface IHotelRepository {
  getAll(params?: QueryParams): Promise<Hotel[]>
  getByCode(code: string): Promise<Hotel>
}

function mapDtoToDomain(dto: HotelDTO): Hotel {
  return {
    code: dto.code,
    title: dto.name,
    description: dto.description,
    coverImage: getCoverImage(dto.images),
    address: dto.address,
    latitude: dto.latitude,
    longitude: dto.longitude,
    phone: dto.phone,
    email: dto.email,
    website: dto.website,
    priceRange: dto.price_range,
    starRating: dto.star_rating,
    images: mapAllImages(dto.images),
  }
}

class HotelRepository implements IHotelRepository {
  async getAll(params?: QueryParams): Promise<Hotel[]> {
    try {
      const hotels = await directusClient.request(
        readItems('hotels', cleanQueryParams({
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
        readItems('hotels', {
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
}

export const hotelRepository: IHotelRepository = new HotelRepository()
