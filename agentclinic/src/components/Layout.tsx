import type { Child } from 'hono/jsx'
import { Header } from './Header'
import { Main } from './Main'
import { Footer } from './Footer'

export type LayoutProps = {
  title: string
  children?: Child
}

export const Layout = ({ title, children }: LayoutProps) => (
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{title === 'AgentClinic' ? title : `${title} · AgentClinic`}</title>
      <link rel="stylesheet" href="/static/style.css" />
    </head>
    <body>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </body>
  </html>
)
