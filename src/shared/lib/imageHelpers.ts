// src/shared/lib/imageHelpers.ts
// Вспомогательные функции для работы с изображениями из Directus

import { DIRECTUS_URL } from '@/shared/api/client'
import type { ImageJunctionDTO, DirectusFileDTO } from '@/shared/api/types'

/**
 * Базовый тип изображения для UI
 */
export interface DomainImage {
  id: string
  url: string
  alt?: string
  isCover?: boolean
}

/**
 * Извлечь URL файла из junction DTO или прямого ID
 */
export function extractFileUrl(fileData: string | DirectusFileDTO): string {
  if (typeof fileData === 'string') {
    return `${DIRECTUS_URL}/assets/${fileData}`
  }
  return `${DIRECTUS_URL}/assets/${fileData.id}`
}

/**
 * Маппер изображения из junction DTO в доменную модель
 */
export function mapImageDto(imageDto: ImageJunctionDTO): DomainImage {
  return {
    id: imageDto.id,
    url: extractFileUrl(imageDto.file_id),
    alt: imageDto.alt_text,
    isCover: imageDto.is_cover,
  }
}

/**
 * Найти обложечное изображение или первое по списку
 */
export function getCoverImage(images?: ImageJunctionDTO[]): DomainImage | undefined {
  if (!images || images.length === 0) return undefined
  
  const coverImage = images.find(img => img.is_cover) || images[0]
  return mapImageDto(coverImage)
}

/**
 * Мапп все изображения
 */
export function mapAllImages(images?: ImageJunctionDTO[]): DomainImage[] | undefined {
  if (!images || images.length === 0) return undefined
  return images.map(mapImageDto)
}

/**
 * Создать URL для изображения с трансформацией
 * @param fileId - ID файла в Directus
 * @param params - параметры трансформации (width, height, quality, format, etc.)
 */
export function getImageUrl(fileId: string, params?: {
  width?: number
  height?: number
  quality?: number
  format?: 'auto' | 'jpg' | 'png' | 'webp' | 'tiff'
  fit?: 'cover' | 'contain' | 'inside' | 'outside'
  withoutEnlargement?: boolean
}): string {
  const url = new URL(`${DIRECTUS_URL}/assets/${fileId}`)
  
  if (params) {
    if (params.width) url.searchParams.set('width', params.width.toString())
    if (params.height) url.searchParams.set('height', params.height.toString())
    if (params.quality) url.searchParams.set('quality', params.quality.toString())
    if (params.format) url.searchParams.set('format', params.format)
    if (params.fit) url.searchParams.set('fit', params.fit)
    if (params.withoutEnlargement) url.searchParams.set('withoutEnlargement', 'true')
  }
  
  return url.toString()
}
