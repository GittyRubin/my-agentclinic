import { describe, it, expect } from 'vitest'
import { testApp } from './helpers'
import { listAgents, listAilments, listAilmentsForAgent } from '../src/db/queries'
import { seedIfEmpty } from '../src/db/seed'

const { app, db } = testApp()

describe('Database', () => {
  it('seeds agents and ailments', () => {
    expect(listAgents(db).length).toBe(5)
    expect(listAilments(db).length).toBe(5)
  })

  it('does not seed twice', () => {
    seedIfEmpty(db)
    expect(listAgents(db).length).toBe(5)
  })

  it('counts agents per ailment', () => {
    const revision = listAilments(db).find((a) => a.name === 'Infinite Revision Syndrome')
    expect(revision?.agent_count).toBe(3)
  })
})

describe('GET /agents', () => {
  it('lists every agent with a link to its page', async () => {
    const res = await app.request('/agents')
    expect(res.status).toBe(200)
    const html = await res.text()
    for (const agent of listAgents(db)) {
      expect(html).toContain(agent.name)
      expect(html).toContain(`href="/agents/${agent.id}"`)
    }
  })
})

describe('GET /agents/:id', () => {
  it('shows the agent and their ailments', async () => {
    const pixel = listAgents(db).find((a) => a.name === 'Pixel')!
    const res = await app.request(`/agents/${pixel.id}`)
    expect(res.status).toBe(200)
    const html = await res.text()
    expect(html).toContain('<h1>Pixel</h1>')
    for (const ailment of listAilmentsForAgent(db, pixel.id)) {
      expect(html).toContain(ailment.name)
    }
  })

  it('returns 404 for an unknown agent', async () => {
    const res = await app.request('/agents/9999')
    expect(res.status).toBe(404)
  })

  it('returns 404 for a non-numeric id', async () => {
    const res = await app.request('/agents/abc')
    expect(res.status).toBe(404)
  })
})

describe('GET /ailments', () => {
  it('lists every ailment with its agent count', async () => {
    const res = await app.request('/ailments')
    expect(res.status).toBe(200)
    const html = await res.text()
    expect(html).toContain('Context Window Fatigue')
    expect(html).toContain('3 agents affected')
    expect(html).toContain('1 agent affected')
  })
})
