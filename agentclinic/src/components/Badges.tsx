import type { AgentStatus, Severity } from '../db/types'

export type StatusBadgeProps = {
  status: AgentStatus
}

export const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span class={`badge badge-${status}`}>{status.replace('-', ' ')}</span>
)

export type SeverityBadgeProps = {
  severity: Severity
}

export const SeverityBadge = ({ severity }: SeverityBadgeProps) => (
  <span class={`badge badge-${severity}`}>{severity}</span>
)
