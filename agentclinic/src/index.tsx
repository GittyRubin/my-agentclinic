import { fileURLToPath } from 'node:url'
import { serve } from '@hono/node-server'
import { createApp } from './app'
import { openDb } from './db'
import { seedIfEmpty } from './db/seed'

// Static files and the database live in the project root, so run from there
// no matter which directory the server was started from.
process.chdir(fileURLToPath(new URL('..', import.meta.url)))

const db = openDb(process.env.AGENTCLINIC_DB ?? 'agentclinic.db')
seedIfEmpty(db)

const app = createApp(db)
const port = 3000

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`AgentClinic is running on http://localhost:${info.port}`)
})
