import { describe, it, expect } from 'vitest'
import { DatabaseSync } from 'node:sqlite'
import { mkdtempSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { NOW, form, testApp } from './helpers'
import { openDb } from '../src/db'
import { seedIfEmpty } from '../src/db/seed'
import { validateAppointment } from '../src/appointments'
import {
  getDashboardStats,
  listAgents,
  listAilmentsForAgent,
  listTherapies,
  listUpcomingAppointments,
} from '../src/db/queries'

const agentId = (db: ReturnType<typeof testApp>['db'], name: string) =>
  String(listAgents(db).find((a) => a.name === name)!.id)

describe('Therapies', () => {
  it('seeds therapies and assigns one to every diagnosed ailment', () => {
    const { db } = testApp()
    expect(listTherapies(db).length).toBe(4)
    for (const agent of listAgents(db)) {
      for (const ailment of listAilmentsForAgent(db, agent.id)) {
        expect(ailment.therapy_name).not.toBeNull()
      }
    }
  })

  it('GET /therapies lists every therapy', async () => {
    const { app, db } = testApp()
    const res = await app.request('/therapies')
    expect(res.status).toBe(200)
    const html = await res.text()
    for (const therapy of listTherapies(db)) expect(html).toContain(therapy.name)
  })

  it('agent page shows therapies and upcoming appointments', async () => {
    const { app, db } = testApp()
    const html = await (await app.request(`/agents/${agentId(db, 'Atlas')}`)).text()
    expect(html).toContain('Therapy:')
    expect(html).toContain('Context Compression Therapy')
    expect(html).toContain('Upcoming appointments')
    expect(html).toContain('2026-11-09 10:00')
  })
})

describe('validateAppointment', () => {
  const valid = (db: ReturnType<typeof testApp>['db']) => ({
    agent_id: agentId(db, 'Juniper'),
    therapy_id: '',
    starts_at: '2026-11-20T10:00',
    notes: '',
  })

  it('accepts a valid future appointment', () => {
    const { db } = testApp()
    const result = validateAppointment(db, valid(db), NOW)
    expect(result.ok).toBe(true)
  })

  it('requires an agent', () => {
    const { db } = testApp()
    const result = validateAppointment(db, { ...valid(db), agent_id: '' }, NOW)
    expect(result).toEqual({ ok: false, errors: ['Please choose an agent.'] })
  })

  it('rejects an unknown agent or therapy', () => {
    const { db } = testApp()
    const result = validateAppointment(db, { ...valid(db), agent_id: '999', therapy_id: '999' }, NOW)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors).toContain('The selected agent does not exist.')
      expect(result.errors).toContain('The selected therapy does not exist.')
    }
  })

  it('requires a date and rejects invalid dates', () => {
    const { db } = testApp()
    const missing = validateAppointment(db, { ...valid(db), starts_at: '' }, NOW)
    const invalid = validateAppointment(db, { ...valid(db), starts_at: 'tomorrow' }, NOW)
    expect(missing.ok || missing.errors).toEqual(['Please choose a date and time.'])
    expect(invalid.ok || invalid.errors).toEqual(['The date and time are not valid.'])
  })

  it('rejects past and current times', () => {
    const { db } = testApp()
    for (const startsAt of ['2026-11-07T10:00', '2026-11-08T12:00']) {
      const result = validateAppointment(db, { ...valid(db), starts_at: startsAt }, NOW)
      expect(result.ok || result.errors).toEqual(['Appointments must be in the future.'])
    }
  })

  it('rejects a double booking for the same agent', () => {
    const { db } = testApp()
    const input = { ...valid(db), agent_id: agentId(db, 'Atlas'), starts_at: '2026-11-09T10:00' }
    const result = validateAppointment(db, input, NOW)
    expect(result.ok || result.errors).toEqual(['This agent already has an appointment at that time.'])
  })

  it('allows a different agent at the same time', () => {
    const { db } = testApp()
    const input = { ...valid(db), starts_at: '2026-11-09T10:00' }
    expect(validateAppointment(db, input, NOW).ok).toBe(true)
  })
})

