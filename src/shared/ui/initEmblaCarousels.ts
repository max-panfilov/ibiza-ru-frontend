// src/shared/ui/initEmblaCarousels.ts
// Инициализация всех Embla-каруселей на странице.
// Вызывается из ImageCarousel.astro на клиенте.

import EmblaCarousel, { type EmblaCarouselType } from 'embla-carousel'

/**
 * Инициализировать все карусели, помеченные data-embla.
 * Повторный вызов безопасен: есть защита через data-embla-init.
 */
export function initEmblaCarousels(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  const roots = Array.from(document.querySelectorAll<HTMLElement>('[data-embla]'))

  roots.forEach((rootNode) => {
    if (!(rootNode instanceof HTMLElement)) return

    // Защита от двойной инициализации
    if (rootNode.dataset.emblaInit === '1') {
      return
    }
    rootNode.dataset.emblaInit = '1'

    const viewportNode = rootNode.querySelector<HTMLElement>('.embla__viewport')
    const prevBtn = rootNode.querySelector<HTMLElement>('.embla__prev')
    const nextBtn = rootNode.querySelector<HTMLElement>('.embla__next')
    const dotsNode = rootNode.querySelector<HTMLElement>('.embla__dots')
    const counterNode = rootNode.querySelector<HTMLElement>('.embla__counter')

    const thumbsViewportNode = rootNode.querySelector<HTMLElement>('.embla-thumbs__viewport')
    const thumbButtons = Array.from(rootNode.querySelectorAll<HTMLButtonElement>('.embla__thumb'))

    if (!viewportNode) return

    const slides = rootNode.querySelectorAll('.embla__slide')
    const slidesCount = slides.length

    const embla: EmblaCarouselType = EmblaCarousel(viewportNode, { loop: slidesCount > 1 })
    const emblaThumbs = thumbsViewportNode
      ? EmblaCarousel(thumbsViewportNode, { dragFree: true, containScroll: 'keepSnaps' })
      : null

    const updateButtons = () => {
      if (prevBtn instanceof HTMLButtonElement) prevBtn.disabled = !embla.canScrollPrev()
      if (nextBtn instanceof HTMLButtonElement) nextBtn.disabled = !embla.canScrollNext()
    }

    const renderDots = () => {
      if (!dotsNode) return
      dotsNode.innerHTML = ''

      for (let index = 0; index < slidesCount; index++) {
        const dot = document.createElement('button')
        dot.type = 'button'
        dot.className = 'embla__dot h-2 w-2 rounded-full bg-white/40 hover:bg-white/70 transition'
        dot.setAttribute('aria-label', `Перейти к фото ${index + 1}`)
        dot.addEventListener('click', () => embla.scrollTo(index))
        dotsNode.appendChild(dot)
      }
    }

    const updateDots = () => {
      if (!dotsNode) return
      const selected = embla.selectedScrollSnap()
      const dots = dotsNode.querySelectorAll('.embla__dot')
      dots.forEach((dot, idx) => {
        dot.classList.toggle('bg-white', idx === selected)
        dot.classList.toggle('bg-white/40', idx !== selected)
        dot.classList.toggle('scale-110', idx === selected)
      })
    }

    const updateCounter = () => {
      if (!counterNode) return
      const selected = embla.selectedScrollSnap()
      counterNode.textContent = `${selected + 1} / ${slidesCount}`
    }

    const updateThumbs = () => {
      if (thumbButtons.length === 0) return
      const selected = embla.selectedScrollSnap()

      thumbButtons.forEach((btn, idx) => {
        btn.classList.toggle('ring-primary', idx === selected)
        btn.classList.toggle('opacity-100', idx === selected)
        btn.classList.toggle('opacity-70', idx !== selected)
        btn.setAttribute('aria-current', idx === selected ? 'true' : 'false')
      })

      emblaThumbs?.scrollTo(selected)
    }

    if (prevBtn instanceof HTMLButtonElement) prevBtn.addEventListener('click', () => embla.scrollPrev())
    if (nextBtn instanceof HTMLButtonElement) nextBtn.addEventListener('click', () => embla.scrollNext())

    thumbButtons.forEach((btn, idx) => {
      if (!(btn instanceof HTMLButtonElement)) return
      btn.addEventListener('click', () => embla.scrollTo(idx))
    })

    const syncUi = () => {
      updateButtons()
      updateDots()
      updateCounter()
      updateThumbs()
    }

    embla.on('select', () => {
      syncUi()
    })

    renderDots()
    syncUi()
  })
}
