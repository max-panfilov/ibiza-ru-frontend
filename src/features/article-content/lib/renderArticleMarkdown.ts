// src/features/article-content/lib/renderArticleMarkdown.ts
// Рендерит markdown из поля articles.content в HTML.
//
// Зачем отдельный модуль:
// - изолируем парсинг markdown и кастомные врезки (Clean Architecture + FSD)
// - страницы/виджеты получают уже готовый HTML, не зная про детали синтаксиса

import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkDirective from 'remark-directive'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { visit } from 'unist-util-visit'
import { toString as mdastToString } from 'mdast-util-to-string'

export interface ArticleTocItem {
  id: string
  title: string
}

export interface RenderedArticleContent {
  html: string
  toc: ArticleTocItem[]
}

import { clubRepository } from '@/entities/club/api/clubRepository'
import { restaurantRepository } from '@/entities/restaurant/api/restaurantRepository'
import { hotelRepository } from '@/entities/hotel/api/hotelRepository'
import { beachRepository } from '@/entities/beach/api/beachRepository'

type SupportedEntityType = 'club' | 'restaurant' | 'hotel' | 'beach'

function slugifyForAnchor(input: string): string {
  const raw = (input || '').trim().toLowerCase()
  if (raw.length === 0) return ''

  // Разрешаем Unicode-буквы/цифры, пробелы и дефисы.
  // Это даёт «человеческие» якоря и для русских заголовков.
  // Пример: "Где жить" -> "где-жить".
  try {
    return raw
      .replace(/[^\p{L}\p{N}\s-]+/gu, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  } catch {
    // Fallback для сред без Unicode property escapes.
    return raw
      .replace(/[^a-z0-9\s-]+/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
}

interface ResolvedEntityForEmbed {
  type: SupportedEntityType
  typeLabelRu: string
  href: string
  title: string
  description?: string
  coverImageUrl?: string
  priceRange?: string
}

// Минимальный HTML-эскейп, чтобы не сломать атрибуты/текст в наших вставках.
function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

// Приводим пользовательский синтаксис к формату, который умеет парсить remark-directive.
//
// Было (как хочет редактор):
// :::quote[Автор](Должность)
// Текст
// :::
//
// Станет:
// :::quote{author="..." role="..."}
// ...
// :::
//
// И для entity:
// :::entity[club](amnesia-ibiza){Amnesia Ibiza}
// ...
// :::
//
// Станет:
// :::entity{type="club" code="amnesia-ibiza" title="Amnesia Ibiza"}
function preprocessCustomDirectives(markdown: string): string {
  return markdown
    .split('\n')
    .map((line) => {
      const trimmed = line.trim()

      // quote
      // :::quote[Author](Role)
      const quoteMatch = trimmed.match(/^:::\s*quote\[(.+?)\]\((.+?)\)\s*$/)
      if (quoteMatch) {
        const author = escapeHtml(quoteMatch[1])
        const role = escapeHtml(quoteMatch[2])
        return `:::quote{author="${author}" role="${role}"}`
      }

      // entity
      // :::entity[club](code){Title}
      const entityMatch = trimmed.match(/^:::\s*entity\[(.+?)\]\((.+?)\)\{(.+?)\}\s*$/)
      if (entityMatch) {
        const type = escapeHtml(entityMatch[1])
        const code = escapeHtml(entityMatch[2])
        const title = escapeHtml(entityMatch[3])
        return `:::entity{type="${type}" code="${code}" title="${title}"}`
      }

      return line
    })
    .join('\n')
}

function buildEntityCard(
  entity: ResolvedEntityForEmbed,
  descriptionFromBlock?: string,
  options?: { side?: 'left' | 'right' }
) {
  // Описание берём приоритетно из текста блока (редактор может дать более контекстное описание),
  // иначе — из description сущности.
  const description = (descriptionFromBlock?.trim() || entity.description || '').trim()

  const imgSrc = entity.coverImageUrl || '/placeholder.jpg'
  const imgAlt = entity.title

  const isRight = options?.side === 'right'

  // Важно: внутри .article-content есть типографические правила для h3/p/a/img,
  // поэтому в embed мы избегаем <h3>/<p>, чтобы не наследовать большие отступы и размеры.
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className: [
        'article-place',
        'article-entity-embed',
        'flex',
        'flex-col',
        'sm:flex-row',
        ...(isRight ? ['sm:flex-row-reverse'] : []),
        'bg-base-100',
        'border',
        'border-base-200',
        'rounded-2xl',
        'overflow-hidden',
      ],
    },
    children: [
      // Медиа-колонка (крупнее, но всё ещё компактная)
      {
        type: 'element',
        tagName: 'a',
        properties: {
          href: entity.href,
          // Картинка заметная, но не «карточка на весь экран»
          className: ['block', 'shrink-0', 'w-full', 'sm:w-44', 'md:w-52'],
        },
        children: [
          {
            type: 'element',
            tagName: 'div',
            properties: {
              // Чуть «пейзажнее» на мобилке и компактнее по высоте
              className: ['w-full', 'aspect-[16/9]', 'sm:aspect-[4/3]', 'bg-base-200/30'],
            },
            children: [
              {
                type: 'element',
                tagName: 'img',
                properties: {
                  src: imgSrc,
                  alt: imgAlt,
                  loading: 'lazy',
                  className: ['h-full', 'w-full', 'object-cover'],
                },
                children: [],
              },
            ],
          },
        ],
      },

      // Контент-колонка
      {
        type: 'element',
        tagName: 'div',
        properties: { className: ['flex-1', 'p-4'] },
        children: [
          {
            type: 'element',
            tagName: 'div',
            properties: { className: ['flex', 'items-start', 'justify-between', 'gap-3'] },
            children: [
              {
                type: 'element',
                tagName: 'div',
                properties: {},
                children: [
                  {
                    type: 'element',
                    tagName: 'div',
                    properties: { className: ['text-xs', 'text-base-content/60'] },
                    children: [{ type: 'text', value: entity.typeLabelRu }],
                  },
                  {
                    // Заголовок (div вместо h3, чтобы не сработали .article-content h3 стили)
                    type: 'element',
                    tagName: 'div',
                    properties: { className: ['mt-0.5', 'text-lg', 'font-semibold', 'leading-snug'] },
                    children: [
                      {
                        type: 'element',
                        tagName: 'a',
                        properties: {
                          href: entity.href,
                          // важно: переопределяем глобальный стиль .article-content a
                          className: ['!no-underline', 'hover:!underline', '!text-base-content'],
                        },
                        children: [{ type: 'text', value: entity.title }],
                      },
                    ],
                  },
                ],
              },
              ...(entity.priceRange
                ? [
                    {
                      type: 'element',
                      tagName: 'div',
                      properties: {
                        className: [
                          'badge',
                          'badge-outline',
                          'badge-sm',
                          'shrink-0',
                          'whitespace-nowrap',
                        ],
                      },
                      children: [{ type: 'text', value: entity.priceRange }],
                    },
                  ]
                : []),
            ],
          },
          ...(description
            ? [
                {
                  // div вместо p, чтобы не сработали .article-content p отступы
                  type: 'element',
                  tagName: 'div',
                  properties: { className: ['mt-2', 'text-sm', 'leading-6', 'text-base-content/70'] },
                  children: [{ type: 'text', value: description }],
                },
              ]
            : []),
        ],
      },
    ],
  }
}

function buildQuoteFigure(params: { text: string; author?: string; role?: string }) {
  const quoteText = params.text.trim()
  const author = (params.author || '').trim()
  const role = (params.role || '').trim()

  return {
    type: 'element',
    tagName: 'figure',
    properties: { className: ['article-quote'] },
    children: [
      {
        type: 'element',
        tagName: 'blockquote',
        properties: {},
        children: [{ type: 'text', value: quoteText }],
      },
      ...(author || role
        ? [
            {
              type: 'element',
              tagName: 'figcaption',
              properties: {},
              children: [
                ...(author
                  ? [
                      {
                        type: 'element',
                        tagName: 'div',
                        properties: { className: ['font-semibold'] },
                        children: [{ type: 'text', value: author }],
                      },
                    ]
                  : []),
                ...(role
                  ? [
                      {
                        type: 'element',
                        tagName: 'div',
                        properties: { className: ['text-sm', 'text-base-content/60'] },
                        children: [{ type: 'text', value: role }],
                      },
                    ]
                  : []),
              ],
            },
          ]
        : []),
    ],
  }
}

function isSupportedEntityType(value: string): value is SupportedEntityType {
  return value === 'club' || value === 'restaurant' || value === 'hotel' || value === 'beach'
}

async function resolveEntityForEmbed(
  type: string,
  code: string
): Promise<ResolvedEntityForEmbed | null> {
  // Важно: здесь мы явно ограничиваем поддерживаемые типы, чтобы избежать «магии»
  // и случайных запросов к несуществующим коллекциям.
  if (!isSupportedEntityType(type)) return null

  if (type === 'club') {
    const club = await clubRepository.getByCode(code)
    return {
      type,
      typeLabelRu: 'Клуб',
      href: `/clubs/${club.code}`,
      title: club.title,
      description: club.description,
      coverImageUrl: club.coverImage?.url,
      priceRange: club.priceRange,
    }
  }

  if (type === 'restaurant') {
    const restaurant = await restaurantRepository.getByCode(code)
    return {
      type,
      typeLabelRu: 'Ресторан',
      href: `/restaurants/${restaurant.code}`,
      title: restaurant.title,
      description: restaurant.description,
      coverImageUrl: restaurant.coverImage?.url,
      priceRange: restaurant.priceRange,
    }
  }

  if (type === 'hotel') {
    const hotel = await hotelRepository.getByCode(code)
    return {
      type,
      typeLabelRu: 'Отель',
      href: `/hotels/${hotel.code}`,
      title: hotel.title,
      description: hotel.description,
      coverImageUrl: hotel.coverImage?.url,
      priceRange: hotel.priceRange,
    }
  }

  // beach
  const beach = await beachRepository.getByCode(code)
  return {
    type,
    typeLabelRu: 'Пляж',
    href: `/beaches/${beach.code}`,
    title: beach.title,
    description: beach.description,
    coverImageUrl: beach.coverImage?.url,
  }
}

// Remark-плагин: собираем содержание по заголовкам H2 и проставляем якоря.
function remarkArticleTocAndAnchors(params: {
  toc: ArticleTocItem[]
  slugger: Map<string, number>
}) {
  return (tree: any) => {
    visit(tree, 'heading', (node: any) => {
      if (!node || node.depth !== 2) return

      const title = mdastToString(node).trim()
      if (!title) return

      const base = slugifyForAnchor(title) || 'section'
      const prev = params.slugger.get(base) ?? 0
      const next = prev + 1
      params.slugger.set(base, next)

      const id = next === 1 ? base : `${base}-${next}`

      // Проставляем id на будущий <h2>
      node.data = node.data || {}
      node.data.hProperties = {
        ...(node.data.hProperties || {}),
        id,
      }

      params.toc.push({ id, title })
    })
  }
}

// Remark-плагин, который превращает container directives (quote/entity) в конкретные HAST-структуры.
function remarkArticleCustomBlocks() {
  return async (tree: any) => {
    // Простенький кэш внутри одного рендера, чтобы одинаковые сущности не грузить несколько раз.
    const entityCache = new Map<string, ResolvedEntityForEmbed | null>()

    const tasks: Promise<void>[] = []

    visit(tree, (node: any) => {
      if (node?.type !== 'containerDirective') return

      // quote
      if (node.name === 'quote') {
        const text = mdastToString(node)
        const author = String(node.attributes?.author ?? '')
        const role = String(node.attributes?.role ?? '')

        // Подменяем директиву на figure+blockquote+figcaption.
        node.data = node.data || {}
        node.data.hName = 'figure'
        const figure = buildQuoteFigure({ text, author, role })
        node.data.hProperties = figure.properties
        node.data.hChildren = figure.children
        return
      }

      // entity
      if (node.name === 'entity') {
        tasks.push(
          (async () => {
            const type = String(node.attributes?.type ?? '')
            const code = String(node.attributes?.code ?? '')
            const fallbackTitle = String(node.attributes?.title ?? '')

            const descriptionFromBlock = mdastToString(node)

            const cacheKey = `${type}:${code}`
            let resolved = entityCache.get(cacheKey)
            if (resolved === undefined) {
              resolved = await resolveEntityForEmbed(type, code).catch(() => null)
              entityCache.set(cacheKey, resolved)
            }

            // Если не смогли загрузить объект — всё равно показываем кликабельную карточку с плейсхолдерами.
            const safeType = isSupportedEntityType(type) ? type : 'club'
            const hrefBase =
              safeType === 'club'
                ? '/clubs'
                : safeType === 'restaurant'
                  ? '/restaurants'
                  : safeType === 'hotel'
                    ? '/hotels'
                    : '/beaches'

            const fallback: ResolvedEntityForEmbed = {
              type: safeType,
              typeLabelRu:
                safeType === 'club'
                  ? 'Клуб'
                  : safeType === 'restaurant'
                    ? 'Ресторан'
                    : safeType === 'hotel'
                      ? 'Отель'
                      : 'Пляж',
              href: `${hrefBase}/${code}`,
              title: fallbackTitle || code,
            }

            const sideRaw = String(node.attributes?.side ?? '')
            const side = sideRaw === 'right' ? 'right' : sideRaw === 'left' ? 'left' : undefined

            const card = buildEntityCard(resolved ?? fallback, descriptionFromBlock, { side })
            node.data = node.data || {}
            node.data.hName = card.tagName
            node.data.hProperties = card.properties
            node.data.hChildren = card.children
          })()
        )
      }
    })

    await Promise.all(tasks)
  }
}

// Rehype-плагин: превращаем "картинку одиночным параграфом" в <figure><img/><figcaption/></figure>
// Это нужно, чтобы подпись к фото (alt) отображалась как caption и подхватывала стили .article-content figure/figcaption.
function rehypeFigureImages() {
  return (tree: any) => {
    visit(tree, 'element', (node: any, index: number | undefined, parent: any) => {
      if (!parent || typeof index !== 'number') return

      // Ищем <p><img .../></p>
      if (node.tagName !== 'p') return
      if (!Array.isArray(node.children) || node.children.length !== 1) return

      const child = node.children[0]
      if (!child || child.type !== 'element' || child.tagName !== 'img') return

      const altRaw = String(child.properties?.alt ?? '')
      const alt = altRaw.trim()

      const figureChildren: any[] = [child]
      if (alt.length > 0) {
        figureChildren.push({
          type: 'element',
          tagName: 'figcaption',
          properties: {},
          children: [{ type: 'text', value: alt }],
        })
      }

      parent.children[index] = {
        type: 'element',
        tagName: 'figure',
        properties: {},
        children: figureChildren,
      }
    })
  }
}

export async function renderArticleMarkdown(markdown: string): Promise<RenderedArticleContent> {
  const toc: ArticleTocItem[] = []
  const slugger = new Map<string, number>()

  // 1) Приводим кастомный синтаксис к директивам, понятным remark-directive.
  const normalized = preprocessCustomDirectives(markdown || '')

  // 2) Парсим markdown → AST → HTML.
  // Важно: мы НЕ включаем обработку «сырого HTML» из markdown (без rehype-raw), чтобы не тащить XSS.
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkDirective)
    .use(remarkArticleTocAndAnchors, { toc, slugger })
    .use(remarkArticleCustomBlocks)
    .use(remarkRehype)
    .use(rehypeFigureImages)
    .use(rehypeStringify)
    .process(normalized)

  return { html: String(file), toc }
}

export async function renderArticleMarkdownToHtml(markdown: string): Promise<string> {
  const rendered = await renderArticleMarkdown(markdown)
  return rendered.html
}
