# Google Maps на страницах объектов

## Цель
На страницах объектов (клуб/отель/ресторан/пляж) отображать Google Maps с подписями на русском языке и маркером объекта.

## Где в коде
- Виджет: `src/widgets/place-map/PlaceMap.astro`
- Инициализация карты (client-only): `src/widgets/place-map/initPlaceMap.ts`
- Загрузчик Google Maps JS API: `src/shared/lib/loadGoogleMaps.ts`

## Данные
Координаты берутся из доменной модели объекта:
- `latitude?: number`
- `longitude?: number`

Эти поля уже маппятся из Directus (`PlaceDTO.latitude/longitude`) в `mapPlaceDto()`.

## Настройка Google Cloud
1. В Google Cloud Console включите биллинг для проекта.
2. Включите API:
   - **Maps JavaScript API**
3. Создайте API key.
4. Ограничьте ключ:
   - Application restriction: **HTTP referrers (web sites)**
   - Добавьте домены (например):
     - `http://localhost:*/*`
     - `https://ibiza.ru/*`
     - `https://*.ibiza.ru/*`
   - API restrictions: **Restrict key** → выберите **Maps JavaScript API**

## Переменная окружения
Ключ используется в браузере, поэтому нужен префикс `PUBLIC_`.

Добавьте переменную окружения:
- `PUBLIC_GOOGLE_MAPS_API_KEY=...`

Важно: не храните ключ «как есть» без ограничений — обязательно ограничьте HTTP referrer.

## Язык карты
Язык принудительно задаётся при загрузке скрипта параметрами:
- `language=ru`
- `region=RU`

Это реализовано в `loadGoogleMaps()`.

## Поведение без координат
Если у объекта нет `latitude/longitude`, виджет покажет текстовый фоллбек.
