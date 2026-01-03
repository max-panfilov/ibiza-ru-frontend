// src/shared/api/client.ts
// Directus SDK клиент для работы с REST API (Clean Architecture - Frameworks & Drivers layer)

import { createDirectus, rest } from '@directus/sdk'
import type { DirectusSchema } from './types'

// Получаем URL из переменных окружения
const directusUrl = import.meta.env.PUBLIC_DIRECTUS_URL || 'http://localhost:8055'

/**
 * Инициализация Directus клиента с REST API
 * Клиент используется всеми репозиториями для выполнения запросов
 */
export const directusClient = createDirectus<DirectusSchema>(directusUrl).with(rest())

/**
 * Экспортируем URL для использования в других модулях (например, для построения ссылок на изображения)
 */
export const DIRECTUS_URL = directusUrl
