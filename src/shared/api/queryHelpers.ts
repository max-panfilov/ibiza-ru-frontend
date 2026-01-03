// src/shared/api/queryHelpers.ts
// Вспомогательные функции для работы с query параметрами

/**
 * Удаляет undefined значения из объекта
 * Directus SDK сериализует undefined как строку "undefined", что вызывает ошибку 400
 */
export function cleanQueryParams<T extends Record<string, unknown>>(params: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined)
  ) as Partial<T>
}
