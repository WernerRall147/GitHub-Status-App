import { Activity, AlertTriangle, CheckCircle2, Clock3, RefreshCw } from 'lucide-react'
import './App.css'
import { STATUS_LABELS } from './githubStatus'
import type { ComponentStatus, StatusComponent } from './types'
import { useGitHubStatus } from './useGitHubStatus'

function StatusIcon({ status }: { status: ComponentStatus }) {
  if (status === 'operational') {
    return <CheckCircle2 aria-hidden="true" />
  }
  return <AlertTriangle aria-hidden="true" />
}

function StatusRow({ component }: { component: StatusComponent }) {
  return (
    <li className={`status-row status-row--${component.status}`}>
      <span className="status-row__icon">
        <StatusIcon status={component.status} />
      </span>
      <span className="status-row__name">{component.name}</span>
      <span className="status-row__label">{STATUS_LABELS[component.status]}</span>
    </li>
  )
}

function formatUpdatedAt(value?: string) {
  if (!value) return 'Not updated yet'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Not updated yet'
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function App() {
  const { status, isLoading, error, refresh } = useGitHubStatus()

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="brand-block">
          <span className="brand-mark"><Activity aria-hidden="true" /></span>
          <div>
            <p className="eyebrow">System status</p>
            <h1>GitHub Status</h1>
          </div>
        </div>
        <button
          className="refresh-button"
          type="button"
          onClick={() => void refresh()}
          disabled={isLoading}
          aria-label={isLoading ? 'Refreshing GitHub status' : 'Refresh GitHub status'}
        >
          <RefreshCw className={isLoading ? 'spinning' : ''} aria-hidden="true" />
          <span>{isLoading ? 'Refreshing' : 'Refresh status'}</span>
        </button>
      </header>

      {error && (
        <div className="status-alert" role="alert">
          <AlertTriangle aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <section className="status-panel" aria-labelledby="services-heading">
        <div className="status-panel__header">
          <div>
            <p className="eyebrow">Current overview</p>
            <h2 id="services-heading">
              {status ? STATUS_LABELS[status.overallStatus] : 'Checking services'}
            </h2>
          </div>
          <div className="updated-time">
            <Clock3 aria-hidden="true" />
            <span>Updated {formatUpdatedAt(status?.updatedAt)}</span>
          </div>
        </div>

        {status?.incidents.length ? (
          <div className="incident-banner">
            <AlertTriangle aria-hidden="true" />
            <div>
              <strong>{status.incidents.length} active incident{status.incidents.length === 1 ? '' : 's'}</strong>
              <span>{status.incidents.map((incident) => incident.name).join(', ')}</span>
            </div>
          </div>
        ) : null}

        {isLoading && !status ? (
          <ul className="status-list" aria-label="Loading GitHub services">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <li className="status-row skeleton-row" key={item}>
                <span className="skeleton-dot" />
                <span className="skeleton-name" />
                <span className="skeleton-label" />
              </li>
            ))}
          </ul>
        ) : status ? (
          <ul className="status-list" aria-label="GitHub service status">
            {status.components.map((component) => (
              <StatusRow component={component} key={component.id} />
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <AlertTriangle aria-hidden="true" />
            <h3>Status unavailable</h3>
            <p>GitHub status could not be loaded.</p>
            <button type="button" onClick={() => void refresh()}>Try again</button>
          </div>
        )}
      </section>

      <footer>
        <a href="https://www.githubstatus.com/" target="_blank" rel="noreferrer">
          View GitHub Status website
        </a>
      </footer>
    </main>
  )
}

export default App
