import type {
  ActiveIncident,
  ComponentStatus,
  GitHubStatus,
  StatusComponent,
} from './types'

interface StatuspageComponent {
  id?: string
  name?: string
  status?: string
  group_id?: string | null
}

interface StatuspageIncident {
  id?: string
  name?: string
  status?: string
  impact?: string
  updated_at?: string
}

interface StatuspageSummary {
  status?: { indicator?: string; description?: string }
  components?: StatuspageComponent[]
  incidents?: StatuspageIncident[]
  page?: { updated_at?: string }
}

export const STATUS_LABELS: Record<ComponentStatus, string> = {
  operational: 'Operational',
  degraded_performance: 'Degraded performance',
  partial_outage: 'Partial outage',
  major_outage: 'Major outage',
  under_maintenance: 'Under maintenance',
  unknown: 'Unknown',
}

export function normalizeComponentStatus(status?: string): ComponentStatus {
  switch (status) {
    case 'operational':
    case 'none':
      return 'operational'
    case 'degraded_performance':
    case 'partial_outage':
    case 'major_outage':
    case 'under_maintenance':
      return status
    case 'degraded':
      return 'degraded_performance'
    case 'partial':
      return 'partial_outage'
    case 'major':
      return 'major_outage'
    case 'maintenance':
      return 'under_maintenance'
    default:
      return 'unknown'
  }
}

export function normalizeGitHubStatus(payload: unknown): GitHubStatus {
  if (!payload || typeof payload !== 'object') {
    throw new Error('GitHub Status returned an invalid response.')
  }

  const summary = payload as StatuspageSummary
  if (!Array.isArray(summary.components)) {
    throw new Error('GitHub Status component data is unavailable.')
  }

  const components: StatusComponent[] = summary.components
    .filter((component) => component && !component.group_id)
    .map((component) => {
      const status = normalizeComponentStatus(component.status)
      return {
        id: component.id ?? component.name ?? 'unknown',
        name: component.name ?? 'Unknown service',
        status,
        description: STATUS_LABELS[status],
      }
    })
    .sort((left, right) => left.name.localeCompare(right.name))

  const incidents: ActiveIncident[] = (summary.incidents ?? []).map((incident) => ({
    id: incident.id ?? incident.name ?? 'unknown',
    name: incident.name ?? 'Active incident',
    status: incident.status ?? 'investigating',
    impact: incident.impact ?? 'unknown',
    updatedAt: incident.updated_at ?? '',
  }))

  return {
    overallStatus: normalizeComponentStatus(summary.status?.indicator),
    components,
    incidents,
    updatedAt: summary.page?.updated_at ?? new Date().toISOString(),
  }
}

export async function fetchGitHubStatus(signal?: AbortSignal): Promise<GitHubStatus> {
  const response = await fetch('/api/v2/summary.json', {
    signal,
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`GitHub Status request failed (${response.status}).`)
  }

  return normalizeGitHubStatus(await response.json())
}
