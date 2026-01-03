// src/entities/article/api/articleRepository.ts
// Репозиторий для работы со статьями (Clean Architecture - Interface Adapters layer)

import { readItems } from '@directus/sdk'
import { directusClient } from '@/shared/api/client'
import { handleApiError, NotFoundError, logApiError } from '@/shared/api/errors'
import { extractFileUrl, mapAllImages } from '@/shared/lib/imageHelpers'
import { cleanQueryParams } from '@/shared/api/queryHelpers'
import type { ArticleDTO, QueryParams } from '@/shared/api/types'
import type { Article } from '../model/types'

export interface IArticleRepository {
  getAll(params?: QueryParams): Promise<Article[]>
  getByCode(code: string): Promise<Article>
}

function mapDtoToDomain(dto: ArticleDTO): Article {
  return {
    code: dto.code,
    title: dto.title,
    summary: dto.summary,
    content: dto.content,
    author: dto.author,
    publishedAt: dto.published_at,
    coverImage: dto.cover_file_id ? {
      id: typeof dto.cover_file_id === 'string' ? dto.cover_file_id : dto.cover_file_id.id,
      url: extractFileUrl(dto.cover_file_id),
    } : undefined,
    images: mapAllImages(dto.images),
  }
}

class ArticleRepository implements IArticleRepository {
  async getAll(params?: QueryParams): Promise<Article[]> {
    try {
      const articles = await directusClient.request(
        // @ts-expect-error Directus SDK типизация не поддерживает динамические коллекции
        readItems('articles', cleanQueryParams({
          filter: params?.filter,
          sort: params?.sort || ['-published_at', '-created_at'],
          limit: params?.limit,
          offset: params?.offset,
          fields: params?.fields || [
            '*',
            'cover_file_id.id',
            'cover_file_id.filename_download',
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
              _limit: 3,
            },
          },
        }))
      ) as unknown as ArticleDTO[]

      return articles.map(mapDtoToDomain)
    } catch (error) {
      const apiError = handleApiError(error, 'Ошибка при получении списка статей')
      logApiError(apiError)
      throw apiError
    }
  }

  async getByCode(code: string): Promise<Article> {
    try {
      const articles = await directusClient.request(
        // @ts-expect-error Directus SDK типизация не поддерживает динамические коллекции
        readItems('articles', {
          filter: {
            code: { _eq: code },
          },
          limit: 1,
          fields: [
            '*',
            'cover_file_id.*',
            'images.*',
            'images.file_id.*',
          ],
          deep: {
            images: {
              _sort: ['sort'],
            },
          },
        })
      ) as unknown as ArticleDTO[]

      if (!articles || articles.length === 0) {
        throw new NotFoundError('Статья', code)
      }

      return mapDtoToDomain(articles[0])
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      const apiError = handleApiError(error, `Ошибка при получении статьи "${code}"`)
      logApiError(apiError)
      throw apiError
    }
  }
}

export const articleRepository: IArticleRepository = new ArticleRepository()
