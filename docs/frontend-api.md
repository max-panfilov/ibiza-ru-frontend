# Публичное API для фронтенда (Directus)
Документ описывает контракт API, который используется фронтендом (Astro) для чтения контента и работы с изображениями.

## 1) Базовые понятия и URL
- Базовый URL API (пример): `https://api.ibiza.ru`
- REST Items API: `GET /items/{collection}`
- REST Single Item API: `GET /items/{collection}/{id}`
- Assets (изображения/трансформации): `GET /assets/{fileId}`
- Files (метаданные файла): `GET /files/{fileId}`

Важно:
- В разных инсталляциях Directus API может быть за префиксом `/api`. Если у вас так — используйте базу вида `https://api.ibiza.ru/api`.

## 2) Доступ и безопасность
Файлы (изображения) — публичные.

Рекомендуемая модель доступа для фронтенда:
- Роль `Public` (анонимный доступ) получает **только read** на нужные коллекции и `directus_files`.
- Запись/изменение контента с фронтенда не предусмотрены.

Если хотите дополнительный контроль (например, rate-limit на уровне приложения), можно выдавать фронтенду Static Access Token с read-only правами, но для публичного сайта обычно достаточно анонимной роли.

## 3) Query-параметры (как запрашивать данные эффективно)
Directus поддерживает мощные query-параметры. Ключевые:

### 3.1 `fields`
Используйте `fields`, чтобы не тянуть лишнее.

Форматы:
- строкой: `?fields=id,name,images.file_id.filename_download`
- массивом: `?fields[]=id&fields[]=name&fields[]=images.file_id.filename_download`

Поддерживается dot-notation для связанных данных и `*`:
- `fields=*` — все поля текущей сущности
- `fields=*,images.*` — плюс все поля у связанных `images`

### 3.2 `filter`
Примеры:
- `?filter[code][_eq]=my-code`
- `?filter[name][_contains]=ibiza`

### 3.3 `sort`
Пример:
- `?sort=sort,-date_created`

Для галерей важно сортировать по `sort`:
- `deep[images][_sort]=sort`

### 3.4 `limit`, `page`, `offset`
- `?limit=20&page=1`

### 3.5 `deep` (управление вложенными связями)
`deep` позволяет задавать фильтры/лимиты/сортировки для вложенных связей.

Пример (сортируем картинки внутри ресторана):
- `?deep[images][_sort]=sort`

## 4) Коллекции (collections) и поля
Ниже — основные коллекции, которые предполагается использовать на фронтенде.

Примечание:
- Полный список полей в Directus UI зависит от метаданных. Но физические поля таблиц БД приведены ниже (ключевые и наиболее полезные для фронтенда).

### 4.1 Restaurants (`restaurants`)
Ключевые поля:
- `id: uuid`
- `name: text`
- `description: text`
- `address: text`
- `latitude: float8`, `longitude: float8`
- `price_range: text`
- `website: text`, `phone: text`, `email: text`
- `code: text` (может использоваться как slug/код)
- `created_at: timestamptz`, `updated_at: timestamptz`

Связи:
- `images` — виртуальное O2M поле (галерея), связано с `restaurant_images`.

### 4.2 Restaurant Images (`restaurant_images`)
Поля:
- `id: uuid`
- `restaurant_id: uuid` (ссылка на `restaurants.id`)
- `file_id: uuid` (ссылка на `directus_files.id`)
- `sort: int4` (порядок)
- `alt_text: text`
- `is_cover: boolean`
- `created_at: timestamptz`

### 4.3 Hotels (`hotels`) и `hotel_images`
`hotels`:
- `id`, `name`, `description`, `address`, `latitude`, `longitude`
- `star_rating: int4`
- `price_range`, `website`, `phone`, `email`, `code`, `created_at`, `updated_at`
- `images` (O2M, галерея) → `hotel_images`

`hotel_images` аналогично `restaurant_images`:
- `hotel_id`, `file_id`, `sort`, `alt_text`, `is_cover`, ...

### 4.4 Beaches (`beaches`) и `beach_images`
`beaches`:
- `id`, `name`, `description`, `location`, `latitude`, `longitude`, `code`, `created_at`, `updated_at`
- `images` (O2M) → `beach_images`

`beach_images`:
- `beach_id`, `file_id`, `sort`, `alt_text`, `is_cover`, ...

### 4.5 Clubs (`clubs`) и `club_images`
`clubs`:
- `id`, `name`, `description`, `address`, `latitude`, `longitude`
- `entry_fee: text`
- `website`, `phone`, `email`, `code`, `created_at`, `updated_at`
- `images` (O2M) → `club_images`

`club_images`:
- `club_id`, `file_id`, `sort`, `alt_text`, `is_cover`, ...

