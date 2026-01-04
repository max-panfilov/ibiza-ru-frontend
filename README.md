# Ibiza.ru — фронтенд (Astro прототип)

Статический сайт на Astro (SSG) с контентом из Directus.

## Быстрый старт

1) Установка зависимостей:

```sh
npm install
```

2) Локальная разработка:

```sh
npm run dev
```

3) Проверки:

```sh
npm run typecheck
npm run check
```

4) Прод-сборка:

```sh
npm run build
```

## Скрипты

- `npm run dev` — dev-сервер
- `npm run build` — сборка в `dist/`
- `npm run preview` — локальный просмотр `dist/`
- `npm run typecheck` — TypeScript (`tsc --noEmit`)
- `npm run check` — `astro check`

## Переменные окружения

Важно: правки в `.env` не делаем.

- `PUBLIC_DIRECTUS_URL`
  - URL Directus API.
  - Если не задано, используется `http://localhost:8055` (см. `src/shared/api/client.ts`).
- `PUBLIC_GOOGLE_MAPS_API_KEY`
  - API key для Google Maps JS API.
  - Ключ должен быть **публичным** (с префиксом `PUBLIC_`), но обязательно ограничить по доменам (HTTP referrers).

## SEO и индексация

### 1) Генерация страниц и зависимость от Directus

Проект собирается в режиме статического вывода (`output: 'static'`). Это означает:

- Страницы списков и карточек (`/hotels`, `/hotels/<code>`, `/restaurants/...`, `/articles/...` и т.д.) **рендерятся в HTML на этапе `npm run build`**.
- Для сборки нужны данные из Directus (в т.ч. для `getStaticPaths()` на динамических маршрутах).

Важно:
- На прод-сборке, если Directus недоступен/ошибка API при `getStaticPaths()`, билд **упадёт**, чтобы не задеплоить «пустой сайт» без страниц.

### 2) Sitemap

Sitemap генерируется автоматически **во время `npm run build`** интеграцией `@astrojs/sitemap`:

- `dist/sitemap-index.xml`
- `dist/sitemap-0.xml`

При обновлении контента в Directus sitemap обновится **после пересборки и деплоя**.

Конфигурация:
- `astro.config.mjs` содержит `site: 'https://ibiza.ru'` — это важно для корректных абсолютных URL в sitemap.

### 3) robots.txt

Файл `public/robots.txt` копируется в `dist/robots.txt` и содержит ссылку на sitemap:

- `Sitemap: https://ibiza.ru/sitemap-index.xml`

### 4) Meta-теги для шаринга и индексации

В `src/layouts/SiteLayout.astro` добавлены:

- `<meta name="robots" content="index,follow">`
- Open Graph (`og:*`) и Twitter Cards (`twitter:*`)
- JSON-LD (`application/ld+json`) базового уровня (Organization/WebSite/WebPage)

На листингах и детальных страницах дополнительно прокидываются:
- `ogImage` (если есть обложка у сущности/первого элемента списка)
- `structuredData` (JSON-LD) для:
  - листингов (`CollectionPage` + `ItemList`)
  - карточек (например `Hotel`, `Restaurant`, `NightClub`, `TouristAttraction`)
  - статей (`BlogPosting`)

### 5) Хлебные крошки

`src/shared/ui/Breadcrumbs.astro` выводит:
- HTML-крошки
- JSON-LD `BreadcrumbList`

### 6) Google Maps

Карта на страницах объектов подключается на клиенте и не влияет на индексируемость основного контента.

Поведение:
- клиентский код карты загружается **после события `window.load`**, чтобы не мешать первичной отрисовке контента страницы (без ожидания клика/доскролла).

## Деплой

Проект рассчитан на прод-домен `https://ibiza.ru`:

- `canonical` в страницах выставлен под этот домен
- `site` в `astro.config.mjs` — `https://ibiza.ru`

Если когда-либо потребуется деплой на другой домен, нужно синхронизировать `site` и `canonical` стратегию.
