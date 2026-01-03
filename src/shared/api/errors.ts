// src/shared/api/errors.ts
// Обработка ошибок API (Clean Architecture - Interface Adapters layer)

/**
 * Базовый класс для ошибок API
 * Наследуется от стандартного Error для совместимости
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Ошибка "Не найдено"
 */
export class NotFoundError extends ApiError {
  constructor(resource: string, identifier: string) {
    super(`${resource} с идентификатором "${identifier}" не найден`, 404)
    this.name = 'NotFoundError'
  }
}

/**
 * Обработчик ошибок API
 * Преобразует различные типы ошибок в ApiError
 */
export function handleApiError(error: unknown, context?: string): ApiError {
  // Если это уже ApiError, возвращаем как есть
  if (error instanceof ApiError) {
    return error
  }

  // Обработка стандартных ошибок
  if (error instanceof Error) {
    return new ApiError(
      context ? `${context}: ${error.message}` : error.message,
      undefined,
      error
    )
  }

  // Обработка неизвестных ошибок
  return new ApiError(
    context ? `${context}: Неизвестная ошибка` : 'Неизвестная ошибка',
    undefined,
    error
  )
}

/**
 * Логирование ошибок API (для дебага)
 */
export function logApiError(error: ApiError): void {
  console.error('[API Error]', {
    name: error.name,
    message: error.message,
    statusCode: error.statusCode,
    originalError: error.originalError,
  })
}
