# Документация: Врезки и вставки в статьях

Эта документация описывает, как использовать стилизованные блоки в контенте статей при работе с Directus.

## Обзор

Для статей используется класс `.article-content`, который определяет стили для всех HTML-элементов внутри.

Актуальный формат контента:
- поле `articles.content` хранит **Markdown**
- фронтенд (Astro) рендерит markdown в HTML и применяет стили из `src/styles/global.css`

Поддерживаются:
- базовая типографика (h2/h3/p/ul/ol/blockquote/hr)
- фото-блоки (markdown-картинки автоматически превращаются в `<figure>` + `<figcaption>`)
- кастомные блоки через директивы `:::` (цитата, объект/место)

## Базовые элементы

### Заголовки

```html
<h2>Основной заголовок раздела</h2>
<h3>Подзаголовок</h3>
```

### Параграфы и текст

```html
<p>Обычный текст параграфа.</p>
<a href="/путь">Ссылка в тексте</a>
```

### Списки

```html
<!-- Маркированный список -->
<ul>
  <li>Пункт 1</li>
  <li>Пункт 2</li>
  <li>Пункт 3</li>
</ul>

<!-- Нумерованный список -->
<ol>
  <li>Шаг 1</li>
  <li>Шаг 2</li>
  <li>Шаг 3</li>
</ol>
```

### Изображения

```html
<figure>
  <img src="/images/photo.jpg" alt="Описание фото" />
  <figcaption>Подпись к фото: описание, дата, локация.</figcaption>
</figure>
```

### Цитаты

```html
<blockquote>
  «Текст цитаты или важной мысли.»
</blockquote>
```

### Разделитель

```html
<hr />
```

## Специальные блоки

### 0. Кастомные блоки (Markdown директивы)

#### 0.1 Блок цитаты (quote)

Синтаксис:

```md
:::quote[Светлана Степанковская](Актриса и певица)
Ибица — это одно из моих любимейших мест отдыха уже 8 лет!
:::
```

Результат: рендерится как `<figure>` с `<blockquote>` и подписью (author/role).

#### 0.2 Блок фото (image)

Синтаксис:

```md
![Фото предоставлено пресс-службой Светланы Степанковской](https://example.com/photo.jpg)
```

Результат: `<figure><img/><figcaption>...</figcaption></figure>`.

#### 0.3 Блок объекта (entity)

Синтаксис:

```md
:::entity[club](amnesia-ibiza){Amnesia Ibiza}
Культовый клуб Ибицы с богатой историей, расположенный на полпути между Ибица-Тауном и Сан-Антонио
:::
```

Поведение:
- подгружается объект по `type` + `code`
- карточка автоматически показывает фото (cover) и ссылку на объект в соответствующем разделе
- текст внутри блока используется как описание (приоритетно), если он указан

Поддерживаемые `type`:
- `club`
- `restaurant`
- `hotel`
- `beach`

---

## HTML-блоки (legacy)

Ниже примеры HTML, которые использовались в прототипе.
Если в будущем потребуется поддержка HTML-режима в редакторе — эти блоки можно использовать как основу.

### 1. Врезка / Callout

Используется для важной информации, примечаний, советов.

```html
<div class="article-callout">
  <div class="article-callout__title">Заголовок врезки</div>
  <p class="m-0">
    Текст врезки. Здесь можно разместить важную информацию, подсказки,
    примечания или любой другой дополнительный контент.
  </p>
</div>
```

**Пример использования:**

```html
<div class="article-callout">
  <div class="article-callout__title">Как читать эту подборку</div>
  <p class="m-0">
    Это демонстрационный текст для прототипа. Здесь важно увидеть типографику, сетку и то,
    как будут выглядеть «встроенные блоки» заведений прямо по ходу статьи.
  </p>
</div>
```

### 2. Раскрывающийся блок (FAQ)

Для контента, который можно скрыть/показать.

```html
<details class="article-callout">
  <summary class="article-callout__title">Вопрос или заголовок</summary>
  <p class="m-0">
    Ответ или дополнительная информация, которая скрыта по умолчанию.
  </p>
</details>
```

### 3. Встроенный блок заведения (Ресторан/Клуб/Отель/Пляж)

Используется для вставки карточки заведения прямо в текст статьи.

#### Структура блока

```html
<div class="article-place card bg-base-100 border border-base-200 overflow-hidden">
  <!-- Изображение -->
  <div class="w-full aspect-[16/9] overflow-hidden bg-base-200/30">
    <img src="/путь-к-фото.jpg" alt="Название заведения" class="h-full w-full object-cover" />
  </div>
  
  <!-- Контент -->
  <div class="card-body">
    <div class="flex items-start justify-between gap-3">
      <div>
        <div class="text-xs text-base-content/60">Тип заведения</div>
        <h3 class="card-title m-0">Название заведения</h3>
        <p class="mt-1 text-base-content/70">
          Краткое описание заведения.
        </p>
      </div>
      <!-- Уровень цен -->
      <div class="badge badge-outline badge-lg shrink-0 whitespace-nowrap">€€€</div>
    </div>

    <!-- Теги/бейджи -->
    <div class="flex flex-wrap gap-2 mt-2">
      <span class="badge badge-outline">Локация</span>
      <span class="badge badge-outline">Рейтинг 4.6</span>
      <span class="badge badge-outline">Особенность</span>
    </div>

    <!-- Действия -->
    <div class="card-actions mt-3">
      <a class="btn btn-sm btn-ghost" href="/путь-к-странице">Открыть страницу</a>
    </div>
  </div>
</div>
```

