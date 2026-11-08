import type { Agent } from '../db/types'
import { StatusBadge } from './Badges'

export type AgentsListProps = {
  agents: Agent[]
}

export const AgentsList = ({ agents }: AgentsListProps) => (
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Model</th>
          <th>Status</th>
          <th>Joined</th>
        </tr>
      </thead>
      <tbody>
        {agents.map((agent) => (
          <tr>
            <td>
              <a href={`/agents/${agent.id}`}>{agent.name}</a>
            </td>
            <td>{agent.model}</td>
            <td>
              <StatusBadge status={agent.status} />
            </td>
            <td>{agent.joined_on}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