### 4.6 Articles (`articles`) и `article_images`
`articles`:
- `id: uuid`
- `title: text`
- `summary: text`
- `content: text`
- `author: text`
- `published_at: timestamptz`
- `cover_file_id: uuid` (ссылка на `directus_files.id`)
- `code: text`
- `created_at`, `updated_at`
- `images` (O2M) → `article_images`

`article_images`:
- `article_id`, `file_id`, `sort`, `alt_text`, `is_cover`, ...

### 4.7 Party schedule (`party_schedule`) и `party_images`
`party_schedule`:
- `id: uuid`
- `event_name: text`
- `club_id: uuid` (ссылка на `clubs.id`)
- `date: date`, `start_time: time`, `end_time: time`
- `description: text`
- `ticket_price: text`, `ticket_link: text`
- `created_at`, `updated_at`

`party_images`:
- `party_id: uuid`
- `file_id: uuid`
- `sort`, `alt_text`, `is_cover`, `created_at`

### 4.8 Справочники
- `tags`: `id`, `name`, `code`, `created_at`, `updated_at`
- `cuisines`: `id`, `name`, `code`, `created_at`, `updated_at`
- `music_genres`: `id`, `name`, `code`, `created_at`, `updated_at`
- `facilities`: `id`, `name`, `code`, `created_at`, `updated_at`

### 4.9 Junction (таблицы связей M2M)
Если на фронтенде нужно получать связи «многие-ко-многим», используем junction-таблицы:
- `restaurant_cuisines`: `restaurant_id`, `cuisine_id`
- `club_music_genres`: `club_id`, `genre_id`
- `beach_facilities`: `beach_id`, `facility_id`
- `article_tags`: `article_id`, `tag_id`

## 5) Как запрашивать галереи и файлы

### 5.1 Пример: список ресторанов с одной (обложечной) картинкой
Идея: на фронтенде показываем первую картинку (по `sort`) как превью.

Запрос:
- `GET /items/restaurants?fields=id,name,code,images.id,images.sort,images.is_cover,images.file_id.id,images.file_id.filename_download&deep[images][_sort]=sort&deep[images][_limit]=1`

Примечание:
- Если хотите приоритетно выбирать `is_cover=true`, можно фильтровать/сортировать по нему (в зависимости от нужной логики).

### 5.2 Пример: страница ресторана с полной галереей
- `GET /items/restaurants/{id}?fields=*,images.*,images.file_id.*&deep[images][_sort]=sort`

### 5.3 Файлы (метаданные)
- `GET /files/{fileId}` возвращает метаданные файла (размеры, mime type, filename и т.д.).

На практике фронтенду чаще достаточно `directus_files.id` + `filename_download` + `width/height`.

## 6) Изображения, миниатюры и разные разрешения

### 6.1 Почему “сжатие/ресайз” лучше делать через `/assets` на бэке
Если отдавать оригиналы, то:
- мобильные будут скачивать слишком большие картинки
- LCP/CLS ухудшатся

Правильный паттерн:
- фронтенд запрашивает **нужный размер** через `/assets/{fileId}?width=...&quality=...&format=...`
- Directus создаёт трансформ на лету и кэширует его (повторные запросы быстрые)

### 6.2 Базовые параметры трансформации
Endpoint:
- `GET /assets/{fileId}`

Параметры:
- `width` (px)
- `height` (px)
- `fit`: `cover` (default), `contain`, `inside`, `outside`
- `quality`: 1..100
- `withoutEnlargement`: `true|false`
- `format`: `auto`, `jpg`, `png`, `webp`, `tiff`

Пример:
- `/assets/<fileId>?width=640&quality=75&format=webp&withoutEnlargement=true`

### 6.3 Рекомендуемые пресеты для `srcset`
Обычно хватает набора:
- 320w, 640w, 960w, 1280w (иногда + 1920w для hero)

Пример (идея):
- `src` = 640w
- `srcset` = 320/640/960/1280
- `sizes` — под вашу сетку

### 6.4 Кэширование
Так как файлы публичные:
- `/assets/{fileId}` можно кэшировать на CDN (важно учитывать query-string в cache key)
- разные комбинации `width/quality/format` → разные варианты (и разные ключи кэша)

## 7) Рекомендации по контракту для фронтенда
1) Всегда используйте `fields` (не тяните `*` без необходимости).
2) Для галерей: сортируйте `images` по `sort` через `deep[images][_sort]=sort`.
3) Для превью-картинок используйте `/assets` с `width` и `format=webp` (или `format=auto`).
4) В UI можно полагаться на:
   - `alt_text` для `alt`
   - `is_cover` для логики обложек

## 8) Что нужно уточнить (чтобы зафиксировать контракт окончательно)
1) Какие страницы/разделы есть на фронтенде (список + карточка для каких сущностей)?
2) Как вы хотите формировать URL на фронте:
   - по `id`
   - по `code` как slug (тогда нужно договориться, что `code` уникален)
3) Нужна ли “публикация” (статус draft/published) для сущностей или всё публично всегда?
4) Нужна ли локализация контента?
