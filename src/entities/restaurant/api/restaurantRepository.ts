// src/entities/restaurant/api/restaurantRepository.ts
// Репозиторий для работы с ресторанами (Clean Architecture - Interface Adapters layer)

import { readItems } from '@directus/sdk'
import { directusClient } from '@/shared/api/client'
import { handleApiError, NotFoundError, logApiError } from '@/shared/api/errors'
import type { RestaurantDTO, QueryParams } from '@/shared/api/types'
import type { Restaurant } from '../model/types'

export interface IRestaurantRepository {
  getAll(params?: QueryParams): Promise<Restaurant[]>
  getByCode(code: string): Promise<Restaurant>
}

function mapDtoToDomain(dto: RestaurantDTO): Restaurant {
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
    openingHours: dto.opening_hours,
    tags: dto.tags,
    galleryImages: dto.gallery_images,
  }
}

class RestaurantRepository implements IRestaurantRepository {
  async getAll(params?: QueryParams): Promise<Restaurant[]> {
    try {
      const filter = params?.filter || { status: { _eq: 'published' } }
      
      const restaurants = await directusClient.request(
        readItems('restaurants', {
          filter,
          sort: (params?.sort as any) || ['-date_created'],
          limit: params?.limit,
          offset: params?.offset,
          fields: (params?.fields as any) || ['*'],
        })
      ) as unknown as RestaurantDTO[]

      return restaurants.map(mapDtoToDomain)
    } catch (error) {
      const apiError = handleApiError(error, 'Ошибка при получении списка ресторанов')
      logApiError(apiError)
      throw apiError
    }
  }

  async getByCode(code: string): Promise<Restaurant> {
    try {
      const restaurants = await directusClient.request(
        readItems('restaurants', {
          filter: {
            code: { _eq: code },
            status: { _eq: 'published' },
          },
          limit: 1,
        })
      )

      if (!restaurants || restaurants.length === 0) {
        throw new NotFoundError('Ресторан', code)
      }

      return mapDtoToDomain(restaurants[0])
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      const apiError = handleApiError(error, `Ошибка при получении ресторана "${code}"`)
      logApiError(apiError)
      throw apiError
    }
  }
}

export const restaurantRepository: IRestaurantRepository = new RestaurantRepository()
