// src/data/navItems.ts
// Константы для навигации (аналогично v0-версии сайта).

export const navItems = [
  { href: '/hotels', label: 'Отели' },
  { href: '/beaches', label: 'Пляжи' },
  { href: '/restaurants', label: 'Рестораны' },
  { href: '/clubs', label: 'Клубы' },
  { href: '/articles', label: 'Статьи' },
  // Временно скрыт раздел «Вечеринки» (роут есть, но не показываем в меню)
  // { href: '/party-schedule', label: 'Вечеринки' },
] as const
