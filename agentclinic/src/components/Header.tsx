const LINKS = [
  ['/', 'Home'],
  ['/dashboard', 'Dashboard'],
  ['/agents', 'Agents'],
  ['/ailments', 'Ailments'],
  ['/therapies', 'Therapies'],
  ['/appointments', 'Appointments'],
] as const

export const Header = () => (
  <header class="site-header">
    <a href="/" class="brand">
      Agent<span>Clinic</span>
    </a>
    <nav>
      {LINKS.map(([href, label]) => (
        <a href={href}>{label}</a>
      ))}
    </nav>
  </header>
)
