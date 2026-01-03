// src/data/articles.ts

import type { Article } from '../types'

export const articles: Article[] = [
  {
    kind: 'article',
    code: '8-mest-na-ibice',
    title: '8 мест на Ибице от Светланы Степанковской',
    summary: 'Подборка любимых локаций — пляжи, рестораны и вечерние места.',
    coverImage: '/images/ibiza-hero.png',
    publishedAt: '2025-05-02',
    author: 'Редакция Ibiza.ru',

    // Пример расширенного контента статьи: картинки по тексту, списки, цитаты, врезки и «встроенные блоки» заведений.
    // Позже этот HTML заменим на рендер блоков из Directus (rich-text / structured blocks).
    contentHtml: `
      <p>
        Ибица — это не только клубы. Это остров с потрясающими бухтами, ресторанами на скалах,
        маленькими рынками и закатами, которые хочется пересматривать снова и снова.
      </p>

      <div class="article-callout">
        <div class="article-callout__title">Как читать эту подборку</div>
        <p class="m-0">
          Это демонстрационный текст для прототипа. Здесь важно увидеть типографику, сетку и то,
          как будут выглядеть «встроенные блоки» заведений прямо по ходу статьи.
        </p>
      </div>

      <h2>1) Пляжный день: вода, тень, лёгкий обед</h2>
      <p>
        Начни утро с пляжа, где можно спокойно поплавать и не торопиться.
        Дальше — короткий переезд и обед с видом на море.
      </p>

      <figure>
        <img src="/images/ibiza-hero.png" alt="Пляж Ибицы" />
        <figcaption>Подпись к фото: пример подписи, дата/локация (если нужно).</figcaption>
      </figure>

      <h3>Мини‑чеклист на пляж</h3>
      <ul>
        <li>Крем SPF 50 (даже в облачную погоду)</li>
        <li>Вода и лёгкий перекус</li>
        <li>Тень (панама/кепка)</li>
        <li>Тонкая рубашка на вечер</li>
      </ul>

      <blockquote>
        «Лучшее на Ибице — это не список мест. Это то, как ты чувствуешь себя между ними».
      </blockquote>

      <h2>2) Ресторан с видом: обед или ранний ужин</h2>
      <p>
        Ниже — пример «встроенного блока» заведения, который можно вставлять прямо по тексту.
        В будущем это будет отдельный блок/компонент из Directus.
      </p>

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
            <!-- На мобильных символ € может «вылезать» из badge: увеличиваем размер и запрещаем перенос/сжатие -->
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

      <h2>3) Вечер: клубная часть (если хочется)</h2>
      <p>
        Иногда лучше выбрать одну сильную точку на вечер, чем пытаться успеть всё.
        Ниже — ещё один встроенный блок, но уже для клуба.
      </p>

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

      <hr />

      <h2>Как можно структурировать статьи дальше</h2>
      <p>
        В будущем статьи будут состоять из блоков (например, «текст», «галерея», «цитата»,
        «врезка», «карта», «встроенный тизер объекта» и т.д.).
        Это позволит редактору собирать материал как конструктор.
      </p>

      <h3>Пример нумерованного списка (шаги)</h3>
      <ol>
        <li>Выбрать тему (пляжи / отели / ночная жизнь)</li>
        <li>Собрать 5–10 объектов и краткие факты</li>
        <li>Вставить тизеры объектов прямо по тексту</li>
        <li>Добавить фото, врезки и цитаты</li>
      </ol>

      <details class="article-callout">
        <summary class="article-callout__title">FAQ (пример раскрывающегося блока)</summary>
        <p class="m-0">
          Это демонстрация дополнительного элемента. Можно использовать для подсказок,
          важных нюансов или быстрых ответов.
        </p>
      </details>

      <p>
        Ссылка в тексте тоже должна выглядеть аккуратно — например: 
        <a href="/hotels/grand-ibiza-palace">пример ссылки на отель</a>.
      </p>
    `,
  },
  {
    kind: 'article',
    code: 'lyubimye-mesta-anatoliya',
    title: 'Любимые места на Ибице Анатолия Макарова',
    summary: 'Личный гид по атмосфере вечеринок и лучшим точкам острова.',
    coverImage: '/placeholder.jpg',
    publishedAt: '2025-04-22',
    author: 'Редакция Ibiza.ru',
    contentHtml: `
      <p>В этом шаблоне показаны заголовки, списки и изображения.</p>
      <p><img src="/placeholder.jpg" alt="placeholder" /></p>
      <p>Дальше будет полноценная статья.</p>
    `,
  },
  {
    kind: 'article',
    code: 'ibiza-glazami-mashi',
    title: 'Ибица глазами Маши Цигаль',
    summary: 'История знакомства с островом и личные рекомендации.',
    coverImage: '/placeholder.jpg',
    publishedAt: '2025-02-12',
    author: 'Редакция Ibiza.ru',
    contentHtml: `
      <p>Текст‑рыба для прототипа.</p>
      <blockquote>Небольшая цитата — проверяем стили.</blockquote>
      <p>Конец статьи.</p>
    `,
  },
]