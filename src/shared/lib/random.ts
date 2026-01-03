// src/shared/lib/random.ts
// Утилиты для работы со случайными данными.

/**
 * Возвращает новый массив из не более чем `count` случайных элементов исходного массива.
 * Исходный массив не мутируется.
 */
export function pickRandomItems<T>(items: T[], count: number): T[] {
  // Если элементов меньше или столько же, просто возвращаем копию
  if (items.length <= count) {
    return [...items]
  }

  // Клонируем массив, чтобы не менять исходные данные (SRP, отсутствие побочек)
  const copy = [...items]

  // Перемешиваем массив алгоритмом Фишера–Йетса
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }

  // Берём нужное количество элементов из начала перемешанного массива
  return copy.slice(0, count)
}
