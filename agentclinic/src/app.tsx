import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import type { Db } from './db'
import type { AppointmentInput } from './db/types'
import {
  createAppointment,
  getAgent,
  getDashboardStats,
  listAgents,
  listAgentsInTreatment,
  listAilments,
  listAilmentsForAgent,
  listTherapies,
  listUpcomingAppointments,
  listUpcomingAppointmentsForAgent,
} from './db/queries'
import { toLocalDateTime } from './db/time'
import { validateAppointment } from './appointments'
import { Home } from './pages/Home'
import { Dashboard } from './pages/Dashboard'
import { Layout } from './components/Layout'
import { AgentsList } from './components/AgentsList'
import { AgentDetail } from './components/AgentDetail'
import { AilmentsList } from './components/AilmentsList'
import { TherapiesList } from './components/TherapiesList'
import { AppointmentsList } from './components/AppointmentsList'
import { AppointmentForm } from './components/AppointmentForm'

export type AppOptions = {
  /** Current time; injectable so tests are deterministic. */
  now?: () => Date
}

const EMPTY_INPUT: AppointmentInput = { agent_id: '', therapy_id: '', starts_at: '', notes: '' }

export function createApp(db: Db, { now = () => new Date() }: AppOptions = {}) {
  const app = new Hono()
  const nowLocal = () => toLocalDateTime(now())

  app.use('/static/*', serveStatic({ root: './' }))

  app.get('/', (c) => c.html(<Home />))

  app.get('/dashboard', (c) =>
    c.html(
      <Dashboard
        stats={getDashboardStats(db, nowLocal())}
        inTreatment={listAgentsInTreatment(db)}
        nextAppointments={listUpcomingAppointments(db, nowLocal(), 5)}
      />,
    ),
  )

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
        <AgentDetail
          agent={agent}
          ailments={listAilmentsForAgent(db, agent.id)}
          appointments={listUpcomingAppointmentsForAgent(db, agent.id, nowLocal())}
        />
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

  app.get('/therapies', (c) =>
    c.html(
      <Layout title="Therapies">
        <h1>Therapies</h1>
        <TherapiesList therapies={listTherapies(db)} />
      </Layout>,
    ),
  )

  const appointmentsPage = (values: AppointmentInput, errors: string[]) => (
    <Layout title="Appointments">
      <h1>Appointments</h1>
      <div class="split">
        <section>
          <h2>Upcoming</h2>
          <AppointmentsList appointments={listUpcomingAppointments(db, nowLocal())} />
        </section>
        <AppointmentForm
          agents={listAgents(db)}
          therapies={listTherapies(db)}
          values={values}
          errors={errors}
          minStartsAt={nowLocal()}
        />
      </div>
    </Layout>
  )

  app.get('/appointments', (c) => {
    const agentId = c.req.query('agent_id') ?? ''
    return c.html(appointmentsPage({ ...EMPTY_INPUT, agent_id: agentId }, []))
  })

  app.post('/appointments', async (c) => {
    const body = await c.req.parseBody()
    const field = (name: keyof AppointmentInput) => (typeof body[name] === 'string' ? (body[name] as string) : '')
    const input: AppointmentInput = {
      agent_id: field('agent_id'),
      therapy_id: field('therapy_id'),
      starts_at: field('starts_at'),
      notes: field('notes'),
    }

    const result = validateAppointment(db, input, now())
    if (!result.ok) {
      return c.html(appointmentsPage(input, result.errors), 400)
    }
    createAppointment(db, result.appointment)
    return c.redirect('/appointments', 303)
  })

  return app
}
