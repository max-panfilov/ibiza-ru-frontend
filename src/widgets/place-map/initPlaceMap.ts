// src/widgets/place-map/initPlaceMap.ts
// Инициализация карты для страницы объекта (widget layer).

import { loadGoogleMaps } from '@/shared/lib/loadGoogleMaps'

export interface InitPlaceMapParams {
  elementId: string
  title: string
  lat: number
  lng: number
  apiKey: string
  zoom?: number
}

/**
 * Создаёт карту Google и ставит маркер объекта.
 * Важно: функция должна вызываться только в браузере.
 */
export async function initPlaceMap(params: InitPlaceMapParams): Promise<void> {
  const { elementId, title, lat, lng, apiKey, zoom = 15 } = params

  // Защита от SSR/SSG: в сборке Astro этот код не должен выполняться.
  if (typeof window === 'undefined') return

  const el = document.getElementById(elementId)
  if (!el) return

  // Загружаем Google Maps API с русским языком.
  const googleApi = await loadGoogleMaps({ apiKey, language: 'ru', region: 'RU' })

  const position: google.maps.LatLngLiteral = { lat, lng }

  // Создаём карту.
  const map = new googleApi.maps.Map(el, {
    center: position,
    zoom,
    // Убираем лишние контролы, чтобы вид был чище на карточке объекта.
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    // Чтобы скролл страницы не «залипал» на карте.
    gestureHandling: 'cooperative',
  })

  // Ставим маркер объекта.
  new googleApi.maps.Marker({
    position,
    map,
    title,
  })
}
