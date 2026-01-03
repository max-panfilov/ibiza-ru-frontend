// src/entities/restaurant/api/restaurantRepository.ts
// Репозиторий для работы с ресторанами (Clean Architecture - Interface Adapters layer)

import { readItems } from '@directus/sdk'
import { directusClient } from '@/shared/api/client'
import { handleApiError, NotFoundError, logApiError } from '@/shared/api/errors'
import { mapPlaceDto } from '@/shared/lib/mapPlaceDto'
import { cleanQueryParams } from '@/shared/api/queryHelpers'
import type { RestaurantDTO, QueryParams } from '@/shared/api/types'
import type { Restaurant } from '../model/types'

export interface IRestaurantRepository {
  getAll(params?: QueryParams): Promise<Restaurant[]>
  getByCode(code: string): Promise<Restaurant>
}

function mapDtoToDomain(dto: RestaurantDTO): Restaurant {
  return mapPlaceDto(dto)
}

class RestaurantRepository implements IRestaurantRepository {
  async getAll(params?: QueryParams): Promise<Restaurant[]> {
    try {
      const restaurants = await directusClient.request(
        // @ts-expect-error Directus SDK типизация не поддерживает динамические коллекции
        readItems('restaurants', cleanQueryParams({
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
        // @ts-expect-error Directus SDK типизация не поддерживает динамические коллекции
        readItems('restaurants', {
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
