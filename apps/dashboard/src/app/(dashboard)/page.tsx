import { Card, CardHeader, CardBody, Button } from '@devpulse/ui'
import { formatRelativeTime } from '@devpulse/utils'

export default function HomePage() {
  const lastUpdated = formatRelativeTime(new Date(Date.now() - 1000 * 60 * 3))

  return (
    <main style={{ padding: '2rem', maxWidth: '960px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>DevPulse</h1>
      <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Updated {lastUpdated}</p>

      <Card>
        <CardHeader>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Welcome</h2>
        </CardHeader>
        <CardBody>
          <p style={{ marginBottom: '1rem', color: '#94a3b8' }}>
            Monorepo is wired up. Dashboard, UI, and Utils packages are all talking to each other.
          </p>
          <Button variant="primary">Get started</Button>
        </CardBody>
      </Card>
    </main>
  )
}
