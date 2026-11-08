import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import { Home } from './pages/Home'

export const app = new Hono()

app.use('/static/*', serveStatic({ root: './' }))

app.get('/', (c) => c.html(<Home />))
