import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Home } from './pages/Home'

const app = new Hono()

app.use('/static/*', serveStatic({ root: './' }))

app.get('/', (c) => c.html(<Home />))

const port = 3000

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`AgentClinic is running on http://localhost:${info.port}`)
})
