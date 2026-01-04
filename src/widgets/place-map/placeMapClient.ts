// src/widgets/place-map/placeMapClient.ts
// Клиентский entrypoint (бандлится Astro/Vite).
// Ищет все элементы карты по data-атрибутам и инициализирует Google Maps.

import { initPlaceMap } from './initPlaceMap'

function parseNumber(value: string | undefined): number | null {
  if (!value) return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

async function initElement(el: HTMLElement): Promise<void> {
  // Делаем инициализацию идемпотентной: если скрипт подключили несколько раз — не создаём карту повторно.
  if (el.dataset.placeMapInitialized === 'true') return
  el.dataset.placeMapInitialized = 'true'

  const elementId = el.id
  const title = el.dataset.title ?? ''
  const apiKey = el.dataset.apiKey

  const lat = parseNumber(el.dataset.lat)
  const lng = parseNumber(el.dataset.lng)
  const zoom = parseNumber(el.dataset.zoom) ?? 15

  // Если не хватает данных — просто выходим.
  if (!elementId || !apiKey || lat === null || lng === null) return

  try {
    await initPlaceMap({ elementId, title, lat, lng, apiKey, zoom })
  } catch (error) {
    // Не бросаем ошибку наверх, чтобы не ломать страницу.
    // eslint-disable-next-line no-console
    console.error('Не удалось инициализировать карту Google Maps:', error)
  }
}

// Инициализируем все карты на странице.
const els = document.querySelectorAll<HTMLElement>('[data-place-map]')
els.forEach((el) => {
  void initElement(el)
})
