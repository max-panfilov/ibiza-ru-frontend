// src/entities/club/api/clubRepository.ts
// Репозиторий для работы с клубами (Clean Architecture - Interface Adapters layer)
// Реализует паттерн Repository из DDD

import { readItems } from '@directus/sdk'
import { directusClient } from '@/shared/api/client'
import { handleApiError, NotFoundError, logApiError } from '@/shared/api/errors'
import { getCoverImage, mapAllImages } from '@/shared/lib/imageHelpers'
import { cleanQueryParams } from '@/shared/api/queryHelpers'
import type { ClubDTO, QueryParams } from '@/shared/api/types'
import type { Club } from '../model/types'

/**
 * Интерфейс репозитория клубов (Dependency Inversion Principle)
 * Определяет контракт для работы с данными клубов
 */
export interface IClubRepository {
  getAll(params?: QueryParams): Promise<Club[]>
  getByCode(code: string): Promise<Club>
}

/**
 * Маппер: преобразование DTO из API в доменную модель
 * Изолирует доменную логику от деталей API (Clean Architecture)
 */
function mapDtoToDomain(dto: ClubDTO): Club {
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
    entryFee: dto.entry_fee,
    images: mapAllImages(dto.images),
  }
}

/**
 * Реализация репозитория клубов
 * Использует Directus SDK для получения данных
 */
class ClubRepository implements IClubRepository {
  /**
   * Получить все клубы с возможностью фильтрации
   */
  async getAll(params?: QueryParams): Promise<Club[]> {
    try {
      // Запрашиваем клубы с первым изображением для превью
      const clubs = await directusClient.request(
        readItems('clubs', cleanQueryParams({
          filter: params?.filter,
          sort: (params?.sort as any) || ['-created_at'],
          limit: params?.limit,
          offset: params?.offset,
          // Запрашиваем основные поля + одно изображение
          fields: (params?.fields as any) || [
            '*',
            'images.id',
            'images.file_id.id',
            'images.file_id.filename_download',
            'images.sort',
            'images.alt_text',
            'images.is_cover',
          ],
          // Сортируем изображения по sort, ограничиваем 1 для списка
          deep: {
            images: {
              _sort: ['sort'],
              _limit: 1,
            },
          },
        }) as any)
      ) as unknown as ClubDTO[]

      return clubs.map(mapDtoToDomain)
    } catch (error) {
      const apiError = handleApiError(error, 'Ошибка при получении списка клубов')
      logApiError(apiError)
      throw apiError
    }
  }

  /**
   * Получить клуб по коду (slug)
   */
  async getByCode(code: string): Promise<Club> {
    try {
      // Запрашиваем клуб со всей галереей
      const clubs = await directusClient.request(
        readItems('clubs', {
          filter: {
            code: { _eq: code },
          },
          limit: 1,
          fields: [
            '*',
            'images.*',
            'images.file_id.*',
          ] as any,
          // Сортируем все изображения по sort
          deep: {
            images: {
              _sort: ['sort'],
            },
          },
        } as any)
      ) as unknown as ClubDTO[]

      if (!clubs || clubs.length === 0) {
        throw new NotFoundError('Клуб', code)
      }

      return mapDtoToDomain(clubs[0])
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      const apiError = handleApiError(error, `Ошибка при получении клуба "${code}"`)
      logApiError(apiError)
      throw apiError
    }
  }
}

/**
 * Singleton instance репозитория (Single Responsibility Principle)
 * Экспортируем единственный экземпляр для использования во всем приложении
 */
export const clubRepository: IClubRepository = new ClubRepository()
