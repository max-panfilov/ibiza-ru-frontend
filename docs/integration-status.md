# Статус интеграции с Directus API

Этот документ отслеживает прогресс интеграции фронтенда с реальным API Directus согласно `docs/frontend-api.md`.

## ✅ Выполнено

### Инфраструктура
- ✅ Обновлены типы DTO в `src/shared/api/types.ts` под реальную схему Directus
- ✅ Создан `src/shared/lib/imageHelpers.ts` с утилитами для работы с изображениями
- ✅ Типы теперь используют UUID вместо number для ID
- ✅ Поддержка junction таблиц для изображений (O2M связи)
- ✅ Поддержка `is_cover` для обложечных изображений
- ✅ Функции для трансформации изображений через `/assets`

### Entity: Club
- ✅ Обновлена доменная модель `src/entities/club/model/types.ts`
  - Добавлен тип `ClubImage` для изображений
  - Обновлены поля: `name` → `title`, добавлены `latitude/longitude`, `entryFee`
  - Изображения через `coverImage` и `images[]`
- ✅ Обновлен репозиторий `src/entities/club/api/clubRepository.ts`
  - Использует `shared/lib/imageHelpers` для маппинга изображений
  - Запросы с `deep` для сортировки изображений по `sort`
  - Для списка: `_limit=1` на images (только первое)
  - Для детальной: все изображения с сортировкой
  - Убран фильтр по `status` (его нет в схеме)

## ⏳ Требуется обновить

### Entity: Hotel
**Файлы:**
- `src/entities/hotel/model/types.ts`
- `src/entities/hotel/api/hotelRepository.ts`

**Что нужно сделать:**
1. Обновить типы в model:
   ```typescript
   import type { DomainImage } from '@/shared/lib/imageHelpers'
   
   export interface Hotel {
     code: string
     title: string // было: title
     description?: string // было: summary
     coverImage?: DomainImage
     address?: string
     latitude?: number
     longitude?: number
     phone?: string
     email?: string
     website?: string
     priceRange?: string
     starRating?: number // было: stars
     images?: DomainImage[]
   }
   ```

2. Обновить repository:
   - Импортировать `getCoverImage, mapAllImages` из `@/shared/lib/imageHelpers`
   - Обновить маппинг:
     ```typescript
     title: dto.name, // вместо dto.title
     description: dto.description, // вместо dto.summary
     coverImage: getCoverImage(dto.images),
     starRating: dto.star_rating, // вместо dto.stars
     images: mapAllImages(dto.images),
     ```
   - Обновить запросы (убрать `status`, добавить `images` fields, `deep`)
   - Копировать логику из `clubRepository.ts`

### Entity: Beach
**Файлы:**
- `src/entities/beach/model/types.ts`
- `src/entities/beach/api/beachRepository.ts`

**Что нужно сделать:**
1. Обновить типы (аналогично Hotel, но с `location` вместо address)
2. Обновить repository (аналогично Hotel)

### Entity: Restaurant
**Файлы:**
- `src/entities/restaurant/model/types.ts`
- `src/entities/restaurant/api/restaurantRepository.ts`

**Что нужно сделать:**
1. Обновить типы (аналогично Hotel)
2. Обновить repository (аналогично Hotel)

### Entity: Article
**Файлы:**
- `src/entities/article/model/types.ts`
- `src/entities/article/api/articleRepository.ts`

**Что нужно сделать:**
1. Обновить типы:
   ```typescript
   export interface Article {
     code: string
     title: string
     summary: string
     content: string // было: contentHtml
     author?: string
     publishedAt?: string
     coverImage?: DomainImage // cover_file_id
     images?: DomainImage[]
   }
   ```

2. Обновить repository:
   - Маппинг `cover_file_id` → `coverImage` через `extractFileUrl`
   - Убрать `status` из фильтров
   - `content` вместо `content_html`

### Entity: PartyEvent → PartySchedule
**Файлы:**
- Переименовать: `src/entities/party-event/` → `src/entities/party-schedule/`
- `src/entities/party-schedule/model/types.ts`
- `src/entities/party-schedule/api/partyScheduleRepository.ts`

