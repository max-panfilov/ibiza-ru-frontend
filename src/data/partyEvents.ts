// src/data/partyEvents.ts

import type { PartyEvent } from '../types'

export const partyEvents: PartyEvent[] = [
  {
    kind: 'partyEvent',
    code: 'opening-night',
    title: 'Opening Night',
    summary: 'Открытие сезона: special guests и большой лайнап.',
    startsAt: '2026-06-01T22:00:00+02:00',
    venue: 'Ibiza Town',
  },
  {
    kind: 'partyEvent',
    code: 'sunset-session',
    title: 'Sunset Session',
    summary: 'Мягкий хаус на закате и коктейли.',
    startsAt: '2026-06-03T20:00:00+02:00',
    venue: 'San Antonio',
  },
]