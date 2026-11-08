import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import type { Db } from './db'
import { getAgent, listAgents, listAilments, listAilmentsForAgent } from './db/queries'
import { Home } from './pages/Home'
import { Layout } from './components/Layout'
import { AgentsList } from './components/AgentsList'
import { AgentDetail } from './components/AgentDetail'
import { AilmentsList } from './components/AilmentsList'

export function createApp(db: Db) {
  const app = new Hono()

  app.use('/static/*', serveStatic({ root: './' }))

  app.get('/', (c) => c.html(<Home />))

  app.get('/agents', (c) =>
    c.html(
      <Layout title="Agents">
        <h1>Agents</h1>
        <AgentsList agents={listAgents(db)} />
      </Layout>,
    ),
  )

  app.get('/agents/:id', (c) => {
    const id = Number(c.req.param('id'))
    const agent = Number.isInteger(id) ? getAgent(db, id) : undefined
    if (!agent) {
      return c.html(
        <Layout title="Agent not found">
          <h1>Agent not found</h1>
          <p>
            <a href="/agents">Back to all agents</a>
          </p>
        </Layout>,
        404,
      )
    }
    return c.html(
      <Layout title={agent.name}>
        <AgentDetail agent={agent} ailments={listAilmentsForAgent(db, agent.id)} />
      </Layout>,
    )
  })

  app.get('/ailments', (c) =>
    c.html(
      <Layout title="Ailments">
        <h1>Ailments</h1>
        <AilmentsList ailments={listAilments(db)} />
      </Layout>,
    ),
  )

  return app
}
