import type { Agent, Appointment, DashboardStats } from '../db/types'
import { Layout } from '../components/Layout'
import { AppointmentsList } from '../components/AppointmentsList'

export type DashboardProps = {
  stats: DashboardStats
  inTreatment: Agent[]
  nextAppointments: Appointment[]
}

type StatCardProps = {
  label: string
  value: number
  href: string
}

const StatCard = ({ label, value, href }: StatCardProps) => (
  <a class="stat" href={href}>
    <span class="stat-value">{value}</span>
    <span class="stat-label">{label}</span>
  </a>
)

export const Dashboard = ({ stats, inTreatment, nextAppointments }: DashboardProps) => (
  <Layout title="Dashboard">
    <h1>Dashboard</h1>

    <div class="stats">
      <StatCard label="Agents" value={stats.agents} href="/agents" />
      <StatCard label="In treatment" value={stats.in_treatment} href="/agents" />
      <StatCard label="Diagnosed ailments" value={stats.diagnosed_ailments} href="/ailments" />
      <StatCard label="Upcoming appointments" value={stats.upcoming_appointments} href="/appointments" />
    </div>

    <h2>Agents in treatment</h2>
    {inTreatment.length === 0 ? (
      <p class="empty">No agents are in treatment.</p>
    ) : (
      <ul class="pill-list">
        {inTreatment.map((agent) => (
          <li>
            <a href={`/agents/${agent.id}`}>{agent.name}</a>
          </li>
        ))}
      </ul>
    )}

    <h2>Next appointments</h2>
    <AppointmentsList appointments={nextAppointments} />
    <p>
      <a href="/appointments" class="button">
        Book an appointment
      </a>
    </p>
  </Layout>
)
