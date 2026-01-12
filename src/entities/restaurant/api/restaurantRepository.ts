// src/entities/restaurant/api/restaurantRepository.ts
// Репозиторий для работы с ресторанами (Clean Architecture - Interface Adapters layer)

import { readItems } from '@directus/sdk'
import { directusClient } from '@/shared/api/client'
import { handleApiError, NotFoundError, logApiError } from '@/shared/api/errors'
import { mapPlaceDto } from '@/shared/lib/mapPlaceDto'
import { cleanQueryParams } from '@/shared/api/queryHelpers'
import { pickRandomItems } from '@/shared/lib/random'
import type { RestaurantDTO, QueryParams } from '@/shared/api/types'
import type { Restaurant } from '../model/types'

export interface IRestaurantRepository {
  getAll(params?: QueryParams): Promise<Restaurant[]>
  getByCode(code: string): Promise<Restaurant>
  /**
   * Вернуть до трёх случайных ресторанов для главной страницы.
   */
  getRandom3(): Promise<Restaurant[]>
}

function mapDtoToDomain(dto: RestaurantDTO): Restaurant {
  const base = mapPlaceDto(dto)

  // M2M: кухни ресторана (restaurants.cuisines -> restaurant_cuisines -> cuisines)
  const cuisines = (dto.cuisines ?? [])
    .map((junction) => {
      const cuisine = junction?.cuisine_id
      if (!cuisine) return undefined
      if (typeof cuisine === 'string') return cuisine
      return cuisine.name
    })
    .filter(Boolean) as string[]

  return {
    ...base,
    cuisines: cuisines.length > 0 ? cuisines : undefined,
  }
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
            // Подтягиваем M2M кухни ресторана
            'cuisines.*',
            'cuisines.cuisine_id.*',
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

  async getRandom3(): Promise<Restaurant[]> {
    // Берём ограниченную выборку ресторанов и уже по ней делаем случайный выбор
    const SAMPLE_SIZE = 20
    const restaurants = await this.getAll({ limit: SAMPLE_SIZE, sort: ['-created_at'] })
    return pickRandomItems(restaurants, 3)
  }
}

export const restaurantRepository: IRestaurantRepository = new RestaurantRepository()
