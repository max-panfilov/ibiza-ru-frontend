// src/entities/restaurant/api/restaurantRepository.ts
// Репозиторий для работы с ресторанами (Clean Architecture - Interface Adapters layer)

import { readItems } from '@directus/sdk'
import { directusClient } from '@/shared/api/client'
import { handleApiError, NotFoundError, logApiError } from '@/shared/api/errors'
import { getCoverImage, mapAllImages } from '@/shared/lib/imageHelpers'
import { cleanQueryParams } from '@/shared/api/queryHelpers'
import type { RestaurantDTO, QueryParams } from '@/shared/api/types'
import type { Restaurant } from '../model/types'

export interface IRestaurantRepository {
  getAll(params?: QueryParams): Promise<Restaurant[]>
  getByCode(code: string): Promise<Restaurant>
}

function mapDtoToDomain(dto: RestaurantDTO): Restaurant {
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
    images: mapAllImages(dto.images),
  }
}

class RestaurantRepository implements IRestaurantRepository {
  async getAll(params?: QueryParams): Promise<Restaurant[]> {
    try {
      const restaurants = await directusClient.request(
        readItems('restaurants', cleanQueryParams({
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
      ) as unknown as RestaurantDTO[]

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
