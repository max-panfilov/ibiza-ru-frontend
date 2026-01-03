// src/entities/hotel/api/hotelRepository.ts
// Репозиторий для работы с отелями (Clean Architecture - Interface Adapters layer)

import { readItems } from '@directus/sdk'
import { directusClient } from '@/shared/api/client'
import { handleApiError, NotFoundError, logApiError } from '@/shared/api/errors'
import type { HotelDTO, QueryParams } from '@/shared/api/types'
import type { Hotel } from '../model/types'

export interface IHotelRepository {
  getAll(params?: QueryParams): Promise<Hotel[]>
  getByCode(code: string): Promise<Hotel>
}

function mapDtoToDomain(dto: HotelDTO): Hotel {
  return {
    code: dto.code,
    title: dto.title,
    summary: dto.summary,
    coverImage: dto.cover_image,
    location: dto.location,
    address: dto.address,
    phone: dto.phone,
    website: dto.website,
    priceLevel: dto.price_level,
    rating: dto.rating,
    stars: dto.stars,
    checkIn: dto.check_in,
    checkOut: dto.check_out,
    tags: dto.tags,
    galleryImages: dto.gallery_images,
  }
}

class HotelRepository implements IHotelRepository {
  async getAll(params?: QueryParams): Promise<Hotel[]> {
    try {
      const filter = params?.filter || { status: { _eq: 'published' } }
      
      const hotels = await directusClient.request(
        readItems('hotels', {
          filter,
          sort: (params?.sort as any) || ['-date_created'],
          limit: params?.limit,
          offset: params?.offset,
          fields: (params?.fields as any) || ['*'],
        })
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
            status: { _eq: 'published' },
          },
          limit: 1,
        })
      )

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