#### Примеры для разных типов заведений

##### Ресторан

```html
<div class="article-place card bg-base-100 border border-base-200 overflow-hidden">
  <div class="w-full aspect-[16/9] overflow-hidden bg-base-200/30">
    <img src="/placeholder.jpg" alt="Seafood Terrace" class="h-full w-full object-cover" />
  </div>
  <div class="card-body">
    <div class="flex items-start justify-between gap-3">
      <div>
        <div class="text-xs text-base-content/60">Ресторан</div>
        <h3 class="card-title m-0">Seafood Terrace</h3>
        <p class="mt-1 text-base-content/70">
          Свежие морепродукты и панорамный вид на море.
        </p>
      </div>
      <div class="badge badge-outline badge-lg shrink-0 whitespace-nowrap">€€€</div>
    </div>

    <div class="flex flex-wrap gap-2 mt-2">
      <span class="badge badge-outline">Ibiza Town</span>
      <span class="badge badge-outline">Рейтинг 4.6</span>
      <span class="badge badge-outline">Вид на море</span>
    </div>

    <div class="card-actions mt-3">
      <a class="btn btn-sm btn-ghost" href="/restaurants/seafood-terrace">Открыть страницу</a>
    </div>
  </div>
</div>
```

##### Клуб

```html
<div class="article-place card bg-base-100 border border-base-200 overflow-hidden">
  <div class="w-full aspect-[16/9] overflow-hidden bg-base-200/30">
    <img src="/placeholder.jpg" alt="Neon Arena" class="h-full w-full object-cover" />
  </div>
  <div class="card-body">
    <div class="flex items-start justify-between gap-3">
      <div>
        <div class="text-xs text-base-content/60">Клуб</div>
        <h3 class="card-title m-0">Neon Arena</h3>
        <p class="mt-1 text-base-content/70">
          Большая площадка, лайнап топ‑диджеев и мощный звук.
        </p>
      </div>
      <div class="badge badge-outline badge-lg shrink-0 whitespace-nowrap">€€€€</div>
    </div>

    <div class="flex flex-wrap gap-2 mt-2">
      <span class="badge badge-outline">Ibiza Town</span>
      <span class="badge badge-outline">Рейтинг 4.7</span>
      <span class="badge badge-outline">Main stage</span>
    </div>

    <div class="card-actions mt-3">
      <a class="btn btn-sm btn-ghost" href="/clubs/neon-arena">Открыть страницу</a>
    </div>
  </div>
</div>
```

## Работа в Directus

### Rich Text редактор

В Directus для поля `content_html` используется Rich Text редактор. Вы можете:

1. **Использовать визуальный редактор** для базовых элементов (заголовки, списки, цитаты)
2. **Переключиться в HTML режим** для вставки специальных блоков (врезки, карточки заведений)

### Рекомендуемый workflow

1. Написать основной текст в визуальном редакторе
2. Переключиться в HTML режим
3. Вставить HTML-код врезки или карточки заведения в нужное место
4. Заменить плейсхолдеры (названия, описания, ссылки) на реальные данные
5. Сохранить и проверить результат

### Советы по работе

- **Всегда проверяйте** корректность HTML перед сохранением
- **Используйте актуальные ссылки** на страницы заведений (например, `/restaurants/seafood-terrace`)
- **Заполняйте alt атрибуты** у изображений для доступности
- **Не забывайте** про обязательный класс `article-place` для карточек заведений
- **Уровень цен** должен быть в формате: €, €€, €€€ или €€€€

## Структура контента статьи

Рекомендуемая структура полноценной статьи:

```html
<p>Вступительный параграф с кратким описанием темы статьи.</p>

<div class="article-callout">
  <div class="article-callout__title">О чем эта статья</div>
  <p class="m-0">Краткое резюме содержания.</p>
</div>

<h2>Первый раздел</h2>
<p>Текст первого раздела...</p>

<figure>
  <img src="/images/photo1.jpg" alt="Описание" />
  <figcaption>Подпись к фото</figcaption>
</figure>

<h3>Подраздел</h3>
<ul>
  <li>Пункт 1</li>
  <li>Пункт 2</li>
</ul>

<blockquote>
  «Цитата или важная мысль»
</blockquote>

<p>Текст перед вставкой заведения...</p>

<!-- Карточка заведения -->
<div class="article-place card bg-base-100 border border-base-200 overflow-hidden">
  <!-- ... полная структура блока ... -->
</div>

<hr />

<h2>Второй раздел</h2>
<p>Продолжение статьи...</p>
```

## Примечания

- Все стили уже определены в глобальных CSS (`src/styles/global.css`)
- Класс `.article-content` автоматически применяется к контенту статьи
- Не нужно добавлять дополнительные классы для базовых элементов (h2, p, ul и т.д.)
- Для карточек заведений обязательно используйте класс `article-place`
