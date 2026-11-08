import type { LocalDateTime } from './types'

const pad = (n: number) => String(n).padStart(2, '0')

/** Formats a Date as local `YYYY-MM-DDTHH:MM`. */
export function toLocalDateTime(date: Date): LocalDateTime {
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  )
}

/** A date `days` from `from`, at `hour`:00 local time. */
export function daysFrom(from: Date, days: number, hour: number): LocalDateTime {
  const d = new Date(from)
  d.setDate(d.getDate() + days)
  d.setHours(hour, 0, 0, 0)
  return toLocalDateTime(d)
}

/** `2026-11-10T14:00` → `2026-11-10 14:00` */
export function formatDateTime(value: LocalDateTime): string {
  return value.replace('T', ' ')
}

export function isLocalDateTime(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) && !Number.isNaN(new Date(value).getTime())
}
