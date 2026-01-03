// src/lib/formatDate.ts
// Форматирование дат для UI (русская локаль).

export function formatDateRu(isoDate: string): string {
  // В прототипе достаточно Intl, без сторонних библиотек.
  const d = new Date(isoDate)
  if (Number.isNaN(d.getTime())) return isoDate

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

export function formatDateTimeRu(isoDateTime: string): string {
  const d = new Date(isoDateTime)
  if (Number.isNaN(d.getTime())) return isoDateTime

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}
