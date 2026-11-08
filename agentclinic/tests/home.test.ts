import { describe, it, expect } from 'vitest'
import { testApp } from './helpers'

const { app } = testApp()

describe('Home page', () => {
  it('returns 200 with HTML', async () => {
    const res = await app.request('/')
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('text/html')
  })

  it('shows the AgentClinic heading and tagline', async () => {
    const html = await (await app.request('/')).text()
    expect(html).toContain('<h1>AgentClinic</h1>')
    expect(html).toContain('class="tagline"')
  })

  it('renders the shared layout: header, main and footer', async () => {
    const html = await (await app.request('/')).text()
    expect(html).toContain('<header class="site-header">')
    expect(html).toContain('<main class="site-main">')
    expect(html).toContain('<footer class="site-footer">')
  })

  it('links the stylesheet and sets a mobile viewport', async () => {
    const html = await (await app.request('/')).text()
    expect(html).toContain('href="/static/style.css"')
    expect(html).toContain('name="viewport"')
  })

  it('has navigation links to agents and ailments', async () => {
    const html = await (await app.request('/')).text()
    expect(html).toContain('href="/agents"')
    expect(html).toContain('href="/ailments"')
  })
})

describe('Static files', () => {
  it('serves style.css', async () => {
    const res = await app.request('/static/style.css')
    expect(res.status).toBe(200)
    expect(await res.text()).toContain('.site-header')
  })

  it('returns 404 for an unknown page', async () => {
    const res = await app.request('/no-such-page')
    expect(res.status).toBe(404)
  })
})
