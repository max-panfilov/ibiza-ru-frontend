// src/shared/lib/loadGoogleMaps.ts
// Утилита для загрузки Google Maps JavaScript API на клиенте.
// Изолируем работу с глобальным <script> и window.google (Clean Architecture - shared lib).

export interface LoadGoogleMapsParams {
  apiKey: string
  /**
   * Язык интерфейса/подписей карты. Для русского: 'ru'.
   */
  language?: string
  /**
   * Регион (bias) — обычно двухбуквенный код страны. Для РФ: 'RU'.
   */
  region?: string
  /**
   * Версия API (например, 'weekly').
   */
  v?: string
}

// Кэшируем загрузку, чтобы при повторном вызове не добавлять второй <script>.
let googleMapsLoadingPromise: Promise<typeof google> | null = null

/**
 * Загружает Google Maps JS API (client-only).
 * Возвращает `google`, когда `google.maps` готов.
 */
export function loadGoogleMaps(params: LoadGoogleMapsParams): Promise<typeof google> {
  // На сервере (SSR/SSG) доступа к window нет.
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('loadGoogleMaps() должен вызываться только в браузере'))
  }

  // Если API уже загружен — сразу возвращаем.
  if (window.google?.maps) {
    return Promise.resolve(window.google)
  }

  // Если загрузка уже началась — возвращаем тот же промис.
  if (googleMapsLoadingPromise) {
    return googleMapsLoadingPromise
  }

  const { apiKey, language = 'ru', region = 'RU', v = 'weekly' } = params

  googleMapsLoadingPromise = new Promise((resolve, reject) => {
    // Если скрипт уже добавлен кем-то ещё — подождём его загрузку.
    const existing = document.getElementById('google-maps-js-api') as HTMLScriptElement | null
    if (existing) {
      // Скрипт мог быть уже загружен к моменту подписки на события.
      if (window.google?.maps) {
        resolve(window.google)
        return
      }

      existing.addEventListener('load', () => {
        if (window.google?.maps) resolve(window.google)
        else reject(new Error('Google Maps скрипт загрузился, но window.google.maps недоступен'))
      })
      existing.addEventListener('error', () => reject(new Error('Не удалось загрузить Google Maps JS API')))
      return
    }

    // Собираем URL загрузчика.
    const url = new URL('https://maps.googleapis.com/maps/api/js')
    url.searchParams.set('key', apiKey)
    url.searchParams.set('language', language)
    url.searchParams.set('region', region)
    url.searchParams.set('v', v)

    const script = document.createElement('script')
    script.id = 'google-maps-js-api'
    script.src = url.toString()
    script.async = true
    script.defer = true

    script.addEventListener('load', () => {
      if (window.google?.maps) resolve(window.google)
      else reject(new Error('Google Maps скрипт загрузился, но window.google.maps недоступен'))
    })

    script.addEventListener('error', () => {
      reject(new Error('Не удалось загрузить Google Maps JS API'))
    })

    document.head.appendChild(script)
  })

  return googleMapsLoadingPromise
}
