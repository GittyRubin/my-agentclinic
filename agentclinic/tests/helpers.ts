import { createApp } from '../src/app'
import { openDb } from '../src/db'
import { seedIfEmpty } from '../src/db/seed'

export function testApp() {
  const db = openDb(':memory:')
  seedIfEmpty(db)
  return { app: createApp(db), db }
}
