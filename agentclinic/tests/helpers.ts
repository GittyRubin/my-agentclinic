import { createApp } from '../src/app'
import { openDb } from '../src/db'
import { seedIfEmpty } from '../src/db/seed'

/** A fixed "now" so tests do not depend on the real clock: 8 Nov 2026, 12:00 local time. */
export const NOW = new Date(2026, 10, 8, 12, 0)

export function testApp() {
  const db = openDb(':memory:')
  seedIfEmpty(db, NOW)
  return { app: createApp(db, { now: () => NOW }), db }
}

export function form(values: Record<string, string>) {
  return {
    method: 'POST',
    body: new URLSearchParams(values),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  }
}