**Что нужно сделать:**
1. Переименовать папку и файлы
2. Обновить типы:
   ```typescript
   export interface PartySchedule {
     eventName: string // вместо title
     clubId?: string
     date?: string
     startTime?: string
     endTime?: string
     description?: string
     ticketPrice?: string
     ticketLink?: string
     coverImage?: DomainImage
     images?: DomainImage[]
   }
   ```

3. Обновить repository:
   - Коллекция: `party_schedule` вместо `party_events`
   - Маппинг полей
   - Убрать `status`

### Страницы
После обновления entities нужно обновить:
- `src/pages/party-schedule/index.astro` - использовать `eventName` вместо `title`
- Все страницы - проверить использование полей `title/summary` → `title/description`
- Компоненты - обновить props если нужно

## Шаблон для быстрого обновления entity

Для ускорения обновления, вот шаблон:

### 1. Model (types.ts)
```typescript
import type { DomainImage } from '@/shared/lib/imageHelpers'

export interface EntityName {
  code: string
  title: string
  description?: string
  coverImage?: DomainImage
  // ... специфичные поля
  images?: DomainImage[]
}
```

### 2. Repository imports
```typescript
import { getCoverImage, mapAllImages } from '@/shared/lib/imageHelpers'
import type { EntityDTO, QueryParams } from '@/shared/api/types'
import type { EntityName } from '../model/types'
```

### 3. Repository mapper
```typescript
function mapDtoToDomain(dto: EntityDTO): EntityName {
  return {
    code: dto.code,
    title: dto.name,
    description: dto.description,
    coverImage: getCoverImage(dto.images),
    // ... специфичные поля
    images: mapAllImages(dto.images),
  }
}
```

### 4. Repository getAll query
```typescript
const entities = await directusClient.request(
  readItems('collection_name', {
    filter: params?.filter,
    sort: (params?.sort as any) || ['-created_at'],
    limit: params?.limit,
    offset: params?.offset,
    fields: (params?.fields as any) || [
      '*',
      'images.id',
      'images.file_id.id',
      'images.file_id.filename_download',
      'images.sort',
      'images.alt_text',
      'images.is_cover',
    ],
    deep: {
      images: {
        _sort: ['sort'],
        _limit: 1,
      },
    },
  } as any)
) as unknown as EntityDTO[]
```

### 5. Repository getByCode query
```typescript
const entities = await directusClient.request(
  readItems('collection_name', {
    filter: {
      code: { _eq: code },
    },
    limit: 1,
    fields: [
      '*',
      'images.*',
      'images.file_id.*',
    ] as any,
    deep: {
      images: {
        _sort: ['sort'],
      },
    },
  } as any)
) as unknown as EntityDTO[]
```

## Проверка после обновления

После обновления всех entities:

1. **TypeScript компиляция:**
   ```bash
   npx tsc --noEmit
   ```

2. **Обновить документацию:**
   - `docs/directus-collections-mapping.md` - актуализировать примеры
   - Добавить информацию о `getCoverImage` и работе с изображениями

3. **Тестирование:**
   - Проверить, что все страницы компилируются
   - Убедиться, что маппинг полей корректен
   - Проверить, что изображения отображаются (когда будет подключен Directus)

## Следующие шаги

1. Обновить оставшиеся 5 entities (Hotel, Beach, Restaurant, Article, PartySchedule)
2. Обновить страницы для использования новых типов
3. Проверить TypeScript компиляцию
4. Протестировать с реальным Directus API
5. Обновить компоненты EntityCard для работы с новыми типами изображений

## Полезные ссылки

- API документация: `docs/frontend-api.md`
- Маппинг коллекций: `docs/directus-collections-mapping.md`
- Врезки в статьях: `docs/article-embeds.md`
- Хелперы изображений: `src/shared/lib/imageHelpers.ts`
- Пример (Club): `src/entities/club/`
