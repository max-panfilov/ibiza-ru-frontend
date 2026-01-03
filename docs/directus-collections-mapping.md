# Маппинг коллекций Directus

Эта документация описывает структуру коллекций в Directus и их соответствие доменным типам в приложении.

## Обзор архитектуры

Приложение использует Clean Architecture + Feature-Sliced Design:

```
Directus API (DTO) → Repository (маппинг) → Domain Model → UI
```

- **DTO** (Data Transfer Object) - типы из `src/shared/api/types.ts`, соответствующие схеме Directus
- **Domain Model** - типы из `src/entities/{entity}/model/types.ts`, используемые в UI
- **Repository** - слой в `src/entities/{entity}/api/`, выполняющий маппинг и обработку ошибок

## Базовые коллекции

### 1. clubs (Клубы)

**Коллекция в Directus:** `clubs`

#### Поля коллекции

| Поле Directus | Тип | Обязательное | Описание |
|---------------|-----|--------------|----------|
| `id` | integer | Да | Первичный ключ |
| `status` | string | Да | draft / published / archived |
| `code` | string | Да | Уникальный slug для URL (например, "neon-arena") |
| `title` | string | Да | Название клуба |
| `summary` | string | Да | Краткое описание |
| `cover_image` | file | Нет | ID файла обложки |
| `location` | string | Нет | Локация на острове |
| `address` | string | Нет | Полный адрес |
| `phone` | string | Нет | Телефон |
| `website` | string | Нет | URL сайта |
| `price_level` | string | Нет | €, €€, €€€ или €€€€ |
| `rating` | float | Нет | Рейтинг 0-5 |
| `tags` | json | Нет | Массив строк с тегами |
| `gallery_images` | json | Нет | Массив ID файлов |
| `date_created` | timestamp | Авто | Дата создания |
| `date_updated` | timestamp | Авто | Дата обновления |

#### Маппинг на доменную модель

```typescript
// DTO → Domain
{
  id: number → (не используется в UI)
  status: string → (фильтруется в репозитории)
  code: string → code: string
  title: string → title: string
  summary: string → summary: string
  cover_image: string → coverImage?: string
  location: string → location?: string
  address: string → address?: string
  phone: string → phone?: string
  website: string → website?: string
  price_level: string → priceLevel?: '€' | '€€' | '€€€' | '€€€€'
  rating: number → rating?: number
  tags: string[] → tags?: string[]
  gallery_images: string[] → galleryImages?: string[]
}
```

#### Примеры запросов

```typescript
// Получить все опубликованные клубы
await directusClient.request(
  readItems('clubs', {
    filter: { status: { _eq: 'published' } },
    sort: ['-date_created'],
  })
)

// Получить клуб по коду
await directusClient.request(
  readItems('clubs', {
    filter: {
      code: { _eq: 'neon-arena' },
      status: { _eq: 'published' },
    },
    limit: 1,
  })
)
```

---

### 2. hotels (Отели)

**Коллекция в Directus:** `hotels`

Наследует все поля от `clubs` + дополнительные:

| Поле Directus | Тип | Описание |
|---------------|-----|----------|
| `stars` | integer | Количество звезд (1-5) |
| `check_in` | string | Время заезда (например, "15:00") |
| `check_out` | string | Время выезда (например, "12:00") |

---

### 3. beaches (Пляжи)

**Коллекция в Directus:** `beaches`

Использует базовые поля (без address, phone, website, check_in/check_out).

---

### 4. restaurants (Рестораны)

**Коллекция в Directus:** `restaurants`

Наследует базовые поля + дополнительное:

| Поле Directus | Тип | Описание |
|---------------|-----|----------|
| `opening_hours` | string | Часы работы (например, "Ежедневно 12:00–00:00") |

---

### 5. articles (Статьи)

**Коллекция в Directus:** `articles`

#### Поля коллекции

| Поле Directus | Тип | Обязательное | Описание |
|---------------|-----|--------------|----------|
| `id` | integer | Да | Первичный ключ |
| `status` | string | Да | draft / published / archived |
| `code` | string | Да | Уникальный slug для URL |
| `title` | string | Да | Заголовок статьи |
| `summary` | string | Да | Краткое описание |
| `cover_image` | file | Нет | ID файла обложки |
| `content_html` | text | Да | HTML контент статьи |
| `published_at` | timestamp | Нет | Дата публикации |
| `author` | string | Нет | Автор статьи |
| `date_created` | timestamp | Авто | Дата создания |
| `date_updated` | timestamp | Авто | Дата обновления |

#### Маппинг

