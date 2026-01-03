// src/entities/club/api/clubRepository.ts
// Репозиторий для работы с клубами (Clean Architecture - Interface Adapters layer)
// Реализует паттерн Repository из DDD

import { readItems } from '@directus/sdk'
import { directusClient } from '@/shared/api/client'
import { handleApiError, NotFoundError, logApiError } from '@/shared/api/errors'
import { mapPlaceDto } from '@/shared/lib/mapPlaceDto'
import { cleanQueryParams } from '@/shared/api/queryHelpers'
import { pickRandomItems } from '@/shared/lib/random'
import type { ClubDTO, QueryParams } from '@/shared/api/types'
import type { Club } from '../model/types'

/**
 * Интерфейс репозитория клубов (Dependency Inversion Principle)
 * Определяет контракт для работы с данными клубов
 */
export interface IClubRepository {
  getAll(params?: QueryParams): Promise<Club[]>
  getByCode(code: string): Promise<Club>
  /**
   * Вернуть до трёх случайных клубов для главной страницы.
   */
  getRandom3(): Promise<Club[]>
}

/**
 * Маппер: преобразование DTO из API в доменную модель
 * Изолирует доменную логику от деталей API (Clean Architecture)
 */
function mapDtoToDomain(dto: ClubDTO): Club {
  const base = mapPlaceDto(dto)
  return {
    ...base,
    entryFee: dto.entry_fee,
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
        // @ts-expect-error Directus SDK типизация не поддерживает динамические коллекции
        readItems('clubs', cleanQueryParams({
          filter: params?.filter,
          sort: params?.sort || ['-created_at'],
          limit: params?.limit,
          offset: params?.offset,
          // Запрашиваем основные поля + одно изображение
          fields: params?.fields || [
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
        }))
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
        // @ts-expect-error Directus SDK типизация не поддерживает динамические коллекции
        readItems('clubs', {
          filter: {
            code: { _eq: code },
          },
          limit: 1,
          fields: [
            '*',
            'images.*',
            'images.file_id.*',
          ],
          // Сортируем все изображения по sort
          deep: {
            images: {
              _sort: ['sort'],
            },
          },
        })
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

  async getRandom3(): Promise<Club[]> {
    // Берём ограниченную выборку клубов и уже по ней делаем случайный выбор
    const SAMPLE_SIZE = 20
    const clubs = await this.getAll({ limit: SAMPLE_SIZE, sort: ['-created_at'] })
    return pickRandomItems(clubs, 3)
  }
}

/**
 * Singleton instance репозитория (Single Responsibility Principle)
 * Экспортируем единственный экземпляр для использования во всем приложении
 */
export const clubRepository: IClubRepository = new ClubRepository()
