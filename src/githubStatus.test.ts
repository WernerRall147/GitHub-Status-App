import { describe, expect, it } from 'vitest'
import { normalizeComponentStatus, normalizeGitHubStatus } from './githubStatus'

describe('normalizeComponentStatus', () => {
  it('maps supported states and falls back for unknown values', () => {
    expect(normalizeComponentStatus('operational')).toBe('operational')
    expect(normalizeComponentStatus('none')).toBe('operational')
    expect(normalizeComponentStatus('major_outage')).toBe('major_outage')
    expect(normalizeComponentStatus('unexpected')).toBe('unknown')
  })
})

describe('normalizeGitHubStatus', () => {
  it('normalizes components and sorts them by name', () => {
    const status = normalizeGitHubStatus({
      status: { indicator: 'major', description: 'Major outage' },
      page: { updated_at: '2026-11-26T12:00:00Z' },
      components: [
        { id: '2', name: 'Git Operations', status: 'major_outage' },
        { id: '1', name: 'API Requests', status: 'operational' },
      ],
      incidents: [],
    })

    expect(status.components.map((component) => component.name)).toEqual([
      'API Requests',
      'Git Operations',
    ])
    expect(status.components[1].status).toBe('major_outage')
    expect(status.overallStatus).toBe('major_outage')
  })

  it('rejects responses without components', () => {
    expect(() => normalizeGitHubStatus({ status: {} })).toThrow(
      'GitHub Status component data is unavailable.',
    )
  })
})