```typescript
{
  code: string → code: string
  title: string → title: string
  summary: string → summary: string
  cover_image: string → coverImage?: string
  content_html: string → contentHtml: string
  published_at: string → publishedAt?: string
  author: string → author?: string
}
```

#### Примеры запросов

```typescript
// Получить все статьи с сортировкой по дате публикации
await directusClient.request(
  readItems('articles', {
    filter: { status: { _eq: 'published' } },
    sort: ['-published_at', '-date_created'],
    limit: 10,
  })
)
```

---

### 6. party_events (Вечеринки)

**Коллекция в Directus:** `party_events`

#### Поля коллекции

| Поле Directus | Тип | Обязательное | Описание |
|---------------|-----|--------------|----------|
| `id` | integer | Да | Первичный ключ |
| `status` | string | Да | draft / published / archived |
| `code` | string | Да | Уникальный slug |
| `title` | string | Да | Название вечеринки |
| `summary` | string | Да | Описание |
| `cover_image` | file | Нет | Обложка |
| `starts_at` | timestamp | Да | Дата и время начала |
| `venue` | string | Нет | Место проведения |

#### Маппинг

```typescript
{
  code: string → code: string
  title: string → title: string
  summary: string → summary: string
  cover_image: string → coverImage?: string
  starts_at: string → startsAt: string
  venue: string → venue?: string
}
```

#### Примеры запросов

```typescript
// Получить предстоящие вечеринки
await directusClient.request(
  readItems('party_events', {
    filter: {
      status: { _eq: 'published' },
      starts_at: { _gte: '$NOW' },
    },
    sort: ['starts_at'],
  })
)
```

## Общие рекомендации

### 1. Фильтрация по статусу

Все коллекции должны иметь поле `status` со значениями:
- `draft` - черновик (не показывается на сайте)
- `published` - опубликовано (видно на сайте)
- `archived` - в архиве (не показывается)

**Всегда фильтруйте** по `status: 'published'` при получении данных для фронтенда.

### 2. Работа с изображениями

Изображения в Directus хранятся как ID файлов. Для получения URL используйте:

```typescript
import { DIRECTUS_URL } from '@/shared/api/client'

const imageUrl = `${DIRECTUS_URL}/assets/${imageId}`
```

Или используйте Directus Assets API с параметрами трансформации:

```typescript
const thumbnailUrl = `${DIRECTUS_URL}/assets/${imageId}?width=400&height=300&fit=cover`
```

### 3. Обязательные поля

Минимальный набор полей для всех сущностей типа "место":
- `code` - уникальный slug для URL
- `title` - название
- `summary` - краткое описание
- `status` - статус публикации

### 4. Slug (code) для URL

Поле `code` используется в динамических роутах Astro:
- `/clubs/[code].astro` → `/clubs/neon-arena`
- `/hotels/[code].astro` → `/hotels/grand-ibiza-palace`

**Требования к code:**
- Уникальность внутри коллекции
- Только латинские буквы, цифры и дефисы
- Lowercase
- Без пробелов

### 5. Сортировка

По умолчанию сортировка:
- **Места** (clubs, hotels, etc.): `-date_created` (новые первыми)
- **Статьи**: `-published_at, -date_created` (по дате публикации)
- **Вечеринки**: `starts_at` (по дате начала)

## Настройка коллекций в Directus

### Создание коллекции "clubs"

1. В Directus Admin перейдите в Settings → Data Model
2. Создайте новую коллекцию `clubs`
3. Добавьте поля согласно таблице выше
4. Настройте типы полей:
   - `code`: String, Required, Unique
   - `status`: Dropdown (draft, published, archived)
   - `price_level`: Dropdown (€, €€, €€€, €€€€)
   - `tags`: JSON
   - `gallery_images`: JSON

### Права доступа

Для публичного чтения данных:
1. Создайте роль `Public`
2. Настройте права на чтение для всех коллекций
3. Добавьте фильтр: `status = published`

## Миграция данных

При переносе данных из моков в Directus:

1. Экспортируйте моки в CSV
2. Импортируйте через Directus Import
3. Проверьте корректность маппинга полей
4. Установите `status = published` для всех записей
5. Проверьте работу сайта

## Troubleshooting

### Ошибка: "Collection not found"

- Проверьте название коллекции в Directus
- Убедитесь, что коллекция создана и содержит поля

### Ошибка: "Forbidden"

- Проверьте права доступа для роли Public
- Убедитесь, что токен (если используется) валиден

### Пустой результат

- Проверьте фильтр `status: 'published'`
- Убедитесь, что есть опубликованные записи
