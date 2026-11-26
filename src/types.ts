export type ComponentStatus =
  | 'operational'
  | 'degraded_performance'
  | 'partial_outage'
  | 'major_outage'
  | 'under_maintenance'
  | 'unknown'

export interface StatusComponent {
  id: string
  name: string
  status: ComponentStatus
  description: string
}

export interface ActiveIncident {
  id: string
  name: string
  status: string
  impact: string
  updatedAt: string
}

export interface GitHubStatus {
  overallStatus: ComponentStatus
  components: StatusComponent[]
  incidents: ActiveIncident[]
  updatedAt: string
}