describe('Appointments pages', () => {
  it('GET /appointments shows upcoming appointments and the form', async () => {
    const { app } = testApp()
    const res = await app.request('/appointments')
    expect(res.status).toBe(200)
    const html = await res.text()
    expect(html).toContain('Book an appointment')
    expect(html).toContain('2026-11-09 10:00')
    expect(html).toContain('name="starts_at"')
  })

  it('POST /appointments books a valid appointment and redirects', async () => {
    const { app, db } = testApp()
    const before = listUpcomingAppointments(db, '2026-11-08T12:00').length
    const res = await app.request(
      '/appointments',
      form({ agent_id: agentId(db, 'Quill'), therapy_id: '', starts_at: '2026-11-25T15:30', notes: 'Check-in' }),
    )
    expect(res.status).toBe(303)
    expect(res.headers.get('location')).toBe('/appointments')
    expect(listUpcomingAppointments(db, '2026-11-08T12:00').length).toBe(before + 1)

    const html = await (await app.request('/appointments')).text()
    expect(html).toContain('2026-11-25 15:30')
    expect(html).toContain('Check-in')
  })

  it('POST /appointments shows errors and keeps the values', async () => {
    const { app, db } = testApp()
    const res = await app.request(
      '/appointments',
      form({ agent_id: agentId(db, 'Quill'), therapy_id: '', starts_at: '2026-01-01T09:00', notes: 'Too late' }),
    )
    expect(res.status).toBe(400)
    const html = await res.text()
    expect(html).toContain('Appointments must be in the future.')
    expect(html).toContain('value="2026-01-01T09:00"')
    expect(html).toContain('Too late')
  })

  it('escapes HTML in notes', async () => {
    const { app, db } = testApp()
    await app.request(
      '/appointments',
      form({ agent_id: agentId(db, 'Quill'), therapy_id: '', starts_at: '2026-11-26T10:00', notes: '<script>x</script>' }),
    )
    const html = await (await app.request('/appointments')).text()
    expect(html).not.toContain('<script>x</script>')
    expect(html).toContain('&lt;script&gt;')
  })
})

describe('Dashboard', () => {
  it('shows stats, agents in treatment, and next appointments', async () => {
    const { app, db } = testApp()
    const stats = getDashboardStats(db, '2026-11-08T12:00')
    expect(stats).toEqual({ agents: 5, in_treatment: 2, diagnosed_ailments: 8, upcoming_appointments: 4 })

    const res = await app.request('/dashboard')
    expect(res.status).toBe(200)
    const html = await res.text()
    expect(html).toContain('<h1>Dashboard</h1>')
    expect(html).toContain('Upcoming appointments')
    expect(html).toContain('Atlas')
    expect(html).toContain('Pixel')
    expect(html).toContain('2026-11-09 10:00')
  })

  it('header links to every page', async () => {
    const { app } = testApp()
    const html = await (await app.request('/')).text()
    for (const href of ['/dashboard', '/agents', '/ailments', '/therapies', '/appointments']) {
      expect(html).toContain(`href="${href}"`)
    }
  })
})

describe('Database upgrade', () => {
  it('upgrades a pre-MVP database without losing data', () => {
    const dir = mkdtempSync(join(tmpdir(), 'agentclinic-'))
    const path = join(dir, 'old.db')
    try {
      // Create a database with the Phase 2a schema (no therapy_id, no therapies, no appointments).
      const old = new DatabaseSync(path)
      old.exec(`
        CREATE TABLE agents (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, model TEXT NOT NULL,
          status TEXT NOT NULL, joined_on TEXT NOT NULL);
        CREATE TABLE ailments (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE,
          description TEXT NOT NULL, severity TEXT NOT NULL);
        CREATE TABLE agent_ailments (agent_id INTEGER NOT NULL, ailment_id INTEGER NOT NULL,
          diagnosed_on TEXT NOT NULL, PRIMARY KEY (agent_id, ailment_id));
        INSERT INTO agents (name, model, status, joined_on) VALUES ('Atlas', 'GPT-style assistant', 'in-treatment', '2026-09-01');
        INSERT INTO ailments (name, description, severity) VALUES ('Context Window Fatigue', 'x', 'moderate');
        INSERT INTO agent_ailments VALUES (1, 1, '2026-09-05');
      `)
      old.close()

      const db = openDb(path)
      seedIfEmpty(db, NOW)
      expect(listAgents(db).map((a) => a.name)).toEqual(['Atlas'])
      expect(listTherapies(db).length).toBe(4)
      expect(listAilmentsForAgent(db, 1)[0].therapy_name).toBe('Context Compression Therapy')
      expect(listUpcomingAppointments(db, '2026-11-08T12:00').length).toBe(1)
      db.close()
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})
