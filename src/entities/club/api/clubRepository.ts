// src/entities/club/api/clubRepository.ts
// Репозиторий для работы с клубами (Clean Architecture - Interface Adapters layer)
// Реализует паттерн Repository из DDD

import { readItems, readItem } from '@directus/sdk'
import { directusClient } from '@/shared/api/client'
import { handleApiError, NotFoundError, logApiError } from '@/shared/api/errors'
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
    title: dto.title,
    summary: dto.summary,
    coverImage: dto.cover_image,
    location: dto.location,
    address: dto.address,
    phone: dto.phone,
    website: dto.website,
    priceLevel: dto.price_level,
    rating: dto.rating,
    tags: dto.tags,
    galleryImages: dto.gallery_images,
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
      // По умолчанию получаем только опубликованные клубы
      const filter = params?.filter || { status: { _eq: 'published' } }
      
      const clubs = await directusClient.request(
        readItems('clubs', {
          filter,
          sort: (params?.sort as any) || ['-date_created'],
          limit: params?.limit,
          offset: params?.offset,
          fields: (params?.fields as any) || ['*'],
        })
      ) as unknown as ClubDTO[]

      // Маппинг DTO в доменные модели
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
      const clubs = await directusClient.request(
        readItems('clubs', {
          filter: {
            code: { _eq: code },
            status: { _eq: 'published' },
          },
          limit: 1,
        })
      )

      if (!clubs || clubs.length === 0) {
        throw new NotFoundError('Клуб', code)
      }

      return mapDtoToDomain(clubs[0])
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
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
