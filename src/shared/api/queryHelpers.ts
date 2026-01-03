// src/shared/api/queryHelpers.ts
// Вспомогательные функции для работы с query параметрами

/**
 * Удаляет undefined значения из объекта
 * Directus SDK сериализует undefined как строку "undefined", что вызывает ошибку 400
 */
export function cleanQueryParams<T extends Record<string, any>>(params: T): Partial<T> {
  const cleaned: any = {}
  
  for (const key in params) {
    if (params[key] !== undefined) {
      cleaned[key] = params[key]
    }
  }
  
  return cleaned
}
