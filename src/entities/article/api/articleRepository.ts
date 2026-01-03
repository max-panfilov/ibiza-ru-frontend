// src/entities/article/api/articleRepository.ts
// Репозиторий для работы со статьями (Clean Architecture - Interface Adapters layer)

import { readItems } from '@directus/sdk'
import { directusClient } from '@/shared/api/client'
import { handleApiError, NotFoundError, logApiError } from '@/shared/api/errors'
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
    coverImage: dto.cover_image,
    contentHtml: dto.content_html,
    publishedAt: dto.published_at,
    author: dto.author,
  }
}

class ArticleRepository implements IArticleRepository {
  async getAll(params?: QueryParams): Promise<Article[]> {
    try {
      const filter = params?.filter || { status: { _eq: 'published' } }
      
      const articles = await directusClient.request(
        readItems('articles', {
          filter,
          sort: (params?.sort as any) || ['-published_at', '-date_created'],
          limit: params?.limit,
          offset: params?.offset,
          fields: (params?.fields as any) || ['*'],
        })
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
        readItems('articles', {
          filter: {
            code: { _eq: code },
            status: { _eq: 'published' },
          },
          limit: 1,
        })
      )

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
